// Fungsi: halaman Contact Us; kirim pesan ke admin lewat POST /messages (terbuka untuk semua pengunjung)
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import './Contact.css';

const INFO = [
  { icon: '✉️', label: 'Email', value: 'halo@bookhub.test' },
  { icon: '📞', label: 'Telepon', value: '+62 812-3456-7890' },
  { icon: '📍', label: 'Alamat', value: 'Jl. Literasi No. 15, Jakarta' },
  { icon: '🕘', label: 'Jam layanan', value: 'Senin–Sabtu, 09.00–17.00' },
];

export default function Contact() {
  const { user } = useAuth();
  const empty = { name: user?.name || '', email: user?.email || '', message: '' };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setErrors({});
    setMessage('');
    try {
      await api.post('/messages', form);
      setSent(true);
      setForm(empty);
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      if (!err.response?.data?.errors) {
        setMessage(err.response?.data?.message || 'Tidak dapat terhubung ke server');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact">
      <header className="contact__head">
        <h1>Hubungi Kami</h1>
        <p>Punya pertanyaan soal buku atau pesanan? Tim Book.Hub siap membantu.</p>
      </header>

      <div className="contact__grid">
        <aside className="contact__info">
          <h2>Informasi Kontak</h2>
          <ul>
            {INFO.map((item, i) => (
              <li key={item.label} style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                <span className="contact__icon">{item.icon}</span>
                <div>
                  <small>{item.label}</small>
                  <p>{item.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="contact__card">
          {sent ? (
            <div className="contact__success">
              <svg viewBox="0 0 52 52" className="contact__check">
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27l7 7 15-15" />
              </svg>
              <h2>Pesan terkirim!</h2>
              <p>Terima kasih sudah menghubungi kami. Admin akan segera membalas lewat email.</p>
              <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2>Kirim Pesan</h2>
              {message && <div className="alert alert--error">{message}</div>}

              <div className={`field ${errors.name ? 'field--error' : ''}`}>
                <label htmlFor="name">Nama</label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
                {errors.name && <span className="field__error">{errors.name[0]}</span>}
              </div>

              <div className={`field ${errors.email ? 'field--error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
                {errors.email && <span className="field__error">{errors.email[0]}</span>}
              </div>

              <div className={`field ${errors.message ? 'field--error' : ''}`}>
                <label htmlFor="message">Pesan</label>
                <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} />
                {errors.message && <span className="field__error">{errors.message[0]}</span>}
              </div>

              <button type="submit" className="btn btn-solid contact__submit" disabled={sending}>
                {sending ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}