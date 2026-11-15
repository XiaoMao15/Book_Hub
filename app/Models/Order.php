<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Fungsi: model tabel orders; satu pesanan milik user dan punya banyak item. */
class Order extends Model
{
    protected $fillable = ['user_id', 'total', 'status', 'address', 'payment_method'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}