// Fungsi: kerangka panel admin (sidebar menu di kiri, judul + isi halaman di kanan)
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import '../pages/admin/Admin.css';

const MENU = [
  { to: '/admin', label: 'Dashboard', end: true, icon: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z' },
  { to: '/admin/orders', label: 'Pesanan', icon: 'M5 7h14l-1 13H6zM9 7a3 3 0 0 1 6 0' },
  { to: '/admin/books', label: 'Buku', icon: 'M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM8 7h6' },
  { to: '/admin/genres', label: 'Genre', icon: 'M4 4h7l9 9-7 7-9-9zM8 8h.01' },
  { to: '/admin/users', label: 'User', icon: 'M16 19v-1a4 4 0 0 0-8 0v1M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  { to: '/admin/messages', label: 'Pesan', icon: 'M4 5h16v11H8l-4 4z' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin">
      <aside className="admin__side">
        <Link to="/admin" className="admin__brand">
          <img src={logo} alt="" />
          <div>
            <span>Book.Hub</span>
            <small>Panel Admin</small>
          </div>
        </Link>

        <nav className="admin__menu">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={m.icon} />
              </svg>
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin__foot">
          <Link to="/" className="admin__shop">← Lihat Toko</Link>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className="admin__main">
        <header className="admin__top">
          <p>Halo, <strong>{user.name}</strong> 👋</p>
          <span className="admin__avatar">{user.name.charAt(0).toUpperCase()}</span>
        </header>
        <div className="admin__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}