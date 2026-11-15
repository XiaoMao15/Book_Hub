// Fungsi: halaman Home; hero dengan cover mengambang, lalu kartu buku terbaru
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useReveal from '../hooks/useReveal';
import BookCard from '../components/BookCard';
import './Home.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  useReveal();

  useEffect(() => {
    api.get('/books').then((res) => setBooks(res.data)).catch(() => {});
  }, []);

  const covers = books.filter((b) => b.cover && !b.cover.includes('gstatic')).slice(0, 3);
  const latest = [...books].sort((a, b) => b.id - a.id).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <span className="hero__badge">Toko buku online</span>
          <h1>
            Temukan buku yang <em>membawamu</em> ke dunia baru
          </h1>
          <p>
            Fantasi, petualangan, sains fiksi, hingga distopia. Jelajahi koleksi
            Book.Hub dan pesan dengan mudah.
          </p>
          <div className="hero__cta">
            <Link to="/books" className="btn btn-solid">Jelajahi Buku</Link>
            <Link to="/register" className="btn btn-outline">Daftar Gratis</Link>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          {covers.map((b, i) => (
            <img key={b.id} src={b.cover} alt="" className={`hero__cover hero__cover--${i + 1}`} />
          ))}
        </div>

        <a href="#terbaru" className="hero__scroll" aria-label="Gulir ke bawah">
          <span />
        </a>
      </section>

      <section id="terbaru" className="section">
        <div className="section__head reveal">
          <h2>Buku Terbaru</h2>
          <Link to="/books" className="section__link">Lihat semua →</Link>
        </div>
        <div className="book-grid">
          {latest.map((b, i) => (
            <div key={b.id} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <BookCard book={b} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}