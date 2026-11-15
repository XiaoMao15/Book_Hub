<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

/** Fungsi: autentikasi API (register, login, logout) memakai token Sanctum. */
class AuthController extends Controller
{
    // Fungsi untuk mendaftar akun baru
    public function register(Request $request)
    {
        // 1. Validasi input dari React
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // 2. Buat data user baru ke database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // role tidak diisi di sini karena otomatis 'customer' dari database
        ]);

        // Ambil ulang dari DB agar kolom role (default customer) ikut tampil
        $user->refresh();

        // 3. Buat token Sanctum untuk akses API
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Kembalikan balasan berupa JSON
        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // Fungsi untuk masuk (login)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 1. Cari user berdasarkan email
        $user = User::where('email', $request->email)->first();

        // 2. Cek apakah user ada dan passwordnya cocok
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah',
            ], 401); // 401 = Unauthorized (gagal masuk)
        }

        // 3. Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Fungsi untuk keluar (logout)
    public function logout(Request $request)
    {
        // Hapus token yang sedang dipakai
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
}