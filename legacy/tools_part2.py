# Búsqueda + Inicio (se ejecuta desde tools_html2jsx.py)
import html as H, json
def inner_main(n):
    m = between(rd(n), '<main', '</main>'); return re.sub(r'^<main[^>]*>|</main>$', '', m)
sp = inner_main('resultados_de_b_squeda')
a0 = sp.index('<!-- CARD 1'); a1 = sp.rindex('</article>') + 10
arts = re.findall(r'<article.*?</article>', sp[a0:a1], re.S)
T = lambda a, rx: H.unescape(re.sub(r'\s+', ' ', re.search(rx, a, re.S).group(1)).strip())
meta = [(40.411,-3.691,'2026-11-24T20:30',45,200,184,''),(40.415,-3.707,'2026-11-28T20:30',38,120,82,''),(40.418,-3.708,'2026-12-07T20:00',38,85,38,'https://example.com/entradas'),(40.409,-3.703,'2026-12-21T21:00',40,60,33,''),(40.414,-3.693,'2026-11-25T19:30',35,110,82,''),(40.42,-3.7,'2026-12-12T20:00',30,90,34,'')]
tags = ['Casi completo','Acústica Única','Coro de Cámara','Vanguardia','Coloquio','Patrimonio']
evs = []
for i, a in enumerate(arts):
    la, lo, d, pr, cap, sold, url = meta[i]
    evs.append(dict(id=f'e{i+1}', title=T(a, r'<h3[^>]*>(.*?)</h3>'), cat='Música', tag=tags[i], venue=T(a, r'<span class="truncate">(.*?)</span>'), desc=T(a, r'line-clamp-2[^>]*>(.*?)</p>'), img=re.search(r'src="([^"]+)"', a).group(1), lat=la, lng=lo, date=d, price=pr, cap=cap, sold=sold, payUrl=url))
for j, (t, c, v, la, lo, d, pr, cap, sold) in enumerate([('Cata Sensorial & Maridaje','Gastronomía','Espacio Flora',40.407,-3.71,'2026-11-22T19:00',38,30,24),('Hackathon Creativo','Tecnología','Nave Creativa 16',40.39,-3.69,'2026-11-23T10:00',0,80,40),('Muestra Textil','Arte','Galería Alabastro',40.43,-3.71,'2026-11-24T17:30',12,60,10)]):
    evs.append(dict(id=f'e{7+j}', title=t, cat=c, tag=c, venue=v, desc='', img='', lat=la, lng=lo, date=d, price=pr, cap=cap, sold=sold, payUrl=''))
json.dump(evs, open('server/events.seed.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
si = open('server/index.js', encoding='utf-8').read()
si = re.sub(r"events: \[.*?\],\n  reservations: \[\]", "events: JSON.parse(fs.readFileSync(new URL('./events.seed.json', import.meta.url))),\n  reservations: []", si, flags=re.S)
open('server/index.js', 'w', encoding='utf-8').write(si)
# tarjeta (card 2) como plantilla
t = re.sub(r' data-alt="[^"]*"', '', arts[1]); t = re.sub(r'src="[^"]+"', 'src="@@img@@"', t)
for a, b in [('Música Clásica','@@cat@@'),('Acústica Única','@@tag@@'),('Capilla de los Jesuitas, Madrid Centro','@@venue@@'),('Ensamble Barroco &amp; Velada de Velas','@@title@@'),('Aforo total: 120 cupos','@@capl@@'),('68% reservado','@@sold@@'),('width: 68%','width: @@w@@'),('28 Mayo • 20:30h','@@date@@'),('$38.00 <span','@@price@@ <span'),('Asegurar mi lugar','@@cta@@')]:
    assert a in t, a; t = t.replace(a, b)
t = re.sub(r'(line-clamp-2[^>]*>).*?</p>', r'\1@@desc@@</p>', t, flags=re.S)
card = jsx(t)
for a, b in [('@@cat@@','{e.cat}'),('@@tag@@','{e.tag}'),('@@venue@@','{e.venue}'),('@@title@@','{e.title}'),('@@desc@@','{e.desc}'),('@@capl@@','Aforo total: {e.cap} cupos'),('@@sold@@',"{e.left <= 0 ? 'Agotado' : e.left <= 20 ? `Últimos ${e.left} cupos` : `${pct}% reservado`}"),("'@@w@@'","pct + '%'"),('@@date@@','{fechaCorta(e.date)}'),('@@price@@',"{e.price ? money(e.price) : 'Gratis'}"),('@@cta@@',"{e.payUrl ? 'Ver evento' : 'Asegurar mi lugar'}"),('src="@@img@@"','src={e.img || FALLBACK}'),('</a>','</Link>')]:
    assert a in card, a; card = card.replace(a, b)
card, n = re.subn(r'<a (className="w-full mt-2[^"]*") href="#">', r"<Link \1 to={'/evento/' + e.id}>", card); assert n == 1
# página de búsqueda
x = sp.replace(sp[a0:a1], '@@CARDS@@')
ps = x.index('<!-- Editorial Pagination Rhythm -->'); pe = x.rindex('</div>', ps, x.index('<!-- RIGHT COLUMN')); x = x[:ps] + '@@PAGER@@' + x[pe:]
ps = x.index('<!-- Active Filter Pill'); pe = x.index('</button>', x.index('Limpiar filtros')) + 9; x = x[:ps] + '@@PILLS@@' + x[pe:]
ps = x.index('<!-- Collapsible Secondary'); pe = x.index('<!-- Primary Results Body'); x = x[:ps] + '@@DRAWER@@' + x[pe:]
x = re.sub(r'<p class="font-headline-sm text-headline-sm text-on-surface">.*?</p>', '@@SUMMARY@@', x, 1, re.S)
x = re.sub(r'<div class="relative inline-block">\s*<select.*?</select>.*?</div>', '@@SORT@@', x, 1, re.S)
J = jsx(x)
PILL = 'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md tracking-wider uppercase cursor-pointer hover:bg-neutral-800 transition-all'
SELC = 'bg-surface-container-lowest rounded-lg px-3 py-2 font-body-md outline-none ring-1 ring-outline-variant/50'
LBL = 'font-label-md text-label-md uppercase tracking-wider text-primary font-bold'
PG = 'w-10 h-10 rounded-xl bg-surface-container-high text-on-surface disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center'
rep = {
'@@CARDS@@': "{items.map(e => <Card key={e.id} e={e} />)}{!loading && !items.length && <p className=\"col-span-full py-space-xl text-center text-on-surface-variant\">No hay eventos con esos filtros.</p>}",
'@@PAGER@@': f'<div className="w-full bg-surface-container-low/60 rounded-2xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md mt-space-md"><div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md"><span>Página {{page}} de {{pages}}</span><span className="w-1 h-1 rounded-full bg-outline"></span><span>Mostrando {{items.length}} de {{total}} resultados</span></div><div className="flex items-center gap-2"><button disabled={{page <= 1}} onClick={{() => goPage(page - 1)}} className="{PG}"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button><button disabled={{page >= pages}} onClick={{() => goPage(page + 1)}} aria-label="Siguiente página" className="{PG}"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button></div></div>',
'@@PILLS@@': f'''<div className="flex items-center gap-space-xs overflow-x-auto py-1 scrollbar-none max-w-full">{{p.get('cat') && <div onClick={{() => set('cat', '')}} className="{PILL}"><span>Disciplina: {{p.get('cat')}}</span><span className="material-symbols-outlined text-[14px]">close</span></div>}}{{p.get('maxPrice') && <div onClick={{() => set('maxPrice', '')}} className="{PILL}"><span>{{p.get('maxPrice') === '0' ? 'Gratis' : 'Hasta $' + p.get('maxPrice')}}</span><span className="material-symbols-outlined text-[14px]">close</span></div>}}{{nFilters === 0 && <span className="font-label-md text-label-md text-outline">Sin filtros activos</span>}}<button onClick={{() => {{ setQv(''); setP({{}}); }}}} className="text-outline hover:text-primary font-label-sm text-label-sm uppercase tracking-wider underline underline-offset-4 ml-2" type="button">Limpiar filtros</button></div>''',
'@@DRAWER@@': f'''<div className={{(open ? '' : 'hidden ') + 'w-full bg-surface-container-low px-margin-desktop py-space-lg shadow-inner'}}><div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-space-lg"><label className="flex flex-col gap-2"><span className="{LBL}">Disciplina</span><select className="{SELC}" value={{p.get('cat') || ''}} onChange={{e => set('cat', e.target.value)}}><option value="">Todas</option>{{CATS.map(c => <option key={{c}}>{{c}}</option>)}}</select></label><label className="flex flex-col gap-2"><span className="{LBL}">Precio máximo</span><select className="{SELC}" value={{p.get('maxPrice') || ''}} onChange={{e => set('maxPrice', e.target.value)}}><option value="">Cualquiera</option><option value="0">Gratis</option><option value="20">Hasta $20</option><option value="40">Hasta $40</option></select></label><div></div><div className="flex flex-col justify-end"><button onClick={{() => setOpen(false)}} className="w-full py-2.5 rounded-lg bg-surface-container-highest text-primary font-label-md text-label-md uppercase tracking-widest" type="button">Aplicar y Contraer</button></div></div></div>''',
'@@SUMMARY@@': """<p className="font-headline-sm text-headline-sm text-on-surface">{loading ? 'Buscando…' : <>Se encontraron <span className="font-semibold text-primary">{total} veladas culturales</span>{p.get('q') && <> para <span className="italic font-display text-[24px]">«{p.get('q')}»</span></>}</>}</p>""",
'@@SORT@@': """<div className="relative inline-block"><select value={p.get('sort') || 'fecha'} onChange={e => set('sort', e.target.value)} className="appearance-none bg-surface-container-low font-title-md text-title-md text-primary pl-3 pr-8 py-1.5 rounded-lg cursor-pointer outline-none hover:bg-surface-container"><option value="fecha">Fecha más próxima</option><option value="precio">Precio menor</option></select><span className="material-symbols-outlined text-[18px] text-outline absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">unfold_more</span></div>""",
}
for k, v in rep.items(): assert k in J, k; J = J.replace(k, v)
def sub1(rx, rp):
    global J; J, n = re.subn(rx, rp, J, 1, re.S); assert n == 1, rx
sub1(r'defaultValue="Música de cámara en recintos históricos"', "value={qv} onChange={e => setQv(e.target.value)} onKeyDown={e => e.key === 'Enter' && set('q', qv)}")
sub1(r'aria-label="Borrar texto"', "aria-label=\"Borrar texto\" onClick={() => { setQv(''); set('q', ''); }}")
sub1(r'(<button className="h-14[^"]*") type="button"', r'\1 onClick={() => setOpen(!open)} type="button"')
sub1(r'>4</span>', '>{nFilters}</span>'); sub1(r'8 Ubicaciones', '{total} Ubicaciones')
sub1(r'<button className="[^"]*" id="grid-view-btn"', "<button onClick={() => setList(false)} className={'p-1.5 rounded transition-all flex items-center ' + (!list ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant')} id=\"grid-view-btn\"")
sub1(r'<button className="[^"]*" id="list-view-btn"', "<button onClick={() => setList(true)} className={'p-1.5 rounded transition-all flex items-center ' + (list ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant')} id=\"list-view-btn\"")
sub1(r'className="grid grid-cols-1 md:grid-cols-2 gap-space-lg" id="results-grid-container"', "className={'grid grid-cols-1 gap-space-lg ' + (list ? '' : 'md:grid-cols-2')} id=\"results-grid-container\"")
HOME = jsx(inner_main('inicio_explorar_eventos'))
open(f'{G}/pages.jsx', 'w', encoding='utf-8').write('''import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, money } from '../api.js';
const CATS = ['Música', 'Gastronomía', 'Tecnología', 'Arte'], LIM = 6;
const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240'%3E%3Crect width='400' height='240' fill='%23ece8e1'/%3E%3C/svg%3E";
const fechaCorta = d => { const x = new Date(d); return x.toLocaleDateString('es-ES', { day: '2-digit', month: 'long' }) + ' • ' + x.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) + 'h'; };
function Card({ e }) {
  const pct = Math.round(e.sold / e.cap * 100);
  return (''' + card + ''');
}
export function SearchPage() {
  const [p, setP] = useSearchParams(), [data, setData] = useState({ items: [], total: 0 }), [loading, setLoading] = useState(true), [open, setOpen] = useState(false), [list, setList] = useState(false), [qv, setQv] = useState(p.get('q') || '');
  const page = +p.get('page') || 1, { items, total } = data, pages = Math.max(1, Math.ceil(total / LIM)), nFilters = ['q', 'cat', 'maxPrice'].filter(k => p.get(k)).length;
  useEffect(() => { setLoading(true); setQv(p.get('q') || ''); api(`/events?limit=${LIM}&` + p).then(setData).finally(() => setLoading(false)); }, [p.toString()]);
  const set = (k, v) => { const n = new URLSearchParams(p); v ? n.set(k, v) : n.delete(k); n.delete('page'); setP(n); };
  const goPage = n => { const q = new URLSearchParams(p); q.set('page', n); setP(q); window.scrollTo(0, 0); };
  return (<>''' + J + '''</>);
}
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
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
  return (<div onClick={click}>''' + HOME + '''</div>);
}
''')
m = open('client/src/main.jsx', encoding='utf-8').read()
m = m.replace("import { Search, EventDetail, MapPage }", "import { EventDetail, MapPage }")
if "generated/pages.jsx" not in m: m = m.replace("import Layout from './generated/Layout.jsx';", "import Layout from './generated/Layout.jsx'; import { SearchPage, Home } from './generated/pages.jsx';")
m = m.replace('<Route path="/" element={<Search home />} /><Route path="/buscar" element={<Search />} />', '<Route path="/" element={<Home />} /><Route path="/buscar" element={<SearchPage />} />')
open('client/src/main.jsx', 'w', encoding='utf-8').write(m)
print('buscar+inicio generados; eventos:', len(evs))
