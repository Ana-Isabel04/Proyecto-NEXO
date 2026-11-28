# Reserva + Confirmación (se ejecuta desde tools_html2jsx.py)
def tk(h, text, token, must=True):
    h2, n = re.subn(r'(>\s*)' + re.escape(text) + r'(\s*<)', lambda m: m.group(1) + token + m.group(2), h)
    assert n or not must, text; return h2
def prep(n):
    h = inner_main(n); return re.sub(r'<script.*?</script>', '', h, flags=re.S)
# ---------- RESERVA ----------
h = prep('realizar_reserva')
h = re.sub(r'<img[^>]*?src="[^"]+"[^>]*>', lambda m: re.sub(r' data-alt="[^"]*"', '', re.sub(r'src="[^"]+"', 'src="@@img@@"', m.group(0))), h, 1)
h = h.replace('Subtotal (2 x $45.00)', 'Subtotal (@@qty@@ x @@price@@)')
for a, b in [('$94.50', '@@total@@'), ('$90.00', '@@sub@@'), ('$4.50', '@@fee@@'), ('$45.00', '@@price@@')]: assert a in h, a; h = h.replace(a, b)
h = h.replace('2 pases seleccionados', '@@qty@@ pase(s) seleccionado(s)')
for t, k in [('Sinfonía Nocturna al Aire Libre', '@@title@@'), ('Viernes 24 Mayo, 20:00 hs', '@@when@@'), ('Jardín Botánico Central', '@@venue@@'), ('Sector A • Fila 04, Butacas 12 y 14', 'Entrada general'), ('Camila V. Arismendi', '@@uname@@'), ('c.arismendi@culturalnexo.com', '@@uemail@@'), ('09:39', '@@timer@@'), ('2', '@@qtyn@@'), ('Asientos numerados garantizados • Sector A Frontal', '@@cat@@ • Cupos limitados')]:
    h = tk(h, t, k, must=t != '2')
h = re.sub(r'(id="ticket-quantity"[^>]*>\s*)2(\s*<)', r'\1@@qtyn@@\2', h)
R = jsx(h)
for a, b in [('@@img@@', None), ('@@qty@@', '{qty}'), ('@@qtyn@@', '{qty}'), ('@@total@@', '{money(total)}'), ('@@sub@@', '{money(sub)}'), ('@@fee@@', '{money(fee)}'), ('@@price@@', '{money(e.price)}'), ('@@title@@', '{e.title}'), ('@@when@@', '{fmt(e.date)}'), ('@@venue@@', '{e.venue}'), ('@@uname@@', '{user.name}'), ('@@uemail@@', '{user.email}'), ('@@timer@@', '{timer}'), ('@@cat@@', '{e.cat}')]:
    if b: assert a in R, a; R = R.replace(a, b)
R = R.replace('src="@@img@@"', 'src={e.img || FALLBACK}')
def sr(rx, rp, s):
    s, n = re.subn(rx, rp, s, 1, re.S); assert n == 1, rx; return s
R = sr(r'id="btn-decrement"', 'id="btn-decrement" disabled={qty <= 1} onClick={() => setQty(qty - 1)}', R)
R = sr(r'id="btn-increment"', 'id="btn-increment" disabled={qty >= max} onClick={() => setQty(qty + 1)}', R)
R = sr(r'id="btn-submit-order"', 'id="btn-submit-order" disabled={busy || e.left < 1} onClick={doPay}', R)
R = sr(r'(id="btn-submit-order".*?</button>)', r'\1{err && <p className="text-error text-sm text-center mt-3">{err}</p>}', R)
for v in ('apple-pay', 'credit-card'): R = sr(f'defaultValue="{v}"', f"value=\"{v}\" checked={{pay === '{v}'}} onChange={{() => setPay('{v}')}}", R)
R = re.sub(r'<input[^>]*name="payment-method"[^>]*>', lambda m: m.group(0).replace(' defaultChecked', ''), R)
# ---------- CONFIRMACIÓN ----------
c = prep('confirmaci_n_de_reserva')
for t, k in [('valentina.m@ejemplo.com', '@@uemail@@'), ('TRX-774092-2025', '@@trx@@'), ('Música en Vivo', '@@cat@@'), ('Gira Estacional Madrid 2025', '@@tag@@'), ('Sinfonía Nocturna al Aire Libre', '@@title@@'), ('Ensemble de Cámara de Madrid &amp; Dirección Huésped', '@@venue@@'), ('2 Entradas Numeradas', '@@qty@@ Entrada(s)'), ('Sábado, 24 May', '@@dateS@@'), ('Temporada Primavera', '@@year@@'), ('20:00 hs', '@@time@@'), ('Jardín Botánico', '@@venue@@'), ('Av. de las Palmeras 450', 'Madrid, ES'), ('Platea A • Fila 4', 'Entrada general'), ('Butacas 12 &amp; 14', 'Sin asiento asignado'), ('Valentina Martínez (DNI/NIE verificado).', '@@uname@@ (cuenta verificada).')]:
    c = tk(c, t, k)
c = c.replace('Puertas: 19:15 hs', 'Puertas: @@doors@@').replace('NX-98241-CL', '@@code@@')
C = jsx(c)
for a, b in [('@@uemail@@', '{user.email}'), ('@@trx@@', "{'TRX-' + r.createdAt.slice(0, 10).replace(/-/g, '') + '-' + r.code.slice(3, 8)}"), ('@@cat@@', '{e.cat}'), ('@@tag@@', '{e.tag}'), ('@@title@@', '{e.title}'), ('@@venue@@', '{e.venue}'), ('@@qty@@', '{r.qty}'), ('@@dateS@@', "{d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}"), ('@@year@@', "{'Edición ' + d.getFullYear()}"), ('@@time@@', '{hm(d)}'), ('@@doors@@', '{hm(doors)}'), ('@@code@@', '{r.code}'), ('@@uname@@', '{user.name}')]:
    assert a in C, a; C = C.replace(a, b)
C = sr(r'<button([^>]*)>((?:(?!</button>).)*?Agendar velada)', r'<button\1 onClick={ics}>\2', C)
C = sr(r'<button([^>]*)>((?:(?!</button>).)*?Descarga Oficial)', r'<button\1 onClick={() => window.print()}>\2', C)
C = sr(r'href="#" rel="noopener noreferrer" target="_blank"', 'href={maps} rel="noopener noreferrer" target="_blank"', C)
open(f'{G}/booking.jsx', 'w', encoding='utf-8').write('''import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, money, fmt } from '../api.js'; import { useAuth } from '../main.jsx';
const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23ece8e1'/%3E%3C/svg%3E";
export function Reserve() {
  const { id } = useParams(), [p] = useSearchParams(), nav = useNavigate(), { user } = useAuth(), [e, setE] = useState(null), [qty, setQty] = useState(+p.get('qty') || 1), [pay, setPay] = useState('apple-pay'), [err, setErr] = useState(''), [busy, setBusy] = useState(false), [secs, setSecs] = useState(600);
  useEffect(() => { api('/events/' + id).then(x => { if (x.payUrl) return nav('/evento/' + id, { replace: true }); setE(x); setQty(q => Math.max(1, Math.min(q, 4, x.left || 1))); }).catch(x => setErr(x.message)); }, [id]);
  useEffect(() => { const t = setInterval(() => setSecs(s => s - 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (secs <= 0) nav('/evento/' + id, { replace: true }); }, [secs]);
  if (!e) return <p className="p-space-xl">{err || 'Cargando…'}</p>;
  const sub = e.price * qty, fee = +(sub * 0.05).toFixed(2), total = sub + fee, max = Math.min(4, e.left), timer = String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0');
  const doPay = async () => { setBusy(true); setErr(''); try { const r = await api('/reservations', { method: 'POST', body: { eventId: e.id, qty, payment: pay } }); nav('/confirmacion/' + r.code); } catch (x) { setErr(x.message); setBusy(false); } };
  return (<>''' + R + '''</>);
}
export function Confirmation() {
  const { code } = useParams(), { user } = useAuth(), [r, setR] = useState(null), [err, setErr] = useState('');
  useEffect(() => { api('/reservations/' + code).then(setR).catch(x => setErr(x.message)); }, [code]);
  if (!r) return <p className={'p-space-xl ' + (err ? 'text-error' : '')}>{err || 'Cargando…'}</p>;
  const e = r.event, d = new Date(e.date), doors = new Date(d - 30 * 60000), hm = x => x.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + ' hs';
  const maps = `https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`, z = x => x.toISOString().replace(/[-:]|\\.\\d{3}/g, '');
  const ics = () => { const t = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', 'UID:' + r.code + '@nexo', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(d), 'DTEND:' + z(new Date(+d + 2 * 3600000)), 'SUMMARY:' + e.title, 'LOCATION:' + e.venue, 'END:VEVENT', 'END:VCALENDAR'].join('\\r\\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/calendar' })); a.download = r.code + '.ics'; a.click(); };
  return (<>''' + C + '''</>);
}
''')
m = open('client/src/main.jsx', encoding='utf-8').read()
m = m.replace("import { Reserve, Confirmation, MyReservations, Denied }", "import { MyReservations, Denied }")
if "generated/booking.jsx" not in m: m = m.replace("import Layout from './generated/Layout.jsx';", "import Layout from './generated/Layout.jsx'; import { Reserve, Confirmation } from './generated/booking.jsx';")
open('client/src/main.jsx', 'w', encoding='utf-8').write(m)
print('reserva+confirmación generadas')
