<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;

/** Fungsi: keranjang belanja milik user yang login (lihat, tambah, ubah jumlah, hapus). */
class CartController extends Controller
{
    // Isi keranjang milik user yang sedang login beserta subtotal dan total
    public function index(Request $request)
    {
        $items = $request->user()->carts()->with('book')->get();

        $total = $items->sum(fn ($item) => $item->qty * $item->book->price);

        return response()->json([
            'items' => $items->map(fn ($item) => [
                'id'       => $item->id,
                'book_id'  => $item->book_id,
                'qty'      => $item->qty,
                'subtotal' => $item->qty * $item->book->price,
                'book'     => $item->book,
            ]),
            'total' => $total,
        ]);
    }

        // Tambah buku ke keranjang; kalau sudah ada, jumlahnya bertambah
    public function store(Request $request)
    {
        $data = $request->validate([
            'book_id' => 'required|integer|exists:books,id',
            'qty'     => 'required|integer|min:1',
        ]);

        $book = Book::findOrFail($data['book_id']);
        $cart = $request->user()->carts()->where('book_id', $book->id)->first();

        $inCart = $cart?->qty ?? 0;
        $newQty = $inCart + $data['qty'];

        if ($newQty > $book->stock) {
            return response()->json([
                'message' => 'Stok tidak cukup',
                'stock'   => $book->stock,
                'in_cart' => $inCart,
            ], 422);
        }

        if ($cart) {
            $cart->update(['qty' => $newQty]);
            $status = 200;
        } else {
            $cart = $request->user()->carts()->create(['book_id' => $book->id, 'qty' => $newQty]);
            $status = 201;
        }

        return response()->json($cart->load('book'), $status);
    }

        // Tetapkan jumlah item di keranjang milik sendiri
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $cart = $request->user()->carts()->with('book')->findOrFail($id);

        if ($data['qty'] > $cart->book->stock) {
            return response()->json([
                'message' => 'Stok tidak cukup',
                'stock'   => $cart->book->stock,
            ], 422);
        }

        $cart->update(['qty' => $data['qty']]);

        return response()->json($cart);
    }

        // Hapus item dari keranjang milik sendiri
    public function destroy(Request $request, $id)
    {
        $cart = $request->user()->carts()->findOrFail($id);
        $cart->delete();

        return response()->json(['message' => 'Item dihapus dari keranjang']);
    }
}