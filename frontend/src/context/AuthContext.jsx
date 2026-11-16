// Fungsi: menyimpan status login (user + token) dan jumlah item keranjang; menyediakan login, register, logout
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(() => {
    if (user?.role !== 'customer') {
      setCartCount(0);
      return;
    }
    api.get('/cart')
      .then((res) => setCartCount(res.data.items.reduce((sum, i) => sum + i.qty, 0)))
      .catch(() => setCartCount(0));
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = (data) => api.post('/register', data);

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, cartCount, refreshCart }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);