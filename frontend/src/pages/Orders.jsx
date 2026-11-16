// Fungsi: riwayat pesanan customer; kartu pesanan bisa dibuka untuk melihat rincian buku
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import './Orders.css';
import { orderCode } from '../utils/format';

const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const tanggal = (iso) =>
  new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS = {
  pending: 'Menunggu',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get('/orders')
      .then((res) => {
        setOrders(res.data);
        if (location.state?.ordered && res.data.length) setOpenId(res.data[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [location.state]);

  if (loading) return <p className="orders__loading">Memuat pesanan...</p>;

  return (
    <div className="orders">
      <h1 className="orders__title">Pesanan Saya</h1>

      {location.state?.ordered && (
        <div className="alert alert--success">Pesanan berhasil dibuat! Kami akan segera memprosesnya.</div>
      )}

      {orders.length === 0 ? (
        <div className="orders__empty">
          <p>Belum ada pesanan.</p>
          <Link to="/books" className="btn btn-solid">Mulai Belanja</Link>
        </div>
      ) : (
        <ul className="orders__list">
          {orders.map((o, i) => {
            const open = openId === o.id;
            const qty = o.items.reduce((sum, it) => sum + it.qty, 0);
            return (
              <li key={o.id} className={`order ${open ? 'is-open' : ''}`} style={{ animationDelay: `${i * 0.07}s` }}>
                <button type="button" className="order__head" onClick={() => setOpenId(open ? null : o.id)}>
                  <div>
                    <p className="order__id">{orderCode(o)}</p>
                    <p className="order__date">{tanggal(o.created_at)}</p>
                  </div>
                  <span className={`status status--${o.status}`}>{STATUS[o.status] || o.status}</span>
                  <div className="order__sum">
                    <p>{qty} buku</p>
                    <strong>{rupiah(o.total)}</strong>
                  </div>
                  <svg className="order__chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <div className="order__body">
                  <div className="order__inner">
                    <ul className="order__items">
                      {o.items.map((it) => (
                        <li key={it.id}>
                          <img src={it.book?.cover} alt={it.book?.title} />
                          <div>
                            <p className="order__book">{it.book?.title}</p>
                            <p className="order__meta">{it.qty} × {rupiah(it.price)}</p>
                          </div>
                          <strong>{rupiah(it.qty * it.price)}</strong>
                        </li>
                      ))}
                    </ul>
                    <div className="order__info">
                      <p><span>Alamat</span>{o.address}</p>
                      <p><span>Pembayaran</span>{o.payment_method?.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}