<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Fungsi: model tabel order_items; rincian buku dalam satu pesanan. */
class OrderItem extends Model
{
    protected $fillable = ['order_id', 'book_id', 'qty', 'price'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}