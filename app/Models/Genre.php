<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Fungsi: model tabel genres; satu genre punya banyak buku. */
class Genre extends Model
{
    protected $fillable = ['name'];

    public function books()
    {
        return $this->hasMany(Book::class);
    }
}