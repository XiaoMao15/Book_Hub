// Fungsi: kartu buku (cover, genre, judul, penulis, harga) yang dipakai ulang di Home dan halaman Buku
import { Link } from 'react-router-dom';
import './BookCard.css';

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="book-card__cover">
        <img src={book.cover} alt={book.title} loading="lazy" />
        {book.stock === 0 && <span className="book-card__badge">Habis</span>}
      </div>
      <div className="book-card__body">
        {book.genre?.name && <span className="book-card__genre">{book.genre.name}</span>}
        <h3>{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        <p className="book-card__price">{rupiah(book.price)}</p>
      </div>
    </Link>
  );
}