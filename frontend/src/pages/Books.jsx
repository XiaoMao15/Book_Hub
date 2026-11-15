// Fungsi: halaman daftar buku; sementara berupa daftar teks, kartu buku menyusul
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/books')
      .then((res) => setBooks(res.data))
      .catch(() => setError('Gagal terhubung ke API'));
  }, []);

  return (
    <div>
      <h1>Book</h1>
      {error && <p>{error}</p>}
      <ul>
        {books.map((b) => (
          <li key={b.id}>{b.title} - {b.author}</li>
        ))}
      </ul>
    </div>
  );
}