<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/** Fungsi: model tabel messages; pesan dari form Contact Us. */
class Message extends Model
{
    protected $fillable = ['name', 'email', 'message'];
}
