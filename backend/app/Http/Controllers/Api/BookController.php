<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;

/** Fungsi: daftar dan detail buku (publik), tambah/ubah/hapus buku (khusus admin). */
class BookController extends Controller
{
    // Daftar buku; mendukung ?q=kata (judul atau penulis) dan ?genre_id=angka
    public function index(Request $request)
    {
        $books = Book::with('genre')
            ->when($request->q, function ($query, $q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('title', 'like', "%{$q}%")
                        ->orWhere('author', 'like', "%{$q}%");
                });
            })
            ->when($request->genre_id, fn ($query, $genreId) => $query->where('genre_id', $genreId))
            ->orderBy('title')
            ->get();

        return response()->json($books);
    }

    // Detail satu buku
    public function show(Book $book)
    {
        return response()->json($book->load('genre'));
    }

        // Tambah buku baru (admin)
    public function store(Request $request)
    {
        $data = $request->validate([
            'genre_id'    => 'required|integer|exists:genres,id',
            'title'       => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'cover'       => 'nullable|string|max:255',
        ]);

        $book = Book::create($data);

        return response()->json($book->load('genre'), 201);
    }

        // Ubah data buku (admin)
    public function update(Request $request, Book $book)
    {
        $data = $request->validate([
            'genre_id'    => 'required|integer|exists:genres,id',
            'title'       => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'stock'       => 'required|integer|min:0',
            'cover'       => 'nullable|string|max:255',
        ]);

        $book->update($data);

        return response()->json($book->load('genre'));
    }

        // Hapus buku (admin); ditolak kalau buku sudah pernah dipesan
    public function destroy(Book $book)
    {
        if ($book->orderItems()->exists()) {
            return response()->json(['message' => 'Buku sudah pernah dipesan, tidak bisa dihapus'], 409);
        }

        $book->delete();

        return response()->json(['message' => 'Buku dihapus']);
    }
}