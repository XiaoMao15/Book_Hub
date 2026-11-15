<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Fungsi: checkout keranjang menjadi pesanan dan riwayat pesanan customer. */
class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'address' => 'required|string|max:500',
            'payment_method' => 'required|in:cod',
        ]);

        $carts = $request->user()->carts()->get();
        if ($carts->isEmpty()) {
            return response()->json(['message' => 'Keranjang kosong'], 422);
        }

        $order = DB::transaction(function () use ($request, $data, $carts) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total' => 0,
                'address' => $data['address'],
                'payment_method' => $data['payment_method'],
            ]);

            $total = 0;
            foreach ($carts as $cart) {
                // kunci baris buku agar stok tidak berubah di tengah proses
                $book = Book::lockForUpdate()->find($cart->book_id);

                if ($book->stock < $cart->qty) {
                    abort(422, "Stok tidak cukup: {$book->title}");
                }

                $order->items()->create([
                    'book_id' => $book->id,
                    'qty' => $cart->qty,
                    'price' => $book->price, // harga disalin saat beli
                ]);

                $book->decrement('stock', $cart->qty);
                $total += $book->price * $cart->qty;
            }

            $order->update(['total' => $total]);
            $request->user()->carts()->delete();

            return $order;
            
        });

        return response()->json($order->refresh()->load('items.book'), 201);
    }

        public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('items.book')
            ->orderByDesc('id')
            ->get();

        return response()->json($orders);
    }

        public function show(Request $request, $id)
    {
        $order = $request->user()->orders()
            ->with('items.book')
            ->findOrFail($id);

        return response()->json($order);
    }
}