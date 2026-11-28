import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, money } from '../api.js';
const CATS = ['Música', 'Gastronomía', 'Tecnología', 'Arte'], LIM = 6;
const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Crect width='400' height='240' fill='%23ece8e1'/%3E%3C/svg%3E";
const fechaCorta = d => { const x = new Date(d); return x.toLocaleDateString('es-CO', { day: '2-digit', month: 'long' }) + ' • ' + x.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) + 'h'; };
function Card({ e }) {
  const pct = Math.round(e.sold / e.cap * 100);
  return (<article className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_30px_-4px_rgba(26,26,26,0.04),0_2px_6px_-1px_rgba(26,26,26,0.02)] hover:shadow-xl transition-all duration-300 flex flex-col">
<div className="relative h-60 w-full overflow-hidden bg-surface-container-high">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" src={e.img || FALLBACK} />
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
<span className="px-2.5 py-1 rounded-full text-[11px] font-label-md uppercase tracking-wider bg-rose-50 text-rose-600 font-semibold shadow-sm">
                  {e.cat}
                </span>
<span className="px-2.5 py-1 rounded-full text-[11px] font-label-md uppercase tracking-wider bg-surface-container-lowest text-primary font-semibold shadow-sm">
                  {e.tag}
                </span>
</div>
<button aria-label="Guardar en favoritos" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-primary hover:bg-surface-container-lowest transition-colors shadow-sm" type="button">
<span className="material-symbols-outlined text-[18px]">bookmark_border</span>
</button>
</div>
<div className="p-space-lg flex-1 flex flex-col justify-between gap-space-md">
<div >
<div className="flex items-center gap-space-xs text-outline font-label-md text-label-md mb-2">
<span className="material-symbols-outlined text-[16px]">location_on</span>
<span className="truncate">{e.venue}</span>
</div>
<h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors leading-snug">
                  {e.title}
                </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-2 leading-relaxed">{e.desc}</p>
</div>
<div className="pt-space-md bg-transparent flex flex-col gap-space-sm">
<div className="flex items-center justify-between text-[12px] font-label-sm uppercase tracking-wide">
<span className="text-on-surface-variant font-medium">Aforo total: {e.cap} cupos</span>
<span className="text-on-surface-variant font-semibold">{e.left <= 0 ? 'Agotado' : e.left <= 20 ? `Últimos ${e.left} cupos` : `${pct}% reservado`}</span>
</div>
<div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full transition-all duration-500" style={{width:pct + '%'}}></div>
</div>
<div className="flex items-center justify-between pt-2">
<div >
<span className="block text-[11px] font-label-sm uppercase tracking-widest text-outline">Fecha</span>
<span className="font-title-md text-title-md text-primary font-semibold">{fechaCorta(e.date)}</span>
</div>
<div className="text-right">
<span className="block text-[11px] font-label-sm uppercase tracking-widest text-outline">Entrada general</span>
<span className="font-title-lg text-title-lg text-primary font-bold">{e.price ? money(e.price) : 'Gratis'} <span className="text-[12px] font-normal text-outline">COP</span></span>
</div>
</div>
<Link className="w-full mt-2 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider text-center hover:bg-neutral-800 transition-colors shadow-sm" to={'/evento/' + e.id}>
                  {e.payUrl ? 'Ver evento' : 'Asegurar mi lugar'}
                </Link>
</div>
</div>
</article>);
}
export function SearchPage() {
  const [p, setP] = useSearchParams(), [data, setData] = useState({ items: [], total: 0 }), [loading, setLoading] = useState(true), [open, setOpen] = useState(false), [list, setList] = useState(false), [qv, setQv] = useState(p.get('q') || '');
  const page = +p.get('page') || 1, { items, total } = data, pages = Math.max(1, Math.ceil(total / LIM)), nFilters = ['q', 'cat', 'maxPrice', 'date', 'hour', 'radius', 'available'].filter(k => p.get(k)).length;
  useEffect(() => { setLoading(true); setQv(p.get('q') || ''); api(`/events?limit=${LIM}&` + p).then(setData).finally(() => setLoading(false)); }, [p.toString()]);
  const set = (k, v) => { const n = new URLSearchParams(p); v ? n.set(k, v) : n.delete(k); n.delete('page'); setP(n); };
  // El radio se mide desde la ubicación del usuario; sin permiso, desde el parque principal de Envigado.
  const setRadio = km => {
    const aplicar = (lat, lng) => { const n = new URLSearchParams(p); ['radius', 'lat', 'lng', 'page'].forEach(k => n.delete(k)); if (km) { n.set('radius', km); n.set('lat', lat); n.set('lng', lng); } setP(n); };
    const centro = () => aplicar(6.1759, -75.5917);
    if (!km || !navigator.geolocation) return centro();
    navigator.geolocation.getCurrentPosition(g => aplicar(g.coords.latitude, g.coords.longitude), centro, { timeout: 5000 });
  };
  const goPage = n => { const q = new URLSearchParams(p); q.set('page', n); setP(q); window.scrollTo(0, 0); };
  return (<><div className="flex flex-col w-full">



<section className="w-full bg-surface-container-low/70 py-space-lg px-margin-desktop">
<div className="max-w-[1440px] mx-auto flex flex-col gap-space-md">

<nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md tracking-wider uppercase">
<a className="hover:text-primary transition-colors" href="#">Inicio</a>
<span className="text-outline">/</span>
<a className="hover:text-primary transition-colors" href="#">Búsqueda Curada</a>
<span className="text-outline">/</span>
<span className="text-primary font-semibold">Envigado Cultural</span>
</nav>

<div className="w-full flex flex-col lg:flex-row gap-space-sm items-stretch">
<div className="relative flex-1 bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_-4px_rgba(26,26,26,0.04),0_2px_6px_-1px_rgba(26,26,26,0.02)] flex items-center px-space-md py-2">
<span className="material-symbols-outlined text-on-surface-variant text-[22px] mr-3">search</span>
<div className="flex-1 flex flex-col justify-center">
<label className="text-[10px] font-label-sm uppercase tracking-widest text-outline -mb-0.5">Término de curaduría</label>
<input className="bg-transparent font-title-lg text-title-lg text-primary outline-none w-full placeholder:text-outline" id="search-query-field" type="text" value={qv} onChange={e => setQv(e.target.value)} onKeyDown={e => e.key === 'Enter' && set('q', qv)} />
</div>
<button aria-label="Borrar texto" onClick={() => { setQv(''); set('q', ''); }} className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-outline hover:text-primary" type="button">
<span className="material-symbols-outlined text-[18px]">cancel</span>
</button>
</div>

<button className="h-14 px-6 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg uppercase tracking-wider flex items-center justify-center gap-space-xs shadow-md hover:bg-neutral-800 transition-all hover:-translate-y-0.5" onClick={() => setOpen(!open)} type="button">
<span className="material-symbols-outlined text-[20px]">tune</span>
<span >Filtrar</span>
<span className="w-5 h-5 rounded-full bg-secondary text-on-secondary text-[11px] font-label-md flex items-center justify-center ml-1">{nFilters}</span>
</button>
</div>

<div className="flex flex-col sm:flex-row sm:items-baseline justify-between pt-space-xs gap-2">
<p className="font-headline-sm text-headline-sm text-on-surface">{loading ? 'Buscando…' : <>Se encontraron <span className="font-semibold text-primary">{total} veladas culturales</span>{p.get('q') && <> para <span className="italic font-display text-[24px]">«{p.get('q')}»</span></>}</>}</p>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Índice Semanal • Temporada Primavera</span>
</div>
</div>
</section>

<section className="w-full bg-surface-container-lowest shadow-[0_2px_12px_rgba(26,26,26,0.03)] sticky top-20 z-40 px-margin-desktop py-3">
<div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-space-md">

<div className="flex items-center gap-space-xs overflow-x-auto py-1 scrollbar-none max-w-full">
<div className="flex items-center gap-space-xs overflow-x-auto py-1 scrollbar-none max-w-full">{p.get('cat') && <div onClick={() => set('cat', '')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md tracking-wider uppercase cursor-pointer hover:bg-neutral-800 transition-all"><span>Disciplina: {p.get('cat')}</span><span className="material-symbols-outlined text-[14px]">close</span></div>}{p.get('maxPrice') && <div onClick={() => set('maxPrice', '')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md tracking-wider uppercase cursor-pointer hover:bg-neutral-800 transition-all"><span>{p.get('maxPrice') === '0' ? 'Gratis' : 'Hasta $' + p.get('maxPrice')}</span><span className="material-symbols-outlined text-[14px]">close</span></div>}{nFilters === 0 && <span className="font-label-md text-label-md text-outline">Sin filtros activos</span>}<button onClick={() => { setQv(''); setP({}); }} className="text-outline hover:text-primary font-label-sm text-label-sm uppercase tracking-wider underline underline-offset-4 ml-2" type="button">Limpiar filtros</button></div>
</div>

<div className="flex items-center gap-space-md ml-auto">
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm uppercase tracking-widest text-outline hidden md:inline">Ordenar:</span>
<div className="relative inline-block"><select value={p.get('sort') || 'fecha'} onChange={e => set('sort', e.target.value)} className="appearance-none bg-surface-container-low font-title-md text-title-md text-primary pl-3 pr-8 py-1.5 rounded-lg cursor-pointer outline-none hover:bg-surface-container"><option value="fecha">Fecha más próxima</option><option value="precio">Precio menor</option></select><span className="material-symbols-outlined text-[18px] text-outline absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">unfold_more</span></div>
</div>
<div className="h-6 w-px bg-surface-variant hidden md:block"></div>

<div className="flex items-center bg-surface-container-high p-1 rounded-lg">
<button onClick={() => setList(false)} className={'p-1.5 rounded transition-all flex items-center ' + (!list ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant')} id="grid-view-btn" title="Vista Cuadrícula" type="button">
<span className="material-symbols-outlined text-[18px]">grid_view</span>
</button>
<button onClick={() => setList(true)} className={'p-1.5 rounded transition-all flex items-center ' + (list ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant')} id="list-view-btn" title="Vista Lista Continua" type="button">
<span className="material-symbols-outlined text-[18px]">view_agenda</span>
</button>
</div>
</div>
</div>
</section>
<div className={(open ? '' : 'hidden ') + 'w-full bg-surface-container-low px-margin-desktop py-space-lg shadow-inner'}><div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-space-lg"><label className="flex flex-col gap-2"><span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">Disciplina</span><select className="bg-surface-container-lowest rounded-lg px-3 py-2 font-body-md outline-none ring-1 ring-outline-variant/50" value={p.get('cat') || ''} onChange={e => set('cat', e.target.value)}><option value="">Todas</option>{CATS.map(c => <option key={c}>{c}</option>)}</select></label><label className="flex flex-col gap-2"><span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">Precio máximo</span><select className="bg-surface-container-lowest rounded-lg px-3 py-2 font-body-md outline-none ring-1 ring-outline-variant/50" value={p.get('maxPrice') || ''} onChange={e => set('maxPrice', e.target.value)}><option value="">Cualquiera</option><option value="0">Gratis</option><option value="30000">Hasta $30.000</option><option value="60000">Hasta $60.000</option></select></label><label className="flex flex-col gap-2"><span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">Fecha</span><input type="date" className="bg-surface-container-lowest rounded-lg px-3 py-2 font-body-md outline-none ring-1 ring-outline-variant/50" value={p.get('date') || ''} onChange={e => set('date', e.target.value)} /></label><label className="flex flex-col gap-2"><span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">Desde la hora</span><select className="bg-surface-container-lowest rounded-lg px-3 py-2 font-body-md outline-none ring-1 ring-outline-variant/50" value={p.get('hour') || ''} onChange={e => set('hour', e.target.value)}><option value="">Cualquiera</option><option value="12">12:00</option><option value="16">16:00</option><option value="18">18:00</option><option value="20">20:00</option></select></label><label className="flex flex-col gap-2"><span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">Distancia</span><select className="bg-surface-container-lowest rounded-lg px-3 py-2 font-body-md outline-none ring-1 ring-outline-variant/50" value={p.get('radius') || ''} onChange={e => setRadio(e.target.value)}><option value="">Cualquiera</option><option value="1">Hasta 1 km</option><option value="3">Hasta 3 km</option><option value="5">Hasta 5 km</option><option value="10">Hasta 10 km</option></select></label><label className="flex flex-col gap-2"><span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">Disponibilidad</span><select className="bg-surface-container-lowest rounded-lg px-3 py-2 font-body-md outline-none ring-1 ring-outline-variant/50" value={p.get('available') || ''} onChange={e => set('available', e.target.value)}><option value="">Todos</option><option value="true">Con cupos</option></select></label><div className="flex flex-col justify-end"><button onClick={() => setOpen(false)} className="w-full py-2.5 rounded-lg bg-surface-container-highest text-primary font-label-md text-label-md uppercase tracking-widest" type="button">Aplicar y Contraer</button></div></div></div>
<section className="w-full max-w-[1440px] mx-auto px-margin-desktop py-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">

<div className="lg:col-span-8 flex flex-col gap-space-lg">

<div className={'grid grid-cols-1 gap-space-lg ' + (list ? '' : 'md:grid-cols-2')} id="results-grid-container">
{items.map(e => <Card key={e.id} e={e} />)}{!loading && !items.length && <p className="col-span-full py-space-xl text-center text-on-surface-variant">No hay eventos con esos filtros.</p>}
</div>
<div className="w-full bg-surface-container-low/60 rounded-2xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-md"><div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md"><span>Página {page} de {pages}</span><span className="w-1 h-1 rounded-full bg-outline"></span><span>Mostrando {items.length} de {total} resultados</span></div><div className="flex items-center gap-2"><button disabled={page <= 1} onClick={() => goPage(page - 1)} className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button><button disabled={page >= pages} onClick={() => goPage(page + 1)} aria-label="Siguiente página" className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button></div></div></div>

<aside className="lg:col-span-4 flex flex-col gap-space-lg sticky top-36">

<div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_30px_-4px_rgba(26,26,26,0.04),0_2px_6px_-1px_rgba(26,26,26,0.02)] flex flex-col">
<div className="p-space-md pb-3 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
<h4 className="font-title-md text-title-md text-primary font-bold">Mapa Cultural</h4>
</div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">{total} Ubicaciones</span>
</div>

<div className="relative w-full h-56 bg-surface-container-high">
<div className="w-full h-full bg-cover bg-center" data-location="Envigado Centro, Colombia" style={{}}></div>

<div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none"></div>

<div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
<div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg font-label-sm text-[10px] font-bold">
                1
              </div>
</div>
<div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
<div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg font-label-sm text-[10px] font-bold">
                2
              </div>
</div>
<div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
<div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg font-label-sm text-[10px] font-bold">
                3
              </div>
</div>
<div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-primary text-[12px] font-label-sm bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg">
<span >Centro &amp; El Salado</span>
<span className="text-tertiary-fixed-dim">En radio de 2.4 km</span>
</div>
</div>
<div className="p-space-md">
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm leading-relaxed">
              Explora las rutas a pie entre los recintos con acústica patrimonial protegida de este fin de semana.
            </p>
<a className="w-full py-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors font-semibold" data-path="mapa-cultural" href="#">
<span className="material-symbols-outlined text-[18px]">map</span>
<span >Abrir Cartografía Completa</span>
</a>
</div>
</div>

<div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-[0_8px_30px_-4px_rgba(26,26,26,0.04),0_2px_6px_-1px_rgba(26,26,26,0.02)] flex flex-col gap-space-md">
<div className="flex items-baseline justify-between">
<h4 className="font-title-lg text-title-lg text-primary font-bold">Colectivos Destacados</h4>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Verificados</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Iniciativas curatoriales independientes detrás del rescate de estos espacios históricos.
          </p>

<div className="bg-surface-container-low/70 rounded-xl p-space-md flex flex-col gap-2 hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-11 h-11 rounded-full bg-surface-container-highest overflow-hidden shrink-0 flex items-center justify-center">
<span className="material-symbols-outlined text-[22px] text-primary">theater_comedy</span>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-1.5">
<h5 className="font-title-md text-title-md text-primary truncate font-semibold">Atelier &amp; Colectivo Prisma</h5>
<span className="material-symbols-outlined text-secondary text-[16px]" title="Curador Verificado">verified</span>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-widest block">Curaduría Sonora • 14 veladas</span>
</div>
</div>
<p className="text-[13px] font-body-sm text-on-surface-variant leading-normal mt-1">
              Especialistas en ciclos acústicos nocturnos dentro de espacios patrimoniales de Envigado.
            </p>
<div className="pt-2 flex items-center justify-between">
<span className="font-label-sm text-label-sm text-secondary font-semibold">3 veladas programadas</span>
<button className="text-primary font-label-md text-label-md hover:underline uppercase tracking-wider" type="button">Ver perfil</button>
</div>
</div>

<div className="bg-surface-container-low/70 rounded-xl p-space-md flex flex-col gap-2 hover:bg-surface-container transition-colors">
<div className="flex items-center gap-3">
<div className="w-11 h-11 rounded-full bg-surface-container-highest overflow-hidden shrink-0 flex items-center justify-center">
<span className="material-symbols-outlined text-[22px] text-primary">graphic_eq</span>
</div>
<div className="flex-1 min-w-0">
<div className="flex items-center gap-1.5">
<h5 className="font-title-md text-title-md text-primary truncate font-semibold">Colectivo Armonía</h5>
<span className="material-symbols-outlined text-secondary text-[16px]" title="Curador Verificado">verified</span>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase tracking-widest block">Acústica Sacra • 9 veladas</span>
</div>
</div>
<p className="text-[13px] font-body-sm text-on-surface-variant leading-normal mt-1">
              Investigación y divulgación de polifonías conventuales con instrumentación del barroco temprano.
            </p>
<div className="pt-2 flex items-center justify-between">
<span className="font-label-sm text-label-sm text-secondary font-semibold">2 veladas programadas</span>
<button className="text-primary font-label-md text-label-md hover:underline uppercase tracking-wider" type="button">Ver perfil</button>
</div>
</div>
</div>

<div className="rounded-2xl p-space-lg bg-surface-container-high/60 flex items-start gap-space-sm">
<span className="material-symbols-outlined text-primary text-[26px] mt-0.5">verified_user</span>
<div >
<span className="font-title-md text-title-md text-primary font-bold block mb-1">Garantía Nexo Cultural</span>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Todos los recintos incluidos cuentan con permiso patrimonial y acústica certificada sin amplificación invasiva.
            </p>
</div>
</div>
</aside>
</div>
</section>
</div></>);
}
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export function Home() {
  const nav = useNavigate(), [evs, setEvs] = useState([]);
  useEffect(() => { api('/events?limit=100').then(d => setEvs(d.items)); }, []);
  const click = ev => {
    const b = ev.target.closest('button,a'); if (!b || b.dataset.path) return; const t = norm(b.textContent).trim();
    if (/^explorar/.test(t)) return nav('/buscar');
    if (/mapa/.test(t)) return nav('/mapa');
    const cat = ['musica', 'tecnologia', 'deportivo', 'gastronomia', 'educativo', 'arte', 'entretenimiento'].find(c => t.startsWith(c)); if (cat) return nav('/buscar?q=' + cat);
    if (/reservar|registrar|asegurar/.test(t)) {
      let c = b; while (c.parentElement && !c.querySelector('h1,h2,h3,h4')) c = c.parentElement;
      const h = norm(c.querySelector('h1,h2,h3,h4')?.textContent).trim(), e = evs.find(x => h.startsWith(norm(x.title).slice(0, 12)) || norm(x.title).startsWith(h.slice(0, 12)));
      nav(e ? '/evento/' + e.id : '/buscar?q=' + encodeURIComponent(h.split(' ').slice(0, 2).join(' ')));
    }
  };
  return (<div onClick={click}><div className="flex flex-col w-full">

<section className="relative w-full overflow-hidden pb-space-xl">

<div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>
<div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-tertiary-fixed/20 blur-3xl pointer-events-none"></div>
<div className="max-w-7xl mx-auto px-margin-desktop pt-space-xl">

<div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container shadow-sm text-on-surface">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-sm tracking-wider uppercase">Curaduría de Temporada • Primavera 2025</span>
</div>
<div className="flex items-center gap-space-sm font-label-md text-on-surface-variant">
<span >01 — 08 EDICIÓN CULTURAL</span>
<span className="inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
<span >MADRID • BARCELONA • LISBOA</span>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-end mb-space-xl">
<div className="lg:col-span-9">
<h1 className="font-display text-display text-primary tracking-tight leading-[1.08] select-none">
            Descubre veladas culturales y experiencias sensoriales irrepetibles en tu ciudad.
          </h1>
</div>
<div className="lg:col-span-3 flex flex-col justify-end">
<p className="font-body-md text-on-surface-variant pl-space-md border-l-0 bg-surface-container-low p-4 rounded-xl shadow-sm">
            Acceso garantizado a microconciertos en claustros patrimoniales, cenas efímeras y talleres experimentales sin comisiones opacas.
          </p>
</div>
</div>

<div className="w-full bg-surface-container-lowest rounded-2xl shadow-xl p-space-md lg:p-space-lg">
<form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md items-center">

<div className="lg:col-span-3 flex flex-col gap-1 px-space-sm py-1.5 rounded-xl hover:bg-surface-container-low transition-colors">
<span className="font-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
<span className="material-symbols-outlined text-[15px] text-primary">location_city</span>
              Territorio
            </span>
<div className="relative">
<select className="w-full appearance-none bg-transparent font-title-md text-on-surface focus:outline-none cursor-pointer pr-6">
<option value="envigado">Envigado • Centro</option>
<option value="barcelona">Barcelona • Eixample &amp; Gràcia</option>
<option value="lisboa">Lisboa • Chiado &amp; Belém</option>
<option value="valencia">Valencia • Ruzafa &amp; Carmen</option>
</select>
<span className="material-symbols-outlined absolute right-0 top-1 text-[18px] pointer-events-none text-outline">expand_more</span>
</div>
</div>

<div className="lg:col-span-3 flex flex-col gap-1 px-space-sm py-1.5 rounded-xl hover:bg-surface-container-low transition-colors">
<span className="font-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
<span className="material-symbols-outlined text-[15px] text-primary">calendar_today</span>
              Temporalidad
            </span>
<div className="relative">
<select className="w-full appearance-none bg-transparent font-title-md text-on-surface focus:outline-none cursor-pointer pr-6">
<option value="this-weekend">Este fin de semana (Próximas 72h)</option>
<option value="this-week">Esta semana (19 — 25 Mayo)</option>
<option value="next-month">Próximo ciclo mensual</option>
<option value="all">Ver toda la temporada</option>
</select>
<span className="material-symbols-outlined absolute right-0 top-1 text-[18px] pointer-events-none text-outline">expand_more</span>
</div>
</div>

<div className="lg:col-span-2 flex flex-col gap-1 px-space-sm py-1.5 rounded-xl hover:bg-surface-container-low transition-colors">
<span className="font-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
<span className="material-symbols-outlined text-[15px] text-primary">payments</span>
              Aportación
            </span>
<div className="relative">
<select className="w-full appearance-none bg-transparent font-title-md text-on-surface focus:outline-none cursor-pointer pr-6">
<option value="all">Cualquier aporte</option>
<option value="free">Gratuito • Acceso libre</option>
<option value="under-25">Menos de $30.000 COP</option>
<option value="premium">Experiencias VIP / Cena</option>
</select>
<span className="material-symbols-outlined absolute right-0 top-1 text-[18px] pointer-events-none text-outline">expand_more</span>
</div>
</div>

<div className="lg:col-span-2 flex flex-col gap-1 px-space-sm py-1.5 rounded-xl hover:bg-surface-container-low transition-colors">
<span className="font-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
<span className="material-symbols-outlined text-[15px] text-primary">groups</span>
              Formato de Aforo
            </span>
<div className="relative">
<select className="w-full appearance-none bg-transparent font-title-md text-on-surface focus:outline-none cursor-pointer pr-6">
<option value="all">Todas las escalas</option>
<option value="intimate">Micro-aforo (&lt; 40 pers.)</option>
<option value="medium">Salas medias (40 — 150)</option>
<option value="outdoor">Aire libre • Anfiteatro</option>
</select>
<span className="material-symbols-outlined absolute right-0 top-1 text-[18px] pointer-events-none text-outline">expand_more</span>
</div>
</div>

<div className="lg:col-span-2 flex items-center justify-end">
<button className="w-full h-[52px] px-6 rounded-xl bg-primary hover:bg-inverse-surface text-on-primary font-label-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0" type="submit">
<span className="material-symbols-outlined text-[18px]">search</span>
<span >Explorar</span>
</button>
</div>
</form>
</div>
</div>
</section>

<section className="w-full py-space-md">
<div className="max-w-7xl mx-auto px-margin-desktop">
<div className="flex items-center justify-between mb-space-md">
<h2 className="font-title-lg text-primary tracking-tight">Líneas Curadas por Disciplina</h2>
<span className="font-label-sm text-on-surface-variant uppercase tracking-wider">7 Dimensiones Activas</span>
</div>

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-space-sm">

<button className="group flex flex-col p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-2xl shadow-sm text-left transition-all duration-300 hover:-translate-y-1" type="button">
<div className="flex items-center justify-between w-full mb-space-sm">
<span className="w-3 h-3 rounded-full bg-[#F43F5E] shadow-[0_0_8px_rgba(244,63,94,0.4)]"></span>
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">graphic_eq</span>
</div>
<span className="font-title-md text-on-surface group-hover:text-primary">Música</span>
<span className="font-body-sm text-on-surface-variant">Conciertos y acústicos</span>
</button>

<button className="group flex flex-col p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-2xl shadow-sm text-left transition-all duration-300 hover:-translate-y-1" type="button">
<div className="flex items-center justify-between w-full mb-space-sm">
<span className="w-3 h-3 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)]"></span>
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">terminal</span>
</div>
<span className="font-title-md text-on-surface group-hover:text-primary">Tecnología</span>
<span className="font-body-sm text-on-surface-variant">IA, labs &amp; hacks</span>
</button>

<button className="group flex flex-col p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-2xl shadow-sm text-left transition-all duration-300 hover:-translate-y-1" type="button">
<div className="flex items-center justify-between w-full mb-space-sm">
<span className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">nordic_walking</span>
</div>
<span className="font-title-md text-on-surface group-hover:text-primary">Deportivo</span>
<span className="font-body-sm text-on-surface-variant">Rutas y movimiento</span>
</button>

<button className="group flex flex-col p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-2xl shadow-sm text-left transition-all duration-300 hover:-translate-y-1" type="button">
<div className="flex items-center justify-between w-full mb-space-sm">
<span className="w-3 h-3 rounded-full bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.4)]"></span>
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">wine_bar</span>
</div>
<span className="font-title-md text-on-surface group-hover:text-primary">Gastronomía</span>
<span className="font-body-sm text-on-surface-variant">Catas y maridajes</span>
</button>

<button className="group flex flex-col p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-2xl shadow-sm text-left transition-all duration-300 hover:-translate-y-1" type="button">
<div className="flex items-center justify-between w-full mb-space-sm">
<span className="w-3 h-3 rounded-full bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.4)]"></span>
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">auto_stories</span>
</div>
<span className="font-title-md text-on-surface group-hover:text-primary">Educativo</span>
<span className="font-body-sm text-on-surface-variant">Masterclasses &amp; tesis</span>
</button>

<button className="group flex flex-col p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-2xl shadow-sm text-left transition-all duration-300 hover:-translate-y-1" type="button">
<div className="flex items-center justify-between w-full mb-space-sm">
<span className="w-3 h-3 rounded-full bg-[#E06D53] shadow-[0_0_8px_rgba(224,109,83,0.4)]"></span>
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">palette</span>
</div>
<span className="font-title-md text-on-surface group-hover:text-primary">Arte &amp; Cultura</span>
<span className="font-body-sm text-on-surface-variant">Galerías y telar</span>
</button>

<button className="group flex flex-col p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-2xl shadow-sm text-left transition-all duration-300 hover:-translate-y-1" type="button">
<div className="flex items-center justify-between w-full mb-space-sm">
<span className="w-3 h-3 rounded-full bg-[#EAB308] shadow-[0_0_8px_rgba(234,179,8,0.4)]"></span>
<span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">theater_comedy</span>
</div>
<span className="font-title-md text-on-surface group-hover:text-primary">Entretenimiento</span>
<span className="font-body-sm text-on-surface-variant">Festivales y humor</span>
</button>
</div>
</div>
</section>

<section className="w-full py-space-lg">
<div className="max-w-7xl mx-auto px-margin-desktop">
<div className="flex items-center gap-space-sm mb-space-md">
<span className="font-display italic text-headline-sm text-primary">Pieza Principal de Portada</span>
<span className="h-px flex-1 bg-surface-container-highest"></span>
<span className="font-label-sm text-secondary font-bold uppercase tracking-wider">Criterio NEXO #148</span>
</div>

<article className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-surface-container-lowest grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">

<div className="lg:col-span-7 relative min-h-[340px] lg:min-h-full">
<img className="absolute inset-0 w-full h-full object-cover" data-alt="Fotografía cinematográfica nocturna de una orquesta sinfónica contemporánea tocando entre árboles centenarios iluminados con linternas cálidas en el Parque Principal de Envigado. Público elegante sentado en mantas y bancos de madera sobre el césped, niebla suave y ambiente mágico con tonalidades doradas, verde musgo y sombras profundas con estilo editorial clásico." src="https://lh3.googleusercontent.com/aida-public/AB6AXuACGzdszw4wDPZxbUcjb5n8Dke2Y7JC0HHNFBZNp8owTjyE3REn3wmy07NN_nb2e3BT-voPnnc1n0-1edttmxwP8aGlYOn1-PbEXQosQwiBkWsgK5BN5F1QM1CCaAXlUmLs-ytXBe5O0ujVa_ZB3R8hrQfLkACfE0eZfMR3ACtlEP8MzM5c3bjVDRM1ncwIzoIFjvVljGlehQAAI44cDbg1qEWB3OzNqy2qZ2bnSMTQg1SR7PTaNHE" />
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface-container-lowest"></div>

<div className="absolute top-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md">
<span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]"></span>
<span className="font-label-sm uppercase tracking-wider text-on-surface">Música Clásica • Experiencia Estacional</span>
</div>

<div className="absolute bottom-6 left-6 lg:hidden px-4 py-2 rounded-xl bg-surface/90 backdrop-blur-md">
<span className="font-label-sm text-on-surface-variant block uppercase">Fecha de Gala</span>
<span className="font-title-md text-on-surface">Sábado, 24 de Mayo • 21:30h</span>
</div>
</div>

<div className="lg:col-span-5 p-space-lg lg:p-space-xl flex flex-col justify-between bg-surface-container-lowest">

<div >
<div className="hidden lg:flex items-center gap-2 text-on-surface-variant font-label-md mb-space-sm uppercase tracking-wider">
<span >Sábado, 24 de Mayo • 21:30h</span>
<span >•</span>
<span >Edición Única</span>
</div>
<h3 className="font-display text-headline-lg text-primary leading-tight mb-space-sm">
              Sinfonía Nocturna al Aire Libre
            </h3>
<p className="font-body-md text-on-surface-variant mb-space-md">
              La Orquesta de Cámara Envigado Reimagined interpreta un repertorio vanguardista entre los árboles del Parque Principal. Iluminación con quinqué sustentable y degustación botánica incluida.
            </p>
<div className="flex items-center gap-2 text-on-surface font-body-sm mb-space-lg">
<span className="material-symbols-outlined text-[18px] text-outline">pin_drop</span>
<span className="font-title-md">Parque Principal de Envigado</span>
<span className="text-outline-variant">—</span>
<a className="text-secondary font-label-md underline underline-offset-4 hover:opacity-80 transition-opacity" href="#">Ver en mapa</a>
</div>
</div>

<div className="p-space-md rounded-2xl bg-surface-container-low shadow-sm">

<div className="mb-space-md">
<div className="flex justify-between items-center mb-1.5 font-label-md">
<span className="text-on-surface font-bold">Aforo Total: 92% vendido</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-label-sm uppercase tracking-wider font-bold">
                  Últimos 16 cupos
                </span>
</div>
<div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
<div className="h-full bg-tertiary-fixed-dim rounded-full transition-all duration-700" style={{width:'92%'}}></div>
</div>
</div>

<div className="flex items-center justify-between gap-space-md pt-space-xs">
<div >
<span className="font-label-sm uppercase tracking-wider text-on-surface-variant block">Entrada Curada</span>
<div className="flex items-baseline gap-1">
<span className="font-display text-headline-sm text-primary font-bold">$55.000</span>
<span className="font-label-sm text-on-surface-variant">COP / pax</span>
</div>
</div>
<button className="h-[52px] px-7 rounded-xl bg-primary hover:bg-inverse-surface text-on-primary font-label-lg uppercase tracking-wider shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2" type="button">
<span >ASEGURAR MI LUGAR</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
</div>
</article>
</div>
</section>

<section className="w-full py-space-xl">
<div className="max-w-7xl mx-auto px-margin-desktop">

<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-xl">
<div >
<span className="font-label-sm uppercase tracking-widest text-on-surface-variant block mb-1">Catálogo Seleccionado</span>
<h2 className="font-display text-headline-lg text-primary">Veladas Próximas Recomendadas</h2>
</div>
<div className="flex items-center gap-space-sm">
<button className="px-3.5 py-2 rounded-xl bg-surface-container font-label-md text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5" type="button">
<span className="material-symbols-outlined text-[16px]">tune</span>
<span >Refinar Catálogo</span>
</button>
<div className="flex items-center bg-surface-container-low rounded-xl p-1">
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shadow-xs" type="button">
<span className="material-symbols-outlined text-[18px]">grid_view</span>
</button>
<button className="w-8 h-8 rounded-lg text-on-surface-variant hover:text-on-surface flex items-center justify-center" type="button">
<span className="material-symbols-outlined text-[18px]">view_agenda</span>
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">

<article className="group flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

<div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-highest mb-space-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Mesa rústica de madera de roble iluminada por la luz dorada de la tarde, con copas de vino natural de cristal fino, platos de cerámica artesanal con infusiones botánicas y hierbas silvestres en una casona patrimonial de Envigado." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxSBvJYMTFUNS52z91Nyh2UOckKTaJdBKmwmzzjB8oN803pojEBxx4AJzvDorrOnL5Mry8m28mgxUCljDFszPtbYV6CiHBPePNNxHcUT_FZoWtmO2xKqwSIbisuhXLWnTPsN3NxA6s_M-ZC5ST7zAScR5sNw7-2PvDBtlAvipWxu0J2l7Y4zs43-j5mbjFoVPg3Zgwk5-4p4AFdt_atG2zIGlqaamkeRaymnZn57lfS3p1W1NLTVE" />
<div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
<span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
<span className="font-label-sm uppercase tracking-wider text-on-surface">Gastronomía</span>
</div>
<div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-inverse-surface/80 text-inverse-on-surface font-label-sm backdrop-blur-sm">
              Quedan 6 plazas
            </div>
</div>

<div className="flex items-center gap-2 text-on-surface-variant font-label-md mb-1.5">
<span className="material-symbols-outlined text-[14px]">event</span>
<span >Jueves, 22 Mayo • 19:00</span>
</div>
<h3 className="font-display text-headline-sm text-primary mb-space-xs group-hover:text-secondary transition-colors line-clamp-1">
            Cata Sensorial &amp; Maridaje Botánico
          </h3>
<p className="font-body-sm text-on-surface-variant mb-space-md line-clamp-2">
            Cinco tiempos de maridaje con destilados herbales de autor y quesos de pastoreo en el invernadero de Chamberí.
          </p>
<div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm mb-space-md">
<span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
<span className="truncate">Espacio Flora, Calle Serrano 44</span>
</div>

<div className="mt-auto pt-space-sm border-t-0 bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
<div >
<span className="font-label-sm text-on-surface-variant uppercase block">Por Cubierto</span>
<span className="font-title-lg text-primary font-bold">$45.000 <span className="font-label-sm font-normal text-on-surface-variant">COP</span></span>
</div>
<button className="h-10 px-4 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-label-md uppercase tracking-wider transition-colors flex items-center gap-1" type="button">
<span >Reservar</span>
</button>
</div>
</article>

<article className="group flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

<div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-highest mb-space-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Estudio de diseño industrial moderno y diáfano con pantallas de visualización de datos, maquetas arquitectónicas y programadores trabajando en prototipos con interfaces generativas en una sala de la Institución Universitaria de Envigado con iluminación tenue azul y ámbar." src="https://lh3.googleusercontent.com/aida-public/AB6AXuATg9LtKdVh2jESoHG-uobBvweVoH3uQWLFFCMBZT6BhjVY6PRl8z1h5_thriOyP0Zse6Og9he93K5U15KrJCT-glpjuv5o1amm-e5-Bd8Xs-dsHPfyNfYxLcei5owNEH5afrEy8kdRqQ9935UZGeM-mIM0EFs3RXL84laPCpkvflpsI9p2eJnwrbnlqanWpUIIAmO0pkQer90PjHbGKFlW4VBe6uvdTsBXCHPZh-10y376ylwGkwo" />
<div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
<span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
<span className="font-label-sm uppercase tracking-wider text-on-surface">Tecnología &amp; IA</span>
</div>
<div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-inverse-surface/80 text-inverse-on-surface font-label-sm backdrop-blur-sm">
              Aforo libre limitado
            </div>
</div>

<div className="flex items-center gap-2 text-on-surface-variant font-label-md mb-1.5">
<span className="material-symbols-outlined text-[14px]">event</span>
<span >Viernes, 23 Mayo • 10:00</span>
</div>
<h3 className="font-display text-headline-sm text-primary mb-space-xs group-hover:text-secondary transition-colors line-clamp-1">
            Hackathon Creativo de IA &amp; Diseño
          </h3>
<p className="font-body-sm text-on-surface-variant mb-space-md line-clamp-2">
            24 horas construyendo modelos estéticos y sonoros de código abierto. Mentorías con creadores de Figma y Runway.
          </p>
<div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm mb-space-md">
<span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
<span className="truncate">Nave Creativa 16, Legazpi</span>
</div>

<div className="mt-auto pt-space-sm border-t-0 bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
<div >
<span className="font-label-sm text-on-surface-variant uppercase block">Inscripción</span>
<span className="font-title-lg text-secondary font-bold">$0 <span className="font-label-sm font-normal text-on-surface-variant">Gratis</span></span>
</div>
<button className="h-10 px-4 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-label-md uppercase tracking-wider transition-colors flex items-center gap-1" type="button">
<span >Registrar</span>
</button>
</div>
</article>

<article className="group flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

<div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-highest mb-space-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Detalle de gran plano de telares tradicionales andinos y piezas de arte textil contemporáneo colgadas con elegancia en una galería de arte con paredes de cal blanca y suelos de barro cocido, luz cenital natural y texturas vibrantes en tintes naturales ocre y terracota." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4rdwo2LaiWnKdPwjqOwbgNn_ScVDyOQdBVzGkXDbiPym3Vo0jvLPSSV63b8y4G4OnfqlcZFf-z1u4Xpmw51w8LmqXYv737VjYv6hp3bxtxO-1I_RtFlb-JA_oddGYFg_q_QZcAz-dkVtHDT8dmWGAGiDskVB3HQ1v1U6ns--gaianIukRY98AUkqIXKv30-UlYX5TBARb-Ls3UDHlkVoS-oZpxs-7wZmSfR44bXWl-oZuvTbnBjs" />
<div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
<span className="w-2 h-2 rounded-full bg-[#E06D53]"></span>
<span className="font-label-sm uppercase tracking-wider text-on-surface">Arte &amp; Cultura</span>
</div>
<div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-inverse-surface/80 text-inverse-on-surface font-label-sm backdrop-blur-sm">
              Visitas guiadas
            </div>
</div>

<div className="flex items-center gap-2 text-on-surface-variant font-label-md mb-1.5">
<span className="material-symbols-outlined text-[14px]">event</span>
<span >Sábado, 24 Mayo • 17:30</span>
</div>
<h3 className="font-display text-headline-sm text-primary mb-space-xs group-hover:text-secondary transition-colors line-clamp-1">
            Muestra Textil: Telar Vivo
          </h3>
<p className="font-body-sm text-on-surface-variant mb-space-md line-clamp-2">
            Exposición inmersiva de fibras naturales hiladas a mano y conversatorio íntimo con artesanas de los Andes peruanos.
          </p>
<div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm mb-space-md">
<span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
<span className="truncate">Galería Alabastro, Malasaña</span>
</div>

<div className="mt-auto pt-space-sm border-t-0 bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
<div >
<span className="font-label-sm text-on-surface-variant uppercase block">Pase General</span>
<span className="font-title-lg text-primary font-bold">$15.000 <span className="font-label-sm font-normal text-on-surface-variant">COP</span></span>
</div>
<button className="h-10 px-4 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-label-md uppercase tracking-wider transition-colors flex items-center gap-1" type="button">
<span >Reservar</span>
</button>
</div>
</article>

<article className="group flex flex-col bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

<div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-highest mb-space-md">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Trío de jazz con contrabajo y saxofón actuando en el centro de un claustro gótico del siglo XIV iluminado con hileras de velas bajas, arcos ojivales de piedra reflejados en un estanque central y público disfrutando en un silencio reverencial bajo las estrellas." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxNVoOCSCsN5aH5OUocGo8iaqAPG_jcI8sfJj3KIX_CvIoZS5FtUdIfbZJyYswiPPlONAcJrV7yHCJYe5qZXmX-uYcbY0Vg8vE8j8ojiF6vU5K0VUTtv1a4glJRHP9FkbOA4XJbYSNIF2TDimz56hIn3e_fTKfMcrYxg7RhHHvo8JWrh4mwHBHwkQYeOw4qdijdznV6uQ9o2NLZxSrgsn1z1vNsuzjxUFxcaEqMw0ZegCjszt4yb8" />
<div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
<span className="w-2 h-2 rounded-full bg-[#F43F5E]"></span>
<span className="font-label-sm uppercase tracking-wider text-on-surface">Música • Poesía</span>
</div>
<div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] font-label-sm font-bold backdrop-blur-sm">
              Últimos 4 cupos
            </div>
</div>

<div className="flex items-center gap-2 text-on-surface-variant font-label-md mb-1.5">
<span className="material-symbols-outlined text-[14px]">event</span>
<span >Domingo, 25 Mayo • 20:30</span>
</div>
<h3 className="font-display text-headline-sm text-primary mb-space-xs group-hover:text-secondary transition-colors line-clamp-1">
            Jazz &amp; Poesía en el Patio
          </h3>
<p className="font-body-sm text-on-surface-variant mb-space-md line-clamp-2">
            Sesión acústica a trío sin amplificación artificial intercalada con recital de lírica contemporánea y copa de bienvenida.
          </p>
<div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm mb-space-md">
<span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
<span className="truncate">Claustro de San Jerónimo, Letras</span>
</div>

<div className="mt-auto pt-space-sm border-t-0 bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
<div >
<span className="font-label-sm text-on-surface-variant uppercase block">Entrada Íntima</span>
<span className="font-title-lg text-primary font-bold">$40.000 <span className="font-label-sm font-normal text-on-surface-variant">COP</span></span>
</div>
<button className="h-10 px-4 rounded-lg bg-primary hover:bg-inverse-surface text-on-primary font-label-md uppercase tracking-wider transition-colors flex items-center gap-1" type="button">
<span >Reservar</span>
</button>
</div>
</article>
</div>
</div>
</section>

<section className="w-full py-space-xl">
<div className="max-w-7xl mx-auto px-margin-desktop">
<div className="relative w-full rounded-2xl overflow-hidden bg-primary text-on-primary p-space-lg lg:p-space-xl shadow-2xl">

<svg className="absolute -right-20 -bottom-20 w-[480px] h-[480px] opacity-10 pointer-events-none text-surface" fill="none" stroke="currentColor" viewBox="0 0 100 100">
<circle cx="50" cy="50" r="45" stroke-dasharray="2 2" strokeWidth="0.5"></circle>
<circle cx="50" cy="50" r="35" strokeWidth="0.5"></circle>
<circle cx="50" cy="50" r="25" strokeWidth="0.75"></circle>
<circle cx="50" cy="50" r="15" stroke-dasharray="1 1" strokeWidth="0.5"></circle>
<path d="M10 50 Q 50 10 90 50 T 10 50" strokeWidth="0.5"></path>
<path d="M50 10 Q 90 50 50 90 T 50 10" strokeWidth="0.5"></path>
</svg>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center relative z-10">
<div className="lg:col-span-8 flex flex-col gap-space-sm">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-inverse-surface text-inverse-on-surface w-fit">
<span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
<span className="font-label-sm uppercase tracking-wider">Geolocalización Inmersiva Activa</span>
</div>
<h2 className="font-display text-headline-lg lg:text-display text-surface-container-lowest leading-tight">
              ¿Prefieres buscar por proximidad espacial en tu barrio?
            </h2>
<p className="font-body-lg text-primary-fixed-dim max-w-2xl">
              Nuestra cartografía editorial reúne más de 120 rincones culturales independientes, azoteas secretas, talleres de grabado y micro-teatros filtrados por distancia pedestre y disponibilidad inmediata.
            </p>

<div className="flex flex-wrap items-center gap-space-md pt-space-xs text-primary-fixed font-label-md">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">verified</span>
<span >Validado por curadores locales</span>
</div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">lock_clock</span>
<span >Reserva garantizada sin sobreprecio</span>
</div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">qr_code</span>
<span >Acceso directo con código dinámico</span>
</div>
</div>
</div>

<div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
<a className="w-full sm:w-auto h-[56px] px-8 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-label-lg uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-3 group hover:scale-[1.02]" data-path="mapa-cultural" href="#">
<span className="material-symbols-outlined text-secondary text-[22px] group-hover:rotate-12 transition-transform">map</span>
<span >Abrir Mapa Cultural Interactivo</span>
</a>
<span className="font-label-sm text-outline-variant mt-2 text-right">Actualizado en tiempo real hace 4 minutos</span>
</div>
</div>
</div>
</div>
</section>
</div></div>);
}
