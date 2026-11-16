// Fungsi: fungsi bantu format tampilan (rupiah, tanggal, kode pesanan, label status)
export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export const tanggal = (iso) =>
  new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const orderCode = (order) => {
  const d = new Date(order.created_at);
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `ORD-${ymd}-${String(order.id).padStart(4, '0')}`;
};

export const STATUS_LABEL = {
  pending: 'Menunggu',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};