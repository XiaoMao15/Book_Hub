<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Fungsi: model tabel carts; item keranjang milik user dan merujuk ke buku. */
class Cart extends Model
{
    protected $fillable = ['user_id', 'book_id', 'qty'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}