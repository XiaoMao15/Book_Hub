// Fungsi: admin kelola pesanan; filter status, lihat rincian, ubah status sesuai alur (batal = stok kembali)
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { rupiah, tanggal, orderCode, STATUS_LABEL } from '../../utils/format';
import '../Orders.css';
import './AdminOrders.css';

// sama dengan TRANSITIONS di AdminOrderController
const NEXT = {
  pending: [
    { to: 'processing', label: 'Proses Pesanan', cls: 'btn-solid' },
    { to: 'cancelled', label: 'Batalkan', cls: 'btn-outline' },
  ],
  processing: [
    { to: 'completed', label: 'Tandai Selesai', cls: 'btn-solid' },
    { to: 'cancelled', label: 'Batalkan', cls: 'btn-outline' },
  ],
};

const FILTERS = ['all', 'pending', 'processing', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [toCancel, setToCancel] = useState(null);

  const load = () =>
    api.get('/admin/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const toggle = async (o) => {
    if (openId === o.id) {
      setOpenId(null);
      return;
    }
    setOpenId(o.id);
    if (!details[o.id]) {
      const res = await api.get(`/admin/orders/${o.id}`);
      setDetails((d) => ({ ...d, [o.id]: res.data }));
    }
  };

  const changeStatus = async (o, status) => {
    setBusy(true);
    try {
      const res = await api.put(`/admin/orders/${o.id}`, { status });
      setNotice({ type: 'success', text: `${orderCode(o)} → ${STATUS_LABEL[status]}` });
      setDetails((d) => ({ ...d, [o.id]: { ...d[o.id], ...res.data } }));
      await load();
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.message || 'Gagal mengubah status' });
    } finally {
      setBusy(false);
      setToCancel(null);
    }
  };

  const handleAction = (o, to) => (to === 'cancelled' ? setToCancel(o) : changeStatus(o, to));

  const count = (s) => (s === 'all' ? orders.length : orders.filter((o) => o.status === s).length);
  const shown = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Kelola Pesanan</h1>
          <p>{count('pending')} pesanan menunggu diproses</p>
        </div>
      </div>

      <div className="status-filter">
        {FILTERS.map((s) => (
          <button key={s} type="button" className={filter === s ? 'is-active' : ''} onClick={() => setFilter(s)}>
            {s === 'all' ? 'Semua' : STATUS_LABEL[s]}
            <span>{count(s)}</span>
          </button>
        ))}
      </div>

      {notice && <div key={notice.text} className={`alert alert--${notice.type}`}>{notice.text}</div>}

      {loading ? (
        <p className="adm-empty">Memuat...</p>
      ) : shown.length === 0 ? (
        <div className="adm-card"><p className="adm-empty">Tidak ada pesanan dengan status ini.</p></div>
      ) : (
        <ul className="orders__list" key={filter}>
          {shown.map((o, i) => {
            const open = openId === o.id;
            const d = details[o.id];
            const actions = NEXT[o.status] || [];
            return (
              <li key={o.id} className={`order ${open ? 'is-open' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
                <button type="button" className="order__head adm-order__head" onClick={() => toggle(o)}>
                  <div>
                    <p className="order__id">{orderCode(o)}</p>
                    <p className="order__date">{tanggal(o.created_at)}</p>
                  </div>
                  <div className="adm-order__customer">
                    <p>{o.user?.name || '-'}</p>
                    <small>{o.user?.email}</small>
                  </div>
                  <span className={`status status--${o.status}`}>{STATUS_LABEL[o.status]}</span>
                  <strong className="adm-order__total">{rupiah(o.total)}</strong>
                  <svg className="order__chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <div className="order__body">
                  <div className="order__inner">
                    {!d ? (
                      <p className="adm-empty">Memuat rincian...</p>
                    ) : (
                      <>
                        <ul className="order__items">
                          {d.items?.map((it) => (
                            <li key={it.id}>
                              <img src={it.book?.cover} alt="" />
                              <div>
                                <p className="order__book">{it.book?.title || 'Buku telah dihapus'}</p>
                                <p className="order__meta">{it.qty} × {rupiah(it.price)}</p>
                              </div>
                              <strong>{rupiah(it.qty * it.price)}</strong>
                            </li>
                          ))}
                        </ul>
                        <div className="order__info">
                          <p><span>Alamat</span>{d.address}</p>
                          <p><span>Pembayaran</span>{d.payment_method?.toUpperCase()}</p>
                        </div>
                        {actions.length > 0 && (
                          <div className="adm-order__actions">
                            {actions.map((a) => (
                              <button key={a.to} type="button" className={`btn ${a.cls}`} disabled={busy} onClick={() => handleAction(o, a.to)}>
                                {a.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={!!toCancel} title="Batalkan Pesanan?" onClose={() => setToCancel(null)} width={420}>
        <p className="confirm-text">
          Pesanan <strong>{toCancel && orderCode(toCancel)}</strong> akan dibatalkan dan <strong>stok buku dikembalikan</strong>.
          Status ini tidak bisa diubah lagi.
        </p>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={() => setToCancel(null)}>Kembali</button>
          <button type="button" className="btn btn-danger" disabled={busy} onClick={() => changeStatus(toCancel, 'cancelled')}>
            {busy ? 'Memproses...' : 'Ya, Batalkan'}
          </button>
        </div>
      </Modal>
    </>
  );
}