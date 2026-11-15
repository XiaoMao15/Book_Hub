<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/** Fungsi: membuat akun admin dan customer untuk uji coba. */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Password di-hash otomatis oleh cast 'hashed' di model User
        User::create(['name' => 'Admin Book.Hub', 'email' => 'admin@bookhub.test', 'password' => 'password123', 'role' => 'admin']);
        User::create(['name' => 'Customer Demo', 'email' => 'customer@bookhub.test', 'password' => 'password123', 'role' => 'customer']);
    }
}