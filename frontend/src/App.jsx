// Fungsi: peta rute aplikasi (alamat URL menuju halaman)
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Books from './pages/Books';
import Placeholder from './pages/Placeholder';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/genres" element={<Placeholder title="Genre" />} />
        <Route path="/contact" element={<Placeholder title="Contact Us" />} />
        <Route path="/login" element={<Placeholder title="Login" />} />
        <Route path="/register" element={<Placeholder title="Sign Up" />} />
        <Route path="/cart" element={<Placeholder title="Keranjang" />} />
      </Route>
    </Routes>
  );
}