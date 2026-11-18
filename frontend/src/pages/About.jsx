// Fungsi: halaman About Us; penjelasan singkat Book.Hub, latar belakang, dan fitur utama
import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';
import './About.css';

const FEATURES = [
  { icon: '🔍', title: 'Cari dan Filter', text: 'Temukan buku lewat judul atau penulis, lalu saring berdasarkan genre.' },
  { icon: '🛒', title: 'Pesan Lewat Keranjang', text: 'Kumpulkan buku yang ingin dibeli, atur jumlahnya, lalu checkout.' },
  { icon: '🚚', title: 'Bayar di Tempat', text: 'Tidak perlu transfer dulu. Bayar saat buku sampai dengan metode COD.' },
];

export default function About() {
  useReveal();

  return (
    <div className="about">
      <section className="about__hero">
        <span className="hero__badge">Tentang Kami</span>
        <h1>Tentang <em>Book.Hub</em></h1>
        <p>
          Book.Hub adalah toko buku online sederhana untuk mencari, melihat stok, dan memesan buku
          tanpa harus datang ke toko.
        </p>
      </section>

      <section className="about__story reveal">
        <h2>Latar Belakang</h2>
        <p>
          Banyak pembaca kesulitan menemukan buku yang dicari. Stok di toko sering tidak jelas, dan
          untuk membeli harus datang langsung. Book.Hub dibuat supaya pembaca bisa melihat koleksi
          dan stok secara langsung, lalu memesan hanya dengan beberapa klik.
        </p>
      </section>

      <section className="about__values">
        {FEATURES.map((f, i) => (
          <div key={f.title} className="value reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className="value__icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <div className="about__back reveal">
        <Link to="/books" className="btn btn-solid">Lihat Koleksi Buku</Link>
      </div>
    </div>
  );
}