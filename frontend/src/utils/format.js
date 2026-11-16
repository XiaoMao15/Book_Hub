// Fungsi: fungsi bantu format tampilan (kode pesanan)
export const orderCode = (order) => {
  const d = new Date(order.created_at);
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `ORD-${ymd}-${String(order.id).padStart(4, '0')}`;
};