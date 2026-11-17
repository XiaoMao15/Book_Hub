# Book.Hub

Book.Hub adalah aplikasi toko buku online. Pengunjung bisa melihat katalog buku, mencari judul atau penulis, dan memfilter berdasarkan genre. Customer bisa memasukkan buku ke keranjang, checkout dengan COD, lalu memantau status pesanannya. Admin mengelola buku, genre, pesanan, user, dan pesan masuk lewat panel admin.

Backend dibuat dengan Laravel sebagai REST API, dan frontend dibuat dengan React. Keduanya berjalan terpisah dan berkomunikasi lewat JSON.

Proyek ini dibuat untuk uji kompetensi BNSP Junior Web Developer.

## Fitur

**Pengunjung**
- Melihat katalog dan detail buku
- Mencari buku berdasarkan judul atau penulis, dan filter per genre
- Mengirim pesan lewat halaman Contact Us
- Daftar akun dan login

**Customer**
- Menambah buku ke keranjang, mengubah jumlah, dan menghapus item
- Checkout dengan alamat pengiriman dan pembayaran COD
- Melihat riwayat pesanan beserta statusnya

**Admin**
- Dashboard ringkasan: jumlah buku, pesanan, pendapatan, dan pesan baru
- CRUD genre dan buku
- Mengubah status pesanan (menunggu, diproses, selesai, dibatalkan)
- Melihat daftar user dan membaca pesan masuk

Beberapa aturan yang diterapkan di backend:
- Login memakai token Laravel Sanctum, dan akses dibatasi per role (admin/customer).
- Checkout dijalankan di dalam transaksi database, jadi stok tidak bisa minus.
- Harga buku disimpan ke rincian pesanan saat checkout, sehingga riwayat pesanan tidak berubah walaupun harga buku diubah.
- Pesanan yang dibatalkan mengembalikan stok.
- Genre yang masih dipakai buku dan buku yang sudah pernah dipesan tidak bisa dihapus.

## Teknologi

- Backend: PHP, Laravel, Laravel Sanctum
- Database: MySQL
- Frontend: React, Vite, React Router, Axios
- Styling: CSS biasa tanpa framework

## Instalasi

Yang perlu disiapkan: PHP, Composer, Node.js, MySQL (misalnya XAMPP), dan Git.

```bash
git clone https://github.com/XiaoMao15/Book_Hub.git
cd Book_Hub
```

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Buat database `book_hub` di MySQL, lalu sesuaikan `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=book_hub
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi dan seeder, lalu nyalakan server:

```bash
php artisan migrate --seed
php artisan serve
```

API berjalan di `http://127.0.0.1:8000/api`.

### Frontend

Di terminal lain:

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. Alamat API bisa diubah di `frontend/src/services/api.js`.

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Admin | admin@bookhub.test | password123 |
| Customer | customer@bookhub.test | password123 |

## Endpoint API

Semua endpoint diawali `/api`. Endpoint yang butuh login memakai header `Authorization: Bearer {token}`.

| Method | Endpoint | Akses | Keterangan |
|---|---|---|---|
| POST | /register | Publik | Daftar akun customer |
| POST | /login | Publik | Login, mengembalikan token |
| GET | /genres | Publik | Daftar genre |
| GET | /books | Publik | Daftar buku |
| GET | /books/{id} | Publik | Detail buku |
| POST | /messages | Publik | Kirim pesan |
| POST | /logout | Login | Logout |
| GET | /cart | Customer | Isi keranjang |
| POST | /cart | Customer | Tambah ke keranjang |
| PUT | /cart/{id} | Customer | Ubah jumlah |
| DELETE | /cart/{id} | Customer | Hapus item |
| POST | /orders | Customer | Checkout |
| GET | /orders | Customer | Riwayat pesanan |
| GET | /orders/{id} | Customer | Detail pesanan |
| POST | /genres | Admin | Tambah genre |
| PUT | /genres/{id} | Admin | Ubah genre |
| DELETE | /genres/{id} | Admin | Hapus genre |
| POST | /books | Admin | Tambah buku |
| PUT | /books/{id} | Admin | Ubah buku |
| DELETE | /books/{id} | Admin | Hapus buku |
| GET | /admin/users | Admin | Daftar user |
| GET | /admin/orders | Admin | Daftar pesanan |
| GET | /admin/orders/{id} | Admin | Detail pesanan |
| PUT | /admin/orders/{id} | Admin | Ubah status pesanan |
| GET | /admin/messages | Admin | Daftar pesan |
| GET | /admin/messages/{id} | Admin | Detail pesan |
| PUT | /admin/messages/{id}/read | Admin | Tandai pesan dibaca |