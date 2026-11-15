<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/** Fungsi: titik masuk seeder; memanggil seeder per tabel secara berurutan. */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            GenreSeeder::class,
            BookSeeder::class, // harus setelah GenreSeeder (butuh genre_id)
        ]);
    }
}