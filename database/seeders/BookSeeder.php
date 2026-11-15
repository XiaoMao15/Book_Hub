<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Genre;
use Illuminate\Database\Seeder;

/** Fungsi: mengisi data buku contoh; genre dicari lewat nama, bukan angka ID. */
class BookSeeder extends Seeder
{
    public function run(): void
    {
        $genres = Genre::pluck('id', 'name'); // ['Fantasy' => 1, ...]

        $books = [
            [
                'title' => 'Lord of the Mysteries',
                'author' => 'Cuttlefish That Loves Diving',
                'genre' => 'Fantasy',
                'description' => 'Petualangan Klein Moretti di dunia steampunk dan sihir.',
                'price' => 80000,
                'stock' => 50,
                'cover' => 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1747185207i/222645586.jpg',
            ],
            [
                'title' => 'Reverend Insanity',
                'author' => 'Gu Zhen Ren',
                'genre' => 'Fantasy',
                'description' => 'Perjalanan Fang Yuan mengejar keabadian.',
                'price' => 90000,
                'stock' => 20,
                'cover' => 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1524131925i/39892810.jpg',
            ],
            [
                'title' => "Omniscient Reader's Viewpoint",
                'author' => 'Sing Shong',
                'genre' => 'Action & Adventure',
                'description' => 'Kim Dokja bertahan hidup di dunia yang berubah menjadi cerita.',
                'price' => 80000,
                'stock' => 40,
                'cover' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdObReHiS7_sB2T0RGY_AIqRAMMHPyoeUWykA7yCCNjQ&s=10',
            ],
            [
                'title' => 'The Lord of the Rings',
                'author' => 'J.R.R. Tolkien',
                'genre' => 'Fantasy',
                'description' => 'Perjalanan membawa One Ring ke Mount Doom.',
                'price' => 95000,
                'stock' => 15,
                'cover' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxMBdja7Esm2iXS_2tYWpGQD1ymXyCalM0xcKbd72hzUbco653V6ZRZhCz&s=10',
            ],
            [
                'title' => 'Shadow Slave',
                'author' => 'Guilty Three',
                'genre' => 'Action & Adventure',
                'description' => 'Sunny bertahan hidup di dunia penuh Nightmare Spell.',
                'price' => 88000,
                'stock' => 30,
                'cover' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlshXmgGakugQ5ahWcRYFAbf9hbXcqrqRJ0uCYFNLZVYrI4hAB9KcIvI0&s=10',
            ],
            // Buku lama dari booksales (harga dan stok sementara, silakan sesuaikan)
            [
                'title' => 'Harry Potter',
                'author' => 'J.K. Rowling',
                'genre' => 'Fantasy',
                'description' => 'Seorang penyihir muda menghadapi dunia sihir di Hogwarts.',
                'price' => 85000,
                'stock' => 25,
                'cover' => 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1598823299i/42844155.jpg',
            ],
            [
                'title' => '1984',
                'author' => 'George Orwell',
                'genre' => 'Dystopia',
                'description' => 'Kisah masyarakat totaliter di bawah pengawasan Big Brother.',
                'price' => 70000,
                'stock' => 25,
                'cover' => 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/b468d093312907.5e6139cf2ab03.png',
            ],
            [
                'title' => "The Hitchhiker's Guide to the Galaxy",
                'author' => 'Douglas Adams',
                'genre' => 'Science Fiction',
                'description' => 'Petualangan komedi mengelilingi galaksi setelah Bumi dihancurkan.',
                'price' => 75000,
                'stock' => 25,
                'cover' => 'https://ik.imagekit.io/panmac/tr:w-3840,pr-true,f-auto/bcd02f72-b50c-0179-8b4b-5e44f5340bd4/0731ccbe-23bb-43a5-9e0e-9a33fbc9213f/hitchhikers-guide-to-the-galaxy-42nd-anniversary-cover.jpg',
            ],
            [
                'title' => 'The Hobbit',
                'author' => 'J.R.R. Tolkien',
                'genre' => 'Fantasy',
                'description' => 'Bilbo Baggins ikut petualangan merebut kembali harta karun naga.',
                'price' => 85000,
                'stock' => 25,
                'cover' => 'https://d3ddkgxe55ca6c.cloudfront.net/assets/t1496538667/a/af/64/147470-ml-1141823.jpg',
            ],
        ];

        foreach ($books as $item) {
            Book::create([
                'genre_id' => $genres[$item['genre']],
                'title' => $item['title'],
                'author' => $item['author'],
                'description' => $item['description'],
                'price' => $item['price'],
                'stock' => $item['stock'],
                'cover' => $item['cover'],
            ]);
        }
    }
}