<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::guard('api')->user();

        $query = Task::query();

        if (!$user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('title', 'like', '%' . $search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $perPage = $request->get('per_page', 10);

        $tasks = $query->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $user = Auth::guard('api')->user();

        $rules = [
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'status'      => 'required|in:pending,in_progress,completed',
        ];

        if ($user->isAdmin()) {
            $rules['user_id'] = 'required|exists:users,id';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $assignedTo = $user->isAdmin() ? $request->user_id : $user->id;

        $task = Task::create([
            'user_id'     => $assignedTo,
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => $request->status,
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task'    => $task->load('user:id,name,email'),
        ], 201);
    }

    public function show($id)
    {
        $user = Auth::guard('api')->user();
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        if (!$user->isAdmin() && $task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(['task' => $task]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::guard('api')->user();
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        if (!$user->isAdmin() && $task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $rules = [
            'title'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'status'      => 'required|in:pending,in_progress,completed',
        ];

        if ($user->isAdmin()) {
            $rules['user_id'] = 'required|exists:users,id';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $data = [
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => $request->status,
        ];

        if ($user->isAdmin()) {
            $data['user_id'] = $request->user_id;
        }

        $task->update($data);

        return response()->json([
            'message' => 'Task updated successfully',
            'task'    => $task->load('user:id,name,email'),
        ]);
    }

    public function delete($id)
    {
        $user = Auth::guard('api')->user();
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        if (!$user->isAdmin() && $task->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
