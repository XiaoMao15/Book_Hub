// Fungsi: admin melihat daftar user; cari nama/email dan filter role
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { tanggal } from '../../utils/format';
import './AdminBooks.css';
import './AdminInbox.css';
import './AdminOrders.css';

const ROLES = [
  { key: 'all', label: 'Semua' },
  { key: 'customer', label: 'Customer' },
  { key: 'admin', label: 'Admin' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const keyword = search.toLowerCase();
  const shown = users.filter(
    (u) =>
      (role === 'all' || u.role === role) &&
      (u.name.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword)),
  );

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Daftar User</h1>
          <p>{users.length} akun terdaftar</p>
        </div>
        <input className="adm-search" placeholder="Cari nama atau email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="status-filter">
        {ROLES.map((r) => (
          <button key={r.key} type="button" className={role === r.key ? 'is-active' : ''} onClick={() => setRole(r.key)}>
            {r.label}
            <span>{r.key === 'all' ? users.length : users.filter((u) => u.role === r.key).length}</span>
          </button>
        ))}
      </div>

      <div className="adm-card">
        {loading ? (
          <p className="adm-empty">Memuat...</p>
        ) : shown.length === 0 ? (
          <p className="adm-empty">User tidak ditemukan.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>User</th><th>Role</th><th>Pesanan</th><th>Bergabung</th></tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <span className={`user-cell__avatar user-cell__avatar--${u.role}`}>{u.name.charAt(0).toUpperCase()}</span>
                      <div>
                        <strong>{u.name}</strong>
                        <small>{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className={`role role--${u.role}`}>{u.role === 'admin' ? 'Admin' : 'Customer'}</span></td>
                  <td>{u.role === 'admin' ? '-' : <span className="count-pill">{u.orders_count ?? '-'}</span>}</td>
                  <td>{tanggal(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}