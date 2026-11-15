// Fungsi: halaman daftar akun customer; tampilkan error validasi 422, lalu arahkan ke login
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
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
      await register(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      setMessage(err.response?.data?.message || 'Tidak dapat terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Nama', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'password_confirmation', label: 'Konfirmasi Password', type: 'password' },
  ];

  return (
    <div className="auth">
      <div className="auth__side">
        <blockquote>"Pembaca menjalani seribu kehidupan sebelum ia mati."</blockquote>
        <cite>George R.R. Martin</cite>
      </div>

      <form className="auth__form" onSubmit={handleSubmit}>
        <h1>Buat akun baru</h1>
        <p className="auth__sub">Gratis, dan hanya butuh satu menit.</p>

        {message && <div className="alert alert--error">{message}</div>}

        {fields.map((f) => (
          <div key={f.name} className={`field ${errors[f.name] ? 'field--error' : ''}`}>
            <label htmlFor={f.name}>{f.label}</label>
            <input id={f.name} name={f.name} type={f.type} value={form[f.name]} onChange={handleChange} />
            {errors[f.name] && <span className="field__error">{errors[f.name][0]}</span>}
          </div>
        ))}

        <button type="submit" className="btn btn-solid auth__submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>

        <p className="auth__switch">
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}