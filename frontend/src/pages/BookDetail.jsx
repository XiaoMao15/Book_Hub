// Fungsi: halaman detail satu buku; pilih jumlah lalu tambah ke keranjang (khusus customer)
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './BookDetail.css';

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function BookDetail() {
  const { id } = useParams();
  const { user, refreshCart } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setAdding(true);
    setNotice(null);
    try {
    await api.post('/cart', { book_id: book.id, qty });
    refreshCart();
      setNotice({ type: 'success', text: `${qty} buku ditambahkan ke keranjang` });
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.message || 'Gagal menambahkan ke keranjang' });
    } finally {
      setAdding(false);
    }
  };

  if (notFound) {
    return (
      <div className="detail__missing">
        <h1>Buku tidak ditemukan</h1>
        <Link to="/books" className="btn btn-solid">Kembali ke Koleksi</Link>
      </div>
    );
  }

  if (!book) return <p className="detail__loading">Memuat...</p>;

  const habis = book.stock === 0;

  return (
    <div className="detail">
      <Link to="/books" className="detail__back">← Kembali ke Koleksi</Link>

      <div className="detail__grid">
        <div className="detail__cover">
          <img src={book.cover} alt={book.title} />
        </div>

        <div className="detail__info">
          {book.genre?.name && <span className="detail__genre">{book.genre.name}</span>}
          <h1>{book.title}</h1>
          <p className="detail__author">oleh {book.author}</p>
          <p className="detail__price">{rupiah(book.price)}</p>

          <p className={`detail__stock ${habis ? 'is-empty' : ''}`}>
            {habis ? 'Stok habis' : `Stok tersedia: ${book.stock}`}
          </p>

          {book.description && <p className="detail__desc">{book.description}</p>}

          {user?.role !== 'admin' && !habis && (
            <div className="detail__buy">
              <div className="qty">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>−</button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(book.stock, qty + 1))} disabled={qty >= book.stock}>+</button>
              </div>
              <button type="button" className="btn btn-solid detail__add" onClick={addToCart} disabled={adding}>
                {adding ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              </button>
            </div>
          )}

          {notice && (
            <div className={`alert alert--${notice.type}`}>
              {notice.text}
              {notice.type === 'success' && <>{' '}<Link to="/cart">Lihat keranjang →</Link></>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}