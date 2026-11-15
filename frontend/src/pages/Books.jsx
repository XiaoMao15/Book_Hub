// Fungsi: halaman daftar buku; cari judul/penulis dan filter genre (genre tersimpan di URL ?genre=)
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import './Books.css';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = searchParams.get('genre') || '';

  useEffect(() => {
    Promise.all([api.get('/books'), api.get('/genres')])
      .then(([b, g]) => {
        setBooks(b.data);
        setGenres(g.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const keyword = search.toLowerCase();
  const filtered = books.filter((b) => {
    const matchGenre = !genreId || String(b.genre_id) === genreId;
    const matchSearch =
      b.title.toLowerCase().includes(keyword) || b.author.toLowerCase().includes(keyword);
    return matchGenre && matchSearch;
  });

  const pickGenre = (id) => setSearchParams(id ? { genre: id } : {});

  return (
    <div className="books">
      <header className="books__head">
        <div>
          <h1>Koleksi Buku</h1>
          <p>{loading ? 'Memuat...' : `${filtered.length} buku ditemukan`}</p>
        </div>

        <label className="books__search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </header>

      <div className="books__filters">
        <button type="button" className={!genreId ? 'is-active' : ''} onClick={() => pickGenre('')}>
          Semua
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            type="button"
            className={genreId === String(g.id) ? 'is-active' : ''}
            onClick={() => pickGenre(String(g.id))}
          >
            {g.name}
          </button>
        ))}
      </div>

      {!loading && filtered.length === 0 ? (
        <div className="books__empty">
          <p>Buku tidak ditemukan.</p>
          <span>Coba kata kunci atau genre lain.</span>
        </div>
      ) : (
        <div className="book-grid" key={`${genreId}-${search}`}>
          {filtered.map((b, i) => (
            <div key={b.id} className="books__item" style={{ animationDelay: `${i * 0.06}s` }}>
              <BookCard book={b} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}