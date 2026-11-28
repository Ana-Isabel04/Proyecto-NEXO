import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { api, money, fmt } from './api.js';
import { useAuth } from './main.jsx';

/* Pantallas del visitante con el sistema de diseño de Stitch (Warm Editorial Neominimalism):
   Mapa cultural · Detalle del evento · Mis reservas · Acceso denegado */

L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' });

const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Crect width='400' height='240' fill='%23ece8e1'/%3E%3C/svg%3E";
const CAT_COLOR = { 'Música': '#e11d48', 'Tecnología': '#2563eb', 'Deportivo': '#059669', 'Gastronomía': '#ea580c', 'Educativo': '#6366f1', 'Arte': '#dc2626', 'Entretenimiento': '#ca8a04' };
const colorOf = c => CAT_COLOR[c] || '#712ae2';
const SOL = [6.1759, -75.5917]; // Parque Principal de Envigado, centro de referencia

const km = (a, b) => { // distancia haversine en km
  const r = x => x * Math.PI / 180, dLat = r(b[0] - a[0]), dLng = r(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};
const fmtDist = d => d < 1 ? Math.round(d * 1000 / 10) * 10 + ' m' : d.toFixed(1) + ' km';
const day = d => { const t = new Date(d), n = new Date(), s = x => new Date(x).setHours(0, 0, 0, 0), diff = Math.round((s(t) - s(n)) / 864e5), h = t.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) + ' h';
  return (diff === 0 ? 'Hoy' : diff === 1 ? 'Mañana' : t.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' })) + ', ' + h; };
const pin = c => L.divIcon({ className: '', iconSize: [30, 38], iconAnchor: [15, 36], popupAnchor: [0, -32],
  html: `<div style="width:30px;height:30px;background:${c};border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px #0004"><div style="width:8px;height:8px;background:#fff;border-radius:50%;margin:8px"></div></div>` });
const directions = e => `https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`;
const Icon = ({ n, c = '' }) => <span className={'material-symbols-outlined ' + c}>{n}</span>;
const Aforo = ({ e, color }) => <div className="flex items-center justify-between gap-2 bg-surface-container-low rounded-lg p-2"><div className="flex items-center gap-2"><Icon n="group" c="text-outline text-[14px]" /><span className="font-label-sm text-on-surface-variant">{e.left <= 0 ? 'Agotado' : `Aforo: ${e.sold} / ${e.cap}`}</span></div>
  <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: Math.min(100, e.sold / e.cap * 100) + '%', background: color || '#000' }} /></div></div>;
const Cupos = ({ e }) => e.left <= 0 ? <span className="px-2 py-0.5 rounded-md bg-error-container text-error font-label-sm">Agotado</span>
  : e.left <= 15 ? <span className="px-2 py-0.5 rounded-md bg-[#fef3c7] text-[#92400e] font-label-sm">Últimos {e.left} cupos</span>
  : !e.price ? <span className="px-2 py-0.5 rounded-md bg-[#d1fae5] text-[#065f46] font-label-sm">Acceso libre</span> : <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-sm">{e.left} cupos</span>;

/* ───────────────────────── MAPA CULTURAL ───────────────────────── */
function Fly({ target }) { const map = useMap(); useEffect(() => { if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 15), { duration: .6 }); }, [target]); return null; }

export function MapPage() {
  const nav = useNavigate(), [all, setAll] = useState([]), [loading, setLoading] = useState(true), [q, setQ] = useState(''), [cat, setCat] = useState(''), [radius, setRadius] = useState(10),
    [origin, setOrigin] = useState(SOL), [geo, setGeo] = useState(''), [sel, setSel] = useState(null), refs = useRef({});
  useEffect(() => { api('/events?limit=100').then(d => setAll(d.items)).finally(() => setLoading(false)); }, []);
  const cats = useMemo(() => [...new Set(all.map(e => e.cat))], [all]);
  const items = useMemo(() => all.map(e => ({ ...e, dist: km(origin, [e.lat, e.lng]) }))
    .filter(e => (!cat || e.cat === cat) && e.dist <= radius && (!q.trim() || (e.title + ' ' + e.venue + ' ' + e.cat).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''))))
    .sort((a, b) => a.dist - b.dist), [all, cat, radius, q, origin]);
  const locate = () => { setGeo('Buscando tu ubicación…'); navigator.geolocation ? navigator.geolocation.getCurrentPosition(p => { setOrigin([p.coords.latitude, p.coords.longitude]); setGeo('Usando tu ubicación'); }, () => setGeo('No pudimos acceder a tu ubicación'), { timeout: 8000 }) : setGeo('Tu navegador no permite ubicación'); };
  const focus = e => { setSel(e); setTimeout(() => refs.current[e.id]?.openPopup(), 650); };
  const chip = (on, c) => 'px-3 py-1.5 rounded-full font-label-md transition-all flex items-center gap-1.5 whitespace-nowrap ' + (on ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-container-high');
  return <div className="w-full bg-surface flex flex-col-reverse lg:flex-row lg:h-[calc(100vh-5rem)] overflow-hidden">
    <aside className="w-full lg:w-[440px] xl:w-[480px] lg:h-full flex flex-col flex-shrink-0 bg-surface z-20 shadow-xl overflow-hidden">
      <div className="p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between"><div className="flex items-center gap-space-xs"><span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" /><span className="font-label-sm uppercase tracking-widest text-on-surface-variant">Cartografía Viva</span></div>
          <Link to="/buscar" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors font-label-md text-on-surface"><Icon n="view_agenda" c="text-[15px]" /><span>Vista Cartelera</span></Link></div>
        <div><h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Explora Envigado Cultural</h1><p className="font-body-sm text-on-surface-variant">{loading ? 'Cargando…' : `${all.length} experiencias activas en recintos patrimoniales`}</p></div>
        <div className="w-full flex items-center gap-space-sm px-3.5 py-2.5 rounded-xl bg-surface-container-low focus-within:bg-surface-container-lowest focus-within:shadow-sm transition-all"><Icon n="search" c="text-outline text-[18px]" />
          <input className="w-full bg-transparent border-0 p-0 text-on-surface placeholder:text-outline text-body-sm focus:outline-none focus:ring-0" placeholder="Buscar evento, sala o disciplina" value={q} onChange={e => setQ(e.target.value)} />
          {q && <button aria-label="Limpiar búsqueda" className="text-outline hover:text-on-surface" onClick={() => setQ('')} type="button"><Icon n="close" c="text-[16px]" /></button>}</div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button className={chip(!cat)} onClick={() => setCat('')}>Todos ({all.length})</button>
          {cats.map(c => <button key={c} className={chip(cat === c)} onClick={() => setCat(cat === c ? '' : c)}><span className="w-2 h-2 rounded-full" style={{ background: colorOf(c) }} /><span>{c}</span></button>)}</div>
        <div className="px-1 pt-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-label-md"><span className="text-on-surface-variant flex items-center gap-1"><Icon n="near_me" c="text-[14px]" /> Radio de búsqueda</span><span className="font-bold text-on-surface">{radius} km</span></div>
          <input className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" type="range" min="0.5" max="10" step="0.5" value={radius} onChange={e => setRadius(+e.target.value)} aria-label="Radio de búsqueda" />
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm"><span>500 m</span>
            <button type="button" onClick={locate} className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-on-surface"><Icon n="my_location" c="text-[13px]" />{geo || 'Usar mi ubicación'}</button><span>10 km</span></div></div></div>
      <div className="px-space-lg py-2 bg-surface-container-low flex items-center justify-between"><span className="font-label-sm uppercase tracking-wider text-on-surface-variant">{items.length} {items.length === 1 ? 'evento' : 'eventos'} en este cuadrante</span><span className="font-label-sm text-on-surface">Ordenar: <b>Cercanía</b></span></div>
      <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-md max-h-[60vh] lg:max-h-none">
        {items.map(e => <article key={e.id} onClick={() => focus(e)} className={'group p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer ' + (sel?.id === e.id ? 'ring-2 ring-secondary' : '')}>
          <div className="flex gap-space-md"><div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative"><img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={e.img || FALLBACK} alt={e.title} loading="lazy" />
            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-white font-label-sm shadow-sm" style={{ background: colorOf(e.cat) }}>{e.cat}</span></div>
            <div className="flex-1 min-w-0 flex flex-col justify-between"><div>
              <div className="flex items-center justify-between gap-1 mb-1"><span className="font-label-sm font-semibold flex items-center gap-1" style={{ color: colorOf(e.cat) }}><Icon n="schedule" c="text-[12px]" />{day(e.date)}</span><Cupos e={e} /></div>
              <h2 className="font-title-md text-on-surface leading-snug line-clamp-1 group-hover:text-secondary transition-colors">{e.title}</h2><p className="font-body-sm text-on-surface-variant truncate mt-0.5">{e.venue}</p></div>
              <div className="flex items-center justify-between pt-2"><span className="font-title-md text-on-surface">{e.price ? money(e.price) : 'Gratis'}</span><span className="text-on-surface-variant font-label-sm flex items-center gap-0.5"><Icon n="directions_walk" c="text-[14px]" />{fmtDist(e.dist)}</span></div></div></div>
          <div className="mt-3"><Aforo e={e} color={colorOf(e.cat)} /></div></article>)}
        {!loading && !items.length && <div className="text-center py-space-xl text-on-surface-variant"><Icon n="travel_explore" c="text-[40px] text-outline" /><p className="font-body-md mt-2">No hay eventos con estos filtros.</p><button className="underline underline-offset-4" onClick={() => { setQ(''); setCat(''); setRadius(10); }}>Limpiar filtros</button></div>}
      </div></aside>
    <div className="relative z-0 flex-1 h-[55vh] lg:h-full">
      <MapContainer center={origin} zoom={14} className="h-full w-full" zoomControl={true}>
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        <Circle center={origin} radius={radius * 1000} pathOptions={{ color: '#712ae2', weight: 1, dashArray: '6 6', fillOpacity: .04 }} />
        <Fly target={sel} />
        {items.map(e => <Marker key={e.id} position={[e.lat, e.lng]} icon={pin(colorOf(e.cat))} ref={m => { if (m) refs.current[e.id] = m; }} eventHandlers={{ click: () => setSel(e) }}>
          <Popup minWidth={250}><div className="font-body-sm"><img src={e.img || FALLBACK} alt="" className="w-full h-28 object-cover rounded-lg mb-2" />
            <div className="font-label-sm font-semibold mb-1" style={{ color: colorOf(e.cat) }}>{e.cat} · {day(e.date)}</div><div className="font-title-md leading-snug mb-1">{e.title}</div><div className="text-on-surface-variant mb-2">{e.venue}</div>
            <div className="flex items-center justify-between mb-3"><b>{e.price ? money(e.price) : 'Gratis'}</b><Cupos e={e} /></div>
            <div className="flex gap-2"><button onClick={() => nav('/evento/' + e.id)} className="flex-1 px-3 py-2 rounded-lg bg-primary text-on-primary font-label-md">Ver detalle →</button>
              <a href={directions(e)} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md flex items-center gap-1"><Icon n="directions" c="text-[14px]" />Cómo llegar</a></div></div></Popup></Marker>)}
      </MapContainer></div></div>;
}

/* ───────────────────────── DETALLE DEL EVENTO ───────────────────────── */
export function EventDetail() {
  const { id } = useParams(), nav = useNavigate(), { user } = useAuth(), [e, setE] = useState(null), [qty, setQty] = useState(1), [err, setErr] = useState('');
  useEffect(() => { setE(null); setErr(''); setQty(1); api('/events/' + id).then(setE).catch(x => setErr(x.message)); }, [id]);
  if (err) return <div className="max-w-xl mx-auto py-space-xl px-margin text-center"><Icon n="event_busy" c="text-[48px] text-outline" /><h1 className="font-headline-md mt-2">{err}</h1><Link className="inline-block mt-4 px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg uppercase tracking-wider" to="/buscar">Ver todos los eventos</Link></div>;
  if (!e) return <div className="max-w-[1440px] mx-auto px-margin-desktop py-space-xl text-on-surface-variant">Cargando…</div>;
  const color = colorOf(e.cat), max = Math.max(1, Math.min(4, e.left)), sub = e.price * qty, fee = +(sub * .05).toFixed(2), total = sub + fee, soldOut = e.left <= 0;
  return <div className="w-full bg-surface">
    <section className="w-full bg-surface-container-low"><div className="max-w-[1440px] mx-auto px-margin-desktop py-space-md font-label-md text-on-surface-variant flex items-center gap-2"><Link to="/" className="hover:text-primary">Inicio</Link><Icon n="chevron_right" c="text-[14px]" /><Link to={'/buscar?cat=' + encodeURIComponent(e.cat)} className="hover:text-primary">{e.cat}</Link><Icon n="chevron_right" c="text-[14px]" /><span className="text-on-surface truncate">{e.title}</span></div></section>
    <div className="max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-space-xl">
      <div className="flex flex-col gap-space-lg min-w-0">
        <div className="rounded-2xl overflow-hidden h-[320px] md:h-[420px] relative"><img className="w-full h-full object-cover" src={e.img || FALLBACK} alt={e.title} />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-white font-label-md shadow" style={{ background: color }}>{e.cat}</span>{e.tag && <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur font-label-md text-on-surface">{e.tag}</span>}</div>
        <div><h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-space-sm">{e.title}</h1>
          <div className="flex flex-wrap gap-x-space-lg gap-y-2 text-on-surface-variant font-body-md"><span className="flex items-center gap-1.5"><Icon n="schedule" c="text-[18px]" /><span className="capitalize">{fmt(e.date)}</span></span><span className="flex items-center gap-1.5"><Icon n="location_on" c="text-[18px]" />{e.venue}</span><span className="flex items-center gap-1.5"><Icon n="groups" c="text-[18px]" />Organiza: {e.organizer}</span></div></div>
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm"><h2 className="font-headline-sm text-headline-sm mb-space-sm">Sobre esta velada</h2><p className="font-body-lg text-on-surface-variant leading-relaxed">{e.desc || 'Sin descripción disponible.'}</p></div>
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm"><div className="flex items-center justify-between mb-space-sm"><h2 className="font-headline-sm text-headline-sm">Ubicación</h2>
          <a href={directions(e)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest font-label-md"><Icon n="directions" c="text-[16px]" />Cómo llegar</a></div>
          <div className="relative z-0 h-64 rounded-xl overflow-hidden"><MapContainer center={[e.lat, e.lng]} zoom={15} scrollWheelZoom={false} className="h-full w-full"><TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" /><Marker position={[e.lat, e.lng]} icon={pin(color)} /></MapContainer></div>
          <Link to="/mapa" className="inline-block mt-space-sm text-secondary font-label-md underline underline-offset-4">Ver en el mapa cultural</Link></div></div>
      <aside><div className="lg:sticky lg:top-28 bg-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col gap-space-md">
        <div className="flex items-end justify-between"><div><span className="font-label-sm uppercase tracking-wider text-on-surface-variant">{e.price ? 'Desde' : 'Entrada'}</span><div className="font-headline-md text-headline-md">{e.price ? money(e.price) : 'Gratis'}{e.price > 0 && <small className="font-body-sm text-on-surface-variant"> / persona</small>}</div></div><Cupos e={e} /></div>
        <Aforo e={e} color={color} />
        {e.contact && <p className="font-body-sm text-on-surface-variant flex items-start gap-2 break-all"><Icon n="contact_mail" c="text-[16px] mt-0.5" />Contacto: {e.contact}</p>}
        {e.status === 'cancelado' || e.status === 'finalizado' ? <p role="status" className="w-full text-center px-6 py-4 rounded-xl bg-error-container text-error font-label-lg uppercase tracking-wider">Evento {e.status}</p>
        : e.payUrl ? <>
          <a href={e.payUrl} target="_blank" rel="noopener noreferrer" className="w-full text-center px-6 py-4 rounded-xl bg-primary text-on-primary font-label-lg uppercase tracking-wider hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">Reservar en el sitio del organizador<Icon n="open_in_new" c="text-[18px]" /></a>
          <p className="font-body-sm text-on-surface-variant flex items-start gap-2"><Icon n="info" c="text-[16px] mt-0.5" />Serás redirigido a un sitio externo. El pago y la confirmación los gestiona el organizador.</p></>
        : soldOut ? <button disabled className="w-full px-6 py-4 rounded-xl bg-surface-container-high text-on-surface-variant font-label-lg uppercase tracking-wider cursor-not-allowed">Agotado</button>
        : <>
          <div className="flex items-center justify-between bg-surface-container-low rounded-xl p-2"><span className="font-label-md text-on-surface-variant pl-2">Entradas (máx. 4)</span>
            <div className="flex items-center gap-3"><button aria-label="Menos" disabled={qty <= 1} onClick={() => setQty(qty - 1)} className="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-sm disabled:opacity-40 flex items-center justify-center"><Icon n="remove" c="text-[18px]" /></button><b className="w-4 text-center">{qty}</b>
              <button aria-label="Más" disabled={qty >= max} onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-lg bg-surface-container-lowest shadow-sm disabled:opacity-40 flex items-center justify-center"><Icon n="add" c="text-[18px]" /></button></div></div>
          {e.price > 0 && <div className="font-body-sm text-on-surface-variant flex justify-between"><span>Subtotal + preservación 5%</span><b className="text-on-surface">{money(total)}</b></div>}
          <button onClick={() => nav(`/reservar/${e.id}?qty=${qty}`)} className="w-full px-6 py-4 rounded-xl bg-primary text-on-primary font-label-lg uppercase tracking-wider hover:bg-neutral-800 hover:-translate-y-0.5 transition-all shadow-md">Asegurar mi lugar →</button>
          {!user && <p className="font-body-sm text-on-surface-variant text-center">Te pediremos iniciar sesión para completar la reserva.</p>}</>}
        <div className="pt-space-sm border-t border-outline-variant/40 font-body-sm text-on-surface-variant flex items-center gap-2"><Icon n="verified_user" c="text-[16px] text-secondary" />Cancelación gratuita hasta 48 h antes del evento.</div>
      </div></aside></div></div>;
}

/* ───────────────────────── MIS RESERVAS ───────────────────────── */
const STATUS = { activas: ['Confirmada • Pase listo', 'bg-secondary-container'], finalizadas: ['Finalizada', 'bg-outline'], canceladas: ['Cancelada', 'bg-error'] };
export function MyReservations() {
  const { user } = useAuth(), [list, setList] = useState(null), [tab, setTab] = useState('activas'), [cat, setCat] = useState(''), [toast, setToast] = useState(null), [ask, setAsk] = useState(null), [busy, setBusy] = useState(false), [err, setErr] = useState('');
  const load = () => api('/reservations/mine').then(setList).catch(x => setErr(x.message));
  useEffect(() => { load(); }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); } }, [toast]);
  if (err) return <p className="max-w-xl mx-auto py-space-xl text-error">{err}</p>;
  if (!list) return <p className="max-w-[1440px] mx-auto px-margin-desktop py-space-xl text-on-surface-variant">Cargando…</p>;
  const state = r => r.status === 'cancelada' ? 'canceladas' : new Date(r.event.date) < Date.now() ? 'finalizadas' : 'activas';
  const cats = [...new Set(list.map(r => r.event.cat))], inCat = r => !cat || r.event.cat === cat, count = t => list.filter(r => state(r) === t && inCat(r)).length, shown = list.filter(r => state(r) === tab && inCat(r));
  const hours = r => (new Date(r.event.date) - Date.now()) / 36e5;
  const doCancel = async () => { setBusy(true); try { await api(`/reservations/${ask.code}/cancel`, { method: 'POST' }); setToast({ ok: true, t: `Reserva #${ask.code} cancelada` }); setAsk(null); await load(); } catch (x) { setToast({ ok: false, t: x.message }); setAsk(null); } setBusy(false); };
  return <div className="w-full bg-surface min-h-[calc(100vh-20rem)]">
    <section className="w-full bg-surface-container-low py-space-xl"><div className="max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
      <div className="max-w-2xl"><div className="flex items-center gap-space-xs mb-space-xs"><span className="font-label-sm uppercase tracking-widest text-secondary font-bold px-space-xs py-1 rounded bg-secondary-fixed">Cartera Cultural • NEXO Pass</span></div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-space-xs">Mis Reservas</h1><p className="font-body-lg text-on-surface-variant leading-relaxed">Gestiona tus pases culturales, entradas digitales y experiencias programadas.</p></div>
      <div className="flex flex-wrap items-center gap-space-md p-space-sm bg-surface-container-lowest rounded-xl shadow-sm"><div className="flex items-center gap-space-xs px-space-md py-2 bg-surface-container-low rounded-lg"><Icon n="verified_user" c="text-[18px] text-secondary" /><span className="font-label-md font-semibold">{user?.name} · NEXO ID #{String(user?.id || 0).padStart(4, '0')}</span></div>
        <div className="h-6 w-px bg-surface-container-highest" /><div className="px-space-sm font-label-sm text-on-surface-variant">Entradas activas: <b className="text-primary font-label-md">{list.filter(r => state(r) === 'activas').reduce((s, r) => s + r.qty, 0)}</b></div></div></div></section>
    <section className="w-full py-space-xl"><div className="max-w-[1440px] mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md mb-space-xl">
        <div className="flex items-center gap-space-xs p-1 bg-surface-container-high rounded-xl self-start">{['activas', 'finalizadas', 'canceladas'].map(t => <button key={t} onClick={() => setTab(t)} className={'px-space-md py-2.5 rounded-lg font-label-md capitalize transition-all flex items-center gap-space-xs ' + (tab === t ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface')}><span>{t}</span>
          <span className={'min-w-5 h-5 px-1 rounded-full font-label-sm flex items-center justify-center ' + (tab === t ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface')}>{count(t)}</span></button>)}</div>
        <div className="flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-xl shadow-sm self-start"><Icon n="filter_list" c="text-[18px] text-on-surface-variant" />
          <select aria-label="Filtrar por disciplina" value={cat} onChange={e => setCat(e.target.value)} className="bg-transparent text-body-sm font-medium focus:outline-none cursor-pointer border-0 focus:ring-0"><option value="">Todas las disciplinas</option>{cats.map(c => <option key={c}>{c}</option>)}</select></div></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-lg">
        {shown.map(r => { const e = r.event, [lbl, dot] = STATUS[tab], canCancel = tab === 'activas' && hours(r) >= 48;
          return <article key={r.code} className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md">
            <div className="flex items-start justify-between gap-space-sm mb-space-md"><div className="flex flex-wrap items-center gap-space-xs"><span className="px-space-xs py-1 rounded font-label-sm font-bold tracking-wide uppercase text-white" style={{ background: colorOf(e.cat) }}>{e.cat}</span><span className="font-label-sm text-on-surface-variant font-mono">#{r.code}</span></div>
              <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container font-label-sm font-bold"><span className={'w-2 h-2 rounded-full ' + dot} /><span>{e.status === 'cancelado' ? 'Evento cancelado' : lbl}</span></div></div>
            <div className="flex flex-col lg:flex-row gap-space-md mb-space-lg"><div className="w-full lg:w-44 h-36 rounded-xl overflow-hidden shrink-0"><img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={e.img || FALLBACK} alt={e.title} loading="lazy" /></div>
              <div className="flex flex-col justify-between flex-1 min-w-0"><div><h2 className="font-headline-sm text-headline-sm text-primary mb-space-xs">{e.title}</h2>
                <p className="font-body-sm text-on-surface-variant mb-space-sm flex items-center gap-1"><Icon n="schedule" c="text-[16px]" /><strong className="text-on-surface font-semibold capitalize">{fmt(e.date)}</strong></p>
                <p className="font-body-sm text-on-surface-variant flex items-center gap-1"><Icon n="location_on" c="text-[16px]" />{e.venue}</p></div>
                <div className="mt-space-sm"><span className="font-label-md font-semibold bg-surface-container-low px-space-xs py-1 rounded">{r.qty} {r.qty === 1 ? 'Entrada' : 'Entradas'} • {money(r.total)}</span></div></div></div>
            <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low p-space-sm rounded-xl">
              <Link to={'/confirmacion/' + r.code} className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-md font-bold hover:bg-inverse-surface transition-colors flex items-center gap-space-xs"><Icon n="qr_code_2" c="text-[18px]" />Ver ticket</Link>
              <a href={directions(e)} target="_blank" rel="noopener noreferrer" className="px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md hover:bg-surface-container-highest flex items-center gap-space-xs"><Icon n="directions" c="text-[18px]" />Cómo llegar</a>
              <Link to={'/evento/' + e.id} className="px-space-md py-2.5 rounded-lg text-on-surface-variant font-label-md hover:text-on-surface">Ver evento</Link>
              {tab === 'activas' && <button onClick={() => canCancel && setAsk(r)} disabled={!canCancel} title={canCancel ? '' : 'Solo se puede cancelar hasta 48 h antes'} className="ml-auto px-space-md py-2.5 rounded-lg text-error font-label-md hover:bg-error-container/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-space-xs"><Icon n="event_busy" c="text-[18px]" />Cancelar</button>}</div></article>; })}</div>
      {!shown.length && <div className="text-center py-space-xl text-on-surface-variant"><Icon n="confirmation_number" c="text-[48px] text-outline" /><p className="font-body-lg mt-2">No tienes reservas {tab} {cat && `de ${cat}`}.</p>{tab === 'activas' && <Link to="/buscar" className="inline-block mt-4 px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg uppercase tracking-wider">Explorar eventos</Link>}</div>}
      <div className="mt-space-xl p-space-lg bg-surface-container-low rounded-2xl flex items-start gap-3 text-on-surface-variant font-body-sm"><Icon n="verified_user" c="text-secondary" /><p><b className="text-on-surface">Garantía Cultural NEXO.</b> Puedes cancelar sin costo hasta 48 horas antes del inicio del evento. Después de ese plazo la reserva ya no es reembolsable.</p></div></div></section>
    {ask && <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => !busy && setAsk(null)}><div className="bg-surface-container-lowest rounded-2xl p-space-lg max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
      <h2 className="font-headline-sm mb-2">¿Cancelar esta reserva?</h2><p className="font-body-md text-on-surface-variant mb-space-lg">{ask.event.title} · {ask.qty} entrada(s). Los cupos volverán a estar disponibles.</p>
      <div className="flex justify-end gap-3"><button disabled={busy} onClick={() => setAsk(null)} className="px-5 py-3 rounded-xl bg-surface-container-high font-label-md">Mantener</button><button disabled={busy} onClick={doCancel} className="px-5 py-3 rounded-xl bg-error text-white font-label-md">{busy ? 'Cancelando…' : 'Sí, cancelar'}</button></div></div></div>}
    {toast && <div role="status" className={'fixed bottom-20 right-4 z-[60] px-5 py-3 rounded-xl shadow-lg font-label-md text-white ' + (toast.ok ? 'bg-primary' : 'bg-error')}>{toast.t}</div>}
  </div>;
}

/* ───────────────────────── ACCESO DENEGADO ───────────────────────── */
export function Denied() {
  const { user, logout } = useAuth(), nav = useNavigate();
  return <div className="w-full max-w-5xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center">
    <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-error-container/40 text-error"><span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" /><span className="font-label-sm uppercase tracking-wider">Código de estado: 403 / Acceso restringido</span></div>
    <div className="relative w-40 h-40 mb-10 flex items-center justify-center"><div className="absolute inset-0 bg-surface-container rounded-full blur-2xl opacity-60" />
      <svg className="relative w-32 h-32 text-on-surface" fill="none" viewBox="0 0 120 120"><rect height="56" rx="8" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5" width="76" x="22" y="32" /><path d="M42 32V88" stroke="currentColor" strokeDasharray="2 2" strokeOpacity=".4" /><rect fill="currentColor" fillOpacity=".06" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" width="22" x="49" y="52" /><path d="M54 52V46C54 42.7 56.7 40 60 40C63.3 40 66 42.7 66 46V52" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /><circle cx="60" cy="59" fill="currentColor" r="1.5" /><path d="M60 61V64" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /><circle className="fill-error" cx="82" cy="44" r="2" /></svg></div>
    <div className="text-center max-w-2xl mb-10"><h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4 tracking-tight">Esta experiencia requiere autorización especial</h1>
      <p className="font-body-lg text-on-surface-variant leading-relaxed">{user ? `Tu cuenta (${user.role}) no tiene permiso para ver esta sección. ` : 'No dispones de las credenciales necesarias o la sesión ha expirado. '}Si consideras que se trata de un error, inicia sesión con la cuenta correcta o contacta a soporte.</p></div>
    <div className="w-full max-w-xl bg-surface-container-low rounded-xl p-6 lg:p-8 mb-10 shadow-sm"><div className="flex items-center gap-2 mb-4"><Icon n="info" c="text-error" /><span className="font-title-md">Comprobaciones recomendadas</span></div>
      <div className="flex flex-col gap-3.5">{['Verifica que iniciaste sesión con la cuenta de asistente correspondiente.', 'Las reservas y “Mis reservas” solo están disponibles para cuentas de asistente.', 'Si tu sesión expiró, vuelve a iniciar sesión para continuar.'].map(t => <div key={t} className="flex items-start gap-3"><Icon n="check_circle" c="text-body-sm mt-0.5 text-on-surface-variant" /><p className="font-body-md text-on-surface-variant">{t}</p></div>)}</div></div>
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
      <Link to="/" className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-primary text-on-primary font-label-lg uppercase tracking-wider transition-all hover:bg-neutral-800 hover:-translate-y-0.5 shadow-sm">Volver al inicio de exploración</Link>
      <button onClick={() => { logout(); nav('/login'); }} className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-surface-container-high text-on-surface font-label-lg tracking-wider transition-all hover:bg-surface-container-highest">{user ? 'Iniciar sesión con otra cuenta' : 'Iniciar sesión'}</button></div>
    <p className="font-body-sm text-on-surface-variant">ID de incidencia: #NX-{String(Date.now()).slice(-5)}</p></div>;
}
