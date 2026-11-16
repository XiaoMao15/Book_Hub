// Fungsi: halaman keranjang customer; ubah jumlah, hapus item, isi alamat, lalu checkout (COD)
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function Cart() {
  const navigate = useNavigate();
  const { refreshCart } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');

  const loadCart = () =>
    api.get('/cart')
      .then((res) => {
        setCart(res.data);
        refreshCart(); // BARU: perbarui angka di ikon keranjang navbar
      })
      .catch(() => setError('Gagal memuat keranjang'))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (item, qty) => {
    if (qty < 1 || qty > item.book.stock) return;
    setBusyId(item.id);
    setError('');
    try {
      await api.put(`/cart/${item.id}`, { qty });
      await loadCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengubah jumlah');
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (item) => {
    setRemovingId(item.id);
    setError('');
    try {
      await api.delete(`/cart/${item.id}`);
      setTimeout(loadCart, 350);
    } catch (err) {
      setRemovingId(null);
      setError(err.response?.data?.message || 'Gagal menghapus item');
    }
  };

  const checkout = async (e) => {
    e.preventDefault();
    setCheckingOut(true);
    setError('');
    setErrors({});
    try {
      await api.post('/orders', { address, payment_method: 'cod' });
      refreshCart(); // BARU: keranjang kosong setelah checkout, badge hilang
      navigate('/orders', { state: { ordered: true } });
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      if (!err.response?.data?.errors) {
        setError(err.response?.data?.message || 'Checkout gagal');
      }
      setCheckingOut(false);
    }
  };

  if (loading) return <p className="cart__loading">Memuat keranjang...</p>;

  if (cart.items.length === 0) {
    return (
      <div className="cart__empty">
        <div className="cart__empty-icon">🛒</div>
        <h1>Keranjangmu masih kosong</h1>
        <p>Yuk, temukan buku yang ingin kamu baca.</p>
        <Link to="/books" className="btn btn-solid">Jelajahi Buku</Link>
      </div>
    );
  }

  const totalQty = cart.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="cart">
      <h1 className="cart__title">Keranjang Belanja</h1>
      {error && <div className="alert alert--error">{error}</div>}

      <div className="cart__layout">
        <ul className="cart__list">
          {cart.items.map((item, i) => (
            <li
              key={item.id}
              className={`cart-item ${removingId === item.id ? 'is-removing' : ''}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <Link to={`/books/${item.book.id}`} className="cart-item__cover">
                <img src={item.book.cover} alt={item.book.title} />
              </Link>

              <div className="cart-item__info">
                <Link to={`/books/${item.book.id}`} className="cart-item__title">{item.book.title}</Link>
                <p className="cart-item__author">{item.book.author}</p>
                <p className="cart-item__price">{rupiah(item.book.price)}</p>
              </div>

              <div className={`qty ${busyId === item.id ? 'is-busy' : ''}`}>
                <button type="button" onClick={() => updateQty(item, item.qty - 1)} disabled={item.qty <= 1 || busyId === item.id}>−</button>
                <span>{item.qty}</span>
                <button type="button" onClick={() => updateQty(item, item.qty + 1)} disabled={item.qty >= item.book.stock || busyId === item.id}>+</button>
              </div>

              <p className="cart-item__subtotal">{rupiah(item.subtotal)}</p>

              <button type="button" className="cart-item__remove" onClick={() => removeItem(item)} aria-label="Hapus">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <form className="cart__summary" onSubmit={checkout}>
          <h2>Ringkasan</h2>
          <div className="cart__row">
            <span>Total item</span>
            <span>{totalQty} buku</span>
          </div>
          <div className="cart__row cart__row--total">
            <span>Total</span>
            <span>{rupiah(cart.total)}</span>
          </div>

          <div className={`field ${errors.address ? 'field--error' : ''}`}>
            <label htmlFor="address">Alamat pengiriman</label>
            <textarea
              id="address"
              rows="3"
              maxLength="500"
              placeholder="Jalan, nomor rumah, kota, kode pos"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <span className="field__error">{errors.address[0]}</span>}
          </div>

          <div className="field">
            <label>Metode pembayaran</label>
            <div className="pay-option is-active">
              <span className="pay-option__dot" />
              <div>
                <strong>COD</strong>
                <small>Bayar di tempat saat buku diterima</small>
              </div>
            </div>
            {errors.payment_method && <span className="field__error">{errors.payment_method[0]}</span>}
          </div>

          <button type="submit" className="btn btn-solid cart__checkout" disabled={checkingOut}>
            {checkingOut ? 'Memproses...' : 'Checkout'}
          </button>
          <Link to="/books" className="cart__continue">← Lanjut belanja</Link>
        </form>
      </div>
    </div>
  );
}