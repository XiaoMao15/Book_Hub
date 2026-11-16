// Fungsi: peta rute aplikasi (alamat URL menuju halaman), sisi toko dan panel admin
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Placeholder from './pages/Placeholder';
import Dashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/AdminBooks';
import Genres from './pages/admin/Genres';
import AdminOrders from './pages/admin/AdminOrders';
import ProtectedRoute from './components/ProtectedRoute';


export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <Orders />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="genres" element={<Genres />} />
        <Route path="users" element={<Placeholder title="Daftar User" />} />
        <Route path="messages" element={<Placeholder title="Pesan Masuk" />} />
      </Route>
    </Routes>
  );
}