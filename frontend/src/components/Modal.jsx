// Fungsi: jendela pop-up serbaguna (form tambah/edit, konfirmasi hapus); tutup dengan Esc atau klik latar
import { useEffect } from 'react';
import './Modal.css';

export default function Modal({ open, title, onClose, children, width = 460 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal" onMouseDown={onClose}>
      <div className="modal__panel" style={{ maxWidth: width }} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Tutup">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}