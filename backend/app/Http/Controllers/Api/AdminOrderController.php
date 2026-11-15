<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Facades\DB;

/** Fungsi: admin melihat dan mengelola semua pesanan dari semua customer. */
class AdminOrderController extends Controller

{
    // alur status yang diizinkan: dari status => daftar tujuan
    private const TRANSITIONS = [
        'pending' => ['processing', 'cancelled'],
        'processing' => ['completed', 'cancelled'],
        'completed' => [],
        'cancelled' => [],
    ];

    public function index(Request $request)
    {
        $orders = Order::with('user:id,name,email')
            ->withCount('items')
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->orderByDesc('id')
            ->get();

        return response()->json($orders);
    }
        public function show($id)
    {
        $order = Order::with(['user:id,name,email', 'items.book'])
            ->findOrFail($id);

        return response()->json($order);
    }

        public function update(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:processing,completed,cancelled',
        ]);

        $order = Order::with('items')->findOrFail($id);

        if (! in_array($data['status'], self::TRANSITIONS[$order->status] ?? [])) {
            return response()->json([
                'message' => "Status tidak bisa diubah dari {$order->status} ke {$data['status']}",
            ], 422);
        }

        DB::transaction(function () use ($order, $data) {
            if ($data['status'] === 'cancelled') {
                // pesanan batal: kembalikan stok tiap buku
                foreach ($order->items as $item) {
                    Book::where('id', $item->book_id)->increment('stock', $item->qty);
                }
            }
            $order->update(['status' => $data['status']]);
        });

        return response()->json($order->load('user:id,name,email', 'items.book'));
    }
}