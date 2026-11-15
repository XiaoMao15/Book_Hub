<?php

namespace Database\Seeders;

use App\Models\Genre;
use Illuminate\Database\Seeder;

/** Fungsi: mengisi data genre (kategori buku). */
class GenreSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Fantasy', 'Action & Adventure', 'Science Fiction', 'Dystopia'] as $name) {
            Genre::create(['name' => $name]);
        }
    }
}