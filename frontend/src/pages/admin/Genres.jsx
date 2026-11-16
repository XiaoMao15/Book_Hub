// Fungsi: admin kelola genre; daftar, tambah & edit lewat modal, hapus dengan konfirmasi
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import '../Auth.css';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () =>
    api.get('/genres')
      .then((res) => setGenres(res.data))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openForm = (genre = null) => {
    setEditing(genre);
    setName(genre ? genre.name : '');
    setErrors({});
    setFormOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (editing) {
        await api.put(`/genres/${editing.id}`, { name });
      } else {
        await api.post('/genres', { name });
      }
      setFormOpen(false);
      setNotice({ type: 'success', text: `Genre "${name}" berhasil ${editing ? 'diperbarui' : 'ditambahkan'}` });
      load();
    } catch (err) {
      setErrors(err.response?.data?.errors || { name: [err.response?.data?.message || 'Gagal menyimpan'] });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await api.delete(`/genres/${toDelete.id}`);
      setNotice({ type: 'success', text: `Genre "${toDelete.name}" dihapus` });
      load();
    } catch (err) {
      setNotice({ type: 'error', text: err.response?.data?.message || 'Gagal menghapus genre' });
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Kelola Genre</h1>
          <p>{genres.length} genre terdaftar</p>
        </div>
        <button type="button" className="btn btn-solid" onClick={() => openForm()}>+ Tambah Genre</button>
      </div>

      {notice && <div key={notice.text} className={`alert alert--${notice.type}`}>{notice.text}</div>}

      <div className="adm-card">
        {loading ? (
          <p className="adm-empty">Memuat...</p>
        ) : genres.length === 0 ? (
          <p className="adm-empty">Belum ada genre.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>#</th><th>Nama Genre</th><th>Jumlah Buku</th><th className="num">Aksi</th></tr>
            </thead>
            <tbody>
              {genres.map((g, i) => (
                <tr key={g.id}>
                  <td>{i + 1}</td>
                  <td><strong>{g.name}</strong></td>
                  <td><span className="count-pill">{g.books_count ?? '-'}</span></td>
                  <td>
                    <div className="adm-actions">
                      <button type="button" className="icon-btn" onClick={() => openForm(g)} aria-label="Edit">
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" /></svg>
                      </button>
                      <button type="button" className="icon-btn icon-btn--danger" onClick={() => setToDelete(g)} aria-label="Hapus">
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

      <Modal open={formOpen} title={editing ? 'Edit Genre' : 'Tambah Genre'} onClose={() => setFormOpen(false)}>
        <form onSubmit={save}>
          <div className={`field ${errors.name ? 'field--error' : ''}`}>
            <label htmlFor="genre-name">Nama genre</label>
            <input id="genre-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            {errors.name && <span className="field__error">{errors.name[0]}</span>}
          </div>
          <div className="modal__actions">
            <button type="button" className="btn btn-outline" onClick={() => setFormOpen(false)}>Batal</button>
            <button type="submit" className="btn btn-solid" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!toDelete} title="Hapus Genre?" onClose={() => setToDelete(null)} width={400}>
        <p className="confirm-text">
          Genre <strong>{toDelete?.name}</strong> akan dihapus permanen. Lanjutkan?
        </p>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline" onClick={() => setToDelete(null)}>Batal</button>
          <button type="button" className="btn btn-danger" onClick={remove} disabled={deleting}>{deleting ? 'Menghapus...' : 'Hapus'}</button>
        </div>
      </Modal>
    </>
  );
}