// Fungsi: dashboard admin; ringkasan angka, pesanan terbaru, dan buku yang stoknya menipis
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { rupiah, tanggal, orderCode, STATUS_LABEL } from '../../utils/format';
import '../Orders.css';
import './Dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/books'),
      api.get('/admin/orders'),
      api.get('/admin/users'),
      api.get('/admin/messages'),
    ])
      .then(([b, o, u, m]) => setData({ books: b.data, orders: o.data, users: u.data, messages: m.data }))
      .catch(() => setError('Gagal memuat data dashboard'));
  }, []);

  if (error) return <div className="alert alert--error">{error}</div>;
  if (!data) return <p className="adm-empty">Memuat dashboard...</p>;

  const { books, orders, users, messages } = data;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const revenue = orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + Number(o.total), 0);
  const unread = messages.filter((m) => !m.is_read).length;
  const customers = users.filter((u) => u.role === 'customer').length;
  const lowStock = books.filter((b) => b.stock <= 5).sort((a, b) => a.stock - b.stock);

  const stats = [
    { label: 'Total Buku', value: books.length, note: `${lowStock.length} stok menipis`, to: '/admin/books', tone: 'sand' },
    { label: 'Pesanan', value: orders.length, note: `${pending} menunggu diproses`, to: '/admin/orders', tone: 'gold' },
    { label: 'Pendapatan', value: rupiah(revenue), note: 'dari pesanan selesai', to: '/admin/orders', tone: 'green' },
    { label: 'Pesan Baru', value: unread, note: `${customers} customer terdaftar`, to: '/admin/messages', tone: 'red' },
  ];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p>Ringkasan aktivitas toko hari ini.</p>
        </div>
      </div>

      <div className="stats">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.to} className={`stat stat--${s.tone}`} style={{ animationDelay: `${i * 0.08}s` }}>
            <small>{s.label}</small>
            <strong>{s.value}</strong>
            <span>{s.note}</span>
          </Link>
        ))}
      </div>

      <div className="dash-grid">
        <section className="adm-card" style={{ animationDelay: '0.3s' }}>
          <div className="dash-card-head">
            <h2>Pesanan Terbaru</h2>
            <Link to="/admin/orders">Lihat semua →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="adm-empty">Belum ada pesanan.</p>
          ) : (
            <table className="adm-table">
              <thead>
                <tr><th>Kode</th><th>Customer</th><th>Tanggal</th><th>Status</th><th className="num">Total</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td><strong>{orderCode(o)}</strong></td>
                    <td>{o.user?.name || '-'}</td>
                    <td>{tanggal(o.created_at)}</td>
                    <td><span className={`status status--${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
                    <td className="num">{rupiah(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="adm-card" style={{ animationDelay: '0.4s' }}>
          <div className="dash-card-head">
            <h2>Stok Menipis</h2>
            <Link to="/admin/books">Kelola →</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="adm-empty">Semua stok aman 👍</p>
          ) : (
            <ul className="low-stock">
              {lowStock.map((b) => (
                <li key={b.id}>
                  <img src={b.cover} alt="" />
                  <p>{b.title}</p>
                  <span className={b.stock === 0 ? 'is-zero' : ''}>{b.stock === 0 ? 'Habis' : `${b.stock} tersisa`}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}