// Fungsi: halaman login; kirim email & password, simpan token, tampilkan error dari API
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || '/');
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      setMessage(err.response?.data?.message || 'Tidak dapat terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__side">
        <blockquote>"Sebuah ruangan tanpa buku seperti tubuh tanpa jiwa."</blockquote>
        <cite>Marcus Tullius Cicero</cite>
      </div>

      <form className="auth__form" onSubmit={handleSubmit}>
        <h1>Selamat datang kembali</h1>
        <p className="auth__sub">Masuk untuk melanjutkan belanja bukumu.</p>

        {location.state?.registered && !message && (
          <div className="alert alert--success">Pendaftaran berhasil, silakan login.</div>
        )}
        {message && <div className="alert alert--error">{message}</div>}

        <div className={`field ${errors.email ? 'field--error' : ''}`}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field__error">{errors.email[0]}</span>}
        </div>

        <div className={`field ${errors.password ? 'field--error' : ''}`}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <span className="field__error">{errors.password[0]}</span>}
        </div>

        <button type="submit" className="btn btn-solid auth__submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>

        <p className="auth__switch">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </p>
      </form>
    </div>
  );
}