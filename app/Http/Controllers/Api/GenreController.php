<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use Illuminate\Http\Request;

/** Fungsi: daftar genre (publik) dan tambah/ubah/hapus genre (khusus admin). */
class GenreController extends Controller
{
    // Daftar semua genre beserta jumlah bukunya
    public function index()
    {
        return response()->json(Genre::withCount('books')->orderBy('name')->get());
    }

    // Tambah genre baru
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:genres,name',
        ]);

        return response()->json(Genre::create($data), 201);
    }

    // Ubah nama genre (nama boleh sama dengan miliknya sendiri)
    public function update(Request $request, Genre $genre)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100|unique:genres,name,' . $genre->id,
        ]);
        $genre->update($data);

        return response()->json($genre);
    }

    // Hapus genre, ditolak kalau masih dipakai buku
    public function destroy(Genre $genre)
    {
        if ($genre->books()->exists()) {
            return response()->json(['message' => 'Genre masih dipakai buku, tidak bisa dihapus'], 409);
        }

        $genre->delete();

        return response()->json(['message' => 'Genre dihapus']);
    }
}