// Fungsi: peta rute aplikasi (alamat URL menuju halaman)
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Books from './pages/Books';
import Login from './pages/Login';
import Register from './pages/Register';
import Placeholder from './pages/Placeholder';
import BookDetail from './pages/BookDetail';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/contact" element={<Placeholder title="Contact Us" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Placeholder title="Keranjang" />} />
        <Route path="/books/:id" element={<BookDetail />} />
      </Route>
    </Routes>
  );
}