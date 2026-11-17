// Fungsi: halaman About Us; cerita Book.Hub, nilai toko, angka koleksi dari API, dan cara pesan
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useReveal from '../hooks/useReveal';
import './About.css';
import './Home.css';

const VALUES = [
  { icon: '📚', title: 'Koleksi Pilihan', text: 'Buku dipilih dari berbagai genre, dari fantasi sampai distopia, supaya setiap pembaca menemukan bacaannya.' },
  { icon: '🔒', title: 'Belanja Aman', text: 'Akun dilindungi token login, dan stok dihitung otomatis supaya pesananmu tidak pernah melebihi persediaan.' },
  { icon: '🚚', title: 'Bayar di Tempat', text: 'Tidak perlu transfer dulu. Bayar saat buku sampai di tanganmu dengan metode COD.' },
];

const STEPS = [
  { no: '01', title: 'Pilih buku', text: 'Cari judul atau penulis, lalu saring berdasarkan genre.' },
  { no: '02', title: 'Masukkan ke keranjang', text: 'Atur jumlah buku yang ingin dibeli.' },
  { no: '03', title: 'Checkout dengan COD', text: 'Isi alamat, lalu bayar saat pesanan tiba.' },
];

export default function About() {
  const [stats, setStats] = useState({ books: 0, genres: 0, authors: 0 });
  useReveal();

  useEffect(() => {
    Promise.all([api.get('/books'), api.get('/genres')])
      .then(([b, g]) =>
        setStats({
          books: b.data.length,
          genres: g.data.length,
          authors: new Set(b.data.map((x) => x.author)).size,
        }),
      )
      .catch(() => {});
  }, []);

  return (
    <div className="about">
      <section className="about__hero">
        <span className="hero__badge">Tentang Kami</span>
        <h1>Menghubungkan pembaca dengan <em>cerita</em> yang mereka cari</h1>
        <p>
          Book.Hub adalah toko buku online yang lahir dari kesukaan kami pada cerita. Kami ingin
          membeli buku terasa semudah membuka halaman pertamanya.
        </p>
      </section>

      <section className="about__stats reveal">
        <div><strong>{stats.books}</strong><span>Judul buku</span></div>
        <div><strong>{stats.genres}</strong><span>Genre</span></div>
        <div><strong>{stats.authors}</strong><span>Penulis</span></div>
      </section>

      <section className="about__story reveal">
        <h2>Cerita Kami</h2>
        <p>
          Banyak pembaca kesulitan menemukan buku yang mereka inginkan: stok di toko tidak jelas,
          dan proses pembeliannya ribet. Book.Hub hadir sebagai tempat sederhana untuk menjelajahi
          koleksi, melihat ketersediaan stok secara langsung, lalu memesan hanya dengan beberapa klik.
        </p>
      </section>

      <section className="about__values">
        {VALUES.map((v, i) => (
          <div key={v.title} className="value reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className="value__icon">{v.icon}</span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
        ))}
      </section>

      <section className="about__steps reveal">
        <h2>Cara Memesan</h2>
        <ol>
          {STEPS.map((s) => (
            <li key={s.no}>
              <span>{s.no}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="cta reveal">
        <h2>Siap menemukan buku berikutnya?</h2>
        <p>Jelajahi koleksi Book.Hub sekarang.</p>
        <Link to="/books" className="btn cta__btn">Lihat Koleksi</Link>
      </section>
    </div>
  );
}