<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'user')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return response()->json(['users' => $users]);
    }
}
