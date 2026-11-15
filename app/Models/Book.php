<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Fungsi: model tabel books; setiap buku milik satu genre. */
class Book extends Model
{
    protected $fillable = ['genre_id', 'title', 'author', 'description', 'price', 'stock', 'cover'];

    public function genre()
    {
        return $this->belongsTo(Genre::class);
    }

        public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}