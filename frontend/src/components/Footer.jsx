// Fungsi: footer di semua halaman (logo, menu, hak cipta)
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Link to="/" className="footer__brand">
          <img src={logo} alt="" />
          <span>Book.Hub</span>
        </Link>
        <nav className="footer__links">
          <Link to="/">Home</Link>
          <Link to="/books">Book</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>
        <p className="footer__copy">© {new Date().getFullYear()} Book.Hub. All rights reserved.</p>
      </div>
    </footer>
  );
}