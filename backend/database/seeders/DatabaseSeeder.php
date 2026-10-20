<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Default admin
        $admin = User::create([
            'name'     => 'Admin',
            'email'    => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Default regular user
        $user = User::create([
            'name'     => 'Resnith',
            'email'    => 'resnithnest@gmail.com',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);

        // Some sample tasks
        Task::create([
            'user_id'     => $admin->id,
            'title'       => 'Review Q1 maintenance reports',
            'description' => 'Go through all pending maintenance reports from field engineers.',
            'status'      => 'pending',
        ]);

        Task::create([
            'user_id'     => $user->id,
            'title'       => 'Install VFD at client site',
            'description' => 'Schedule and commission variable frequency drive installation.',
            'status'      => 'in_progress',
        ]);

        Task::create([
            'user_id'     => $user->id,
            'title'       => 'PLC program backup',
            'description' => 'Backup PLC programs for all active sites.',
            'status'      => 'completed',
        ]);
    }
}
