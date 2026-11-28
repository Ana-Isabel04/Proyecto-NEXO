import express from 'express'; import fs from 'fs'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'cambia-esto-en-produccion', F = './data.json';
const ev = (id, title, cat, venue, lat, lng, date, price, cap, sold, payUrl = '') => ({ id, title, cat, venue, lat, lng, date, price, cap, sold, payUrl });
const seed = () => ({
  users: [['Camila Arismendi', 'asistente@nexo.com', 'asistente'], ['Org Demo', 'organizador@nexo.com', 'organizador'], ['Curaduría', 'curador@nexo.com', 'curador']]
    .map(([name, email, role], i) => ({ id: 'u' + i, name, email, role, hash: bcrypt.hashSync('1234', 10) })),
  events: JSON.parse(fs.readFileSync(new URL('./events.seed.json', import.meta.url))),
  reservations: []
});
let db = fs.existsSync(F) ? JSON.parse(fs.readFileSync(F)) : seed();
const save = () => fs.writeFileSync(F, JSON.stringify(db, null, 2)); save();
const app = express(); app.use(express.json());
const pub = u => ({ id: u.id, name: u.name, email: u.email, role: u.role });
const token = u => jwt.sign(pub(u), SECRET, { expiresIn: '7d' });
const auth = (...roles) => (req, res, next) => {
  try { req.user = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), SECRET); } catch { return res.status(401).json({ error: 'Inicia sesión' }); }
  if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ error: 'Acceso denegado' });
  next();
};
/* Auth */
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !/^\S+@\S+\.\S+$/.test(email || '')) return res.status(400).json({ error: 'Datos inválidos' });
  if ((password || '').length < 8) return res.status(400).json({ error: 'La contraseña debe tener mínimo 8 caracteres' });
  if (db.users.some(u => u.email === email.toLowerCase())) return res.status(409).json({ error: 'Ese correo ya está registrado' });
  const u = { id: 'u' + Date.now(), name, email: email.toLowerCase(), role: 'asistente', hash: bcrypt.hashSync(password, 10) };
  db.users.push(u); save(); res.status(201).json({ token: token(u), user: pub(u) });
});
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body || {};
  const u = db.users.find(x => x.email === (email || '').toLowerCase());
  if (!u || !bcrypt.compareSync(password || '', u.hash)) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  if (role && u.role !== role) return res.status(403).json({ error: `Esta cuenta es de tipo "${u.role}"` });
  res.json({ token: token(u), user: pub(u) });
});
app.get('/api/auth/me', auth(), (req, res) => res.json(req.user));
/* Eventos: búsqueda, filtros, orden, paginación */
app.get('/api/events', (req, res) => {
  const { q = '', cat = '', maxPrice, sort = 'fecha', page = 1, limit = 12 } = req.query;
  const n = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let l = db.events.filter(e => (!q || n(e.title + e.venue + e.cat).includes(n(q))) && (!cat || e.cat === cat) && (maxPrice === undefined || maxPrice === '' || e.price <= +maxPrice));
  l.sort((a, b) => sort === 'precio' ? a.price - b.price : new Date(a.date) - new Date(b.date));
  const total = l.length, p = Math.max(1, +page), lim = +limit;
  res.json({ total, items: l.slice((p - 1) * lim, p * lim).map(e => ({ ...e, left: e.cap - e.sold })) });
});
app.get('/api/events/:id', (req, res) => {
  const e = db.events.find(x => x.id === req.params.id);
  e ? res.json({ ...e, left: e.cap - e.sold }) : res.status(404).json({ error: 'Evento no encontrado' });
});
/* Reservas (solo asistentes) */
app.post('/api/reservations', auth('asistente'), (req, res) => {
  const { eventId, payment = 'apple-pay' } = req.body, qty = +req.body.qty, e = db.events.find(x => x.id === eventId);
  if (!e) return res.status(404).json({ error: 'Evento no encontrado' });
  if (e.payUrl) return res.status(400).json({ error: 'Este evento se reserva en el sitio del organizador', payUrl: e.payUrl });
  if (!Number.isInteger(qty) || qty < 1 || qty > 4) return res.status(400).json({ error: 'Entre 1 y 4 entradas' });
  if (new Date(e.date) < Date.now()) return res.status(400).json({ error: 'El evento ya ocurrió' });
  if (e.cap - e.sold < qty) return res.status(409).json({ error: 'No hay cupos suficientes' });
  const r = { code: 'NX-' + Math.random().toString(36).slice(2, 7).toUpperCase() + '-' + String(Date.now()).slice(-3), eventId, userId: req.user.id, qty, payment, total: +(e.price * qty * 1.05).toFixed(2), status: 'confirmada', createdAt: new Date().toISOString() };
  e.sold += qty; db.reservations.push(r); save(); res.status(201).json(r);
});
const mine = (req, code) => db.reservations.find(r => r.code === code && r.userId === req.user.id);
app.get('/api/reservations/mine', auth('asistente'), (req, res) =>
  res.json(db.reservations.filter(r => r.userId === req.user.id).map(r => ({ ...r, event: db.events.find(e => e.id === r.eventId) })).reverse()));
app.get('/api/reservations/:code', auth('asistente'), (req, res) => {
  const r = mine(req, req.params.code); r ? res.json({ ...r, event: db.events.find(e => e.id === r.eventId) }) : res.status(404).json({ error: 'Reserva no encontrada' });
});
app.post('/api/reservations/:code/cancel', auth('asistente'), (req, res) => {
  const r = mine(req, req.params.code); if (!r) return res.status(404).json({ error: 'Reserva no encontrada' });
  if (r.status === 'cancelada') return res.status(400).json({ error: 'Ya estaba cancelada' });
  db.events.find(e => e.id === r.eventId).sold -= r.qty; r.status = 'cancelada'; save(); res.json(r);
});
app.listen(process.env.PORT || 4000, () => console.log('API NEXO en :4000'));
