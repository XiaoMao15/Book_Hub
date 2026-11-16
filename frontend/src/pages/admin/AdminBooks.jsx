// Fungsi: admin kelola buku; daftar + cari, tambah & edit lewat modal (pratinjau cover), hapus dengan konfirmasi
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { rupiah } from '../../utils/format';
import '../Auth.css';
import './AdminBooks.css';

const EMPTY = { genre_id: '', title: '', author: '', price: '', stock: '', cover: '', description: '' };

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () =>
    api.get('/books')
      .then((res) => setBooks(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    api.get('/genres').then((res) => setGenres(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openForm = (book = null) => {
    setEditing(book);
    setForm(
      book
        ? {
            genre_id: book.genre_id,
            title: book.title,
            author: book.author,
            price: book.price,
            stock: book.stock,
            cover: book.cover || '',
            description: book.description || '',
          }
        : EMPTY,
    );
    setErrors({});
    setFormOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (editing) {
        await api.put(`/books/${editing.id}`, form);
      } else {
        await api.post('/books', form);
      }
      setFormOpen(false);
      setNotice({ type: 'success', text: `Buku "${form.title}" berhasil ${editing ? 'diperbarui' : 'ditambahkan'}` });
      load();
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      if (!err.response?.data?.errors) {
        setErrors({ title: [err.response?.data?.message || 'Gagal menyimpan'] });
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api.delete(`/books/${toDelete.id}`);
      setNotice({ type: 'success', text: `Buku "${toDelete.title}" dihapus` });
      load();
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.message || 'Gagal menghapus buku' });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const keyword = search.toLowerCase();
  const filtered = books.filter(
    (b) => b.title.toLowerCase().includes(keyword) || b.author.toLowerCase().includes(keyword),
  );

  const stockClass = (s) => (s === 0 ? 'stock--zero' : s <= 5 ? 'stock--low' : 'stock--ok');

  const fieldClass = (name) => `field ${errors[name] ? 'field--error' : ''}`;
  const fieldError = (name) => errors[name] && <span className="field__error">{errors[name][0]}</span>;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Kelola Buku</h1>
          <p>{books.length} buku di katalog</p>
        </div>
        <div className="adm-tools">
          <input
            className="adm-search"
            placeholder="Cari judul atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="btn btn-solid" onClick={() => openForm()}>+ Tambah Buku</button>
        </div>
      </div>

      {notice && <div key={notice.text} className={`alert alert--${notice.type}`}>{notice.text}</div>}

      <div className="adm-card">
        {loading ? (
          <p className="adm-empty">Memuat...</p>
        ) : filtered.length === 0 ? (
          <p className="adm-empty">Buku tidak ditemukan.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>Buku</th><th>Genre</th><th className="num">Harga</th><th>Stok</th><th className="num">Aksi</th></tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="book-cell">
                      <img src={b.cover} alt="" />
                      <div>
                        <strong>{b.title}</strong>
                        <small>{b.author}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="count-pill">{b.genre?.name || '-'}</span></td>
                  <td className="num">{rupiah(b.price)}</td>
                  <td><span className={`stock ${stockClass(b.stock)}`}>{b.stock}</span></td>
                  <td>
                    <div className="adm-actions">
                      <button type="button" className="icon-btn" onClick={() => openForm(b)} aria-label="Edit">
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" /></svg>
                      </button>
                      <button type="button" className="icon-btn icon-btn--danger" onClick={() => setToDelete(b)} aria-label="Hapus">
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={formOpen} title={editing ? 'Edit Buku' : 'Tambah Buku'} onClose={() => setFormOpen(false)} width={760}>
        <form onSubmit={save} className="book-form">
          <div className="book-form__preview">
            {form.cover ? <img src={form.cover} alt="Pratinjau cover" /> : <span>Pratinjau cover</span>}
          </div>

          <div className="book-form__fields">
            <div className={fieldClass('title')}>
              <label htmlFor="title">Judul</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} />
              {fieldError('title')}
            </div>

            <div className="book-form__row">
              <div className={fieldClass('author')}>
                <label htmlFor="author">Penulis</label>
                <input id="author" name="author" value={form.author} onChange={handleChange} />
                {fieldError('author')}
              </div>
              <div className={fieldClass('genre_id')}>
                <label htmlFor="genre_id">Genre</label>
                <select id="genre_id" name="genre_id" value={form.genre_id} onChange={handleChange}>
                  <option value="">Pilih genre</option>
                  {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                {fieldError('genre_id')}
              </div>
            </div>

            <div className="book-form__row">
              <div className={fieldClass('price')}>
                <label htmlFor="price">Harga (Rp)</label>
                <input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} />
                {fieldError('price')}
              </div>
              <div className={fieldClass('stock')}>
                <label htmlFor="stock">Stok</label>
                <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
                {fieldError('stock')}
              </div>
            </div>

            <div className={fieldClass('cover')}>
              <label htmlFor="cover">URL cover</label>
              <input id="cover" name="cover" value={form.cover} onChange={handleChange} placeholder="https://..." />
              {fieldError('cover')}
            </div>

            <div className={fieldClass('description')}>
              <label htmlFor="description">Deskripsi</label>
              <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} />
              {fieldError('description')}
            </div>

            <div className="modal__actions">
              <button type="button" className="btn btn-outline" onClick={() => setFormOpen(false)}>Batal</button>
              <button type="submit" className="btn btn-solid" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal open={!!toDelete} title="Hapus Buku?" onClose={() => setToDelete(null)} width={400}>
        <p className="confirm-text">
          Buku <strong>{toDelete?.title}</strong> akan dihapus permanen. Lanjutkan?
        </p>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={() => setToDelete(null)}>Batal</button>
          <button type="button" className="btn btn-danger" onClick={remove} disabled={deleting}>{deleting ? 'Menghapus...' : 'Hapus'}</button>
        </div>
      </Modal>
    </>
  );
}
