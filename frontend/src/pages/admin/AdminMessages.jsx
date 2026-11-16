// Fungsi: admin kotak pesan masuk; daftar di kiri, isi pesan di kanan, otomatis ditandai dibaca saat dibuka
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { tanggal } from '../../utils/format';
import './AdminInbox.css';
import './AdminOrders.css';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/admin/messages')
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  }, []);

  const open = async (m) => {
    setSelected(m);
    if (!m.is_read) {
      await api.put(`/admin/messages/${m.id}/read`);
      setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, is_read: true } : x)));
      setSelected({ ...m, is_read: true });
    }
  };

  const unread = messages.filter((m) => !m.is_read).length;
  const shown = onlyUnread ? messages.filter((m) => !m.is_read) : messages;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Pesan Masuk</h1>
          <p>{unread} pesan belum dibaca</p>
        </div>
      </div>

      <div className="status-filter">
        <button type="button" className={!onlyUnread ? 'is-active' : ''} onClick={() => setOnlyUnread(false)}>
          Semua <span>{messages.length}</span>
        </button>
        <button type="button" className={onlyUnread ? 'is-active' : ''} onClick={() => setOnlyUnread(true)}>
          Belum dibaca <span>{unread}</span>
        </button>
      </div>

      <div className="inbox">
        <ul className="inbox__list adm-card">
          {loading ? (
            <p className="adm-empty">Memuat...</p>
          ) : shown.length === 0 ? (
            <p className="adm-empty">Tidak ada pesan.</p>
          ) : (
            shown.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`inbox__item ${!m.is_read ? 'is-unread' : ''} ${selected?.id === m.id ? 'is-active' : ''}`}
                  onClick={() => open(m)}
                >
                  <div className="inbox__top">
                    <strong>{m.name}</strong>
                    <small>{tanggal(m.created_at)}</small>
                  </div>
                  <p>{m.message}</p>
                </button>
              </li>
            ))
          )}
        </ul>

        <section className="inbox__view adm-card">
          {!selected ? (
            <div className="inbox__placeholder">
              <span>✉️</span>
              <p>Pilih pesan untuk membaca isinya</p>
            </div>
          ) : (
            <div key={selected.id} className="inbox__detail">
              <div className="inbox__from">
                <span className="user-cell__avatar user-cell__avatar--customer">{selected.name.charAt(0).toUpperCase()}</span>
                <div>
                  <strong>{selected.name}</strong>
                  <small>{selected.email}</small>
                </div>
                <span className="inbox__read">✓ Dibaca</span>
              </div>
              <small className="inbox__date">{tanggal(selected.created_at)}</small>
              <p className="inbox__body">{selected.message}</p>
              <a className="btn btn-solid" href={`mailto:${selected.email}?subject=Balasan dari Book.Hub`}>
                Balas via Email
              </a>
            </div>
          )}
        </section>
      </div>
    </>
  );
}