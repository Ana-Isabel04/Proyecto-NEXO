import React, { createContext, useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css'; import './index.css';
import { api } from './api.js';
import { EventDetail, MapPage, MyReservations, Denied } from './pages-visitor.jsx';
import Layout from './generated/Layout.jsx'; import { Reserve, Confirmation } from './generated/booking.jsx'; import { SearchPage, Home } from './generated/pages.jsx'; import { Login, Register } from './generated/auth.jsx';

const Auth = createContext(); export const useAuth = () => useContext(Auth);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [ready, setReady] = useState(false);
  useEffect(() => { api('/auth/me').then(setUser).catch(() => {}).finally(() => setReady(true)); }, []);
  const login = ({ user }) => setUser(user);
  const logout = () => api('/auth/logout', { method: 'POST' }).catch(() => {}).finally(() => setUser(null));
  return <Auth.Provider value={{ user, login, logout }}>{ready ? children : null}</Auth.Provider>;
}
/* Control de acceso: sin sesión → login (recuerda a dónde iba); rol incorrecto → denegado */
function Protected({ role = 'asistente', children }) {
  const { user } = useAuth(), loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />;
  return user.role === role ? children : <Navigate to="/denegado" replace />;
}
createRoot(document.getElementById('root')).render(<BrowserRouter basename="/app"><AuthProvider><Layout><Routes>
  <Route path="/" element={<Home />} /><Route path="/buscar" element={<SearchPage />} /><Route path="/evento/:id" element={<EventDetail />} /><Route path="/mapa" element={<MapPage />} />
  <Route path="/login" element={<Login />} /><Route path="/registro" element={<Register />} /><Route path="/denegado" element={<Denied />} />
  <Route path="/reservar/:id" element={<Protected><Reserve /></Protected>} /><Route path="/confirmacion/:code" element={<Protected><Confirmation /></Protected>} />
  <Route path="/mis-reservas" element={<Protected><MyReservations /></Protected>} />
</Routes></Layout></AuthProvider></BrowserRouter>);
