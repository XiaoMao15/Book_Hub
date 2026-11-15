<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Fungsi: membatasi akses route berdasarkan role user (contoh pemakaian: role:admin). */
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if ($request->user()?->role !== $role) {
            return response()->json(['message' => 'Akses ditolak: butuh role ' . $role], 403);
        }

        return $next($request);
    }
}