// Fungsi: navbar utama Book.Hub; menempel di atas dan bayangannya menguat saat halaman digulir
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          <NavLink to="/genres">Genre</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </nav>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__cart" aria-label="Keranjang">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L21 8H6" />
            </svg>
          </Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-solid">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}