<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

/** Fungsi: admin melihat daftar user beserta jumlah pesanannya. */
class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::withCount('orders')
            ->when($request->role, fn ($q, $role) => $q->where('role', $role))
            ->orderBy('id')
            ->get();

        return response()->json($users);
    }
}