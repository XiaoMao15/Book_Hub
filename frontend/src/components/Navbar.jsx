// Fungsi: navbar utama; menu & tombol berubah sesuai status login dan role (customer/admin)
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <img src={logo} alt="Book.Hub" />
          <span>Book.Hub</span>
        </Link>

        <nav className="navbar__links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/books">Book</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </nav>

        <div className="navbar__actions">
          {!user && (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-solid">Sign Up</Link>
            </>
          )}

          {user?.role === 'customer' && (
            <Link to="/cart" className="navbar__cart" aria-label="Keranjang">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
                <path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6" />
              </svg>
              {cartCount > 0 && <span key={cartCount} className="navbar__badge">{cartCount}</span>}
            </Link>
          )}

          {user && (
            <div className="navbar__user" ref={menuRef}>
              <button type="button" className="navbar__avatar-btn" onClick={() => setOpen(!open)}>
                <span className="navbar__avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="navbar__name">{user.name}</span>
                <svg className={`navbar__chevron ${open ? 'is-open' : ''}`} viewBox="0 0 24 24" width="16" height="16"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {open && (
                <div className="navbar__dropdown">
                  <p className="navbar__role">{user.role === 'admin' ? 'Admin' : 'Customer'}</p>
                  {user.role === 'admin' ? (
                    <Link to="/admin" onClick={() => setOpen(false)}>Dashboard</Link>
                  ) : (
                    <Link to="/orders" onClick={() => setOpen(false)}>Pesanan Saya</Link>
                  )}
                  <button type="button" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}