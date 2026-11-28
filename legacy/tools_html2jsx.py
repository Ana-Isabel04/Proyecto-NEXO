"""Convierte HTML de Stitch/Tailwind a JSX. Uso: python3 tools_html2jsx.py <carpeta_diseno> (regenera client/src/generated)"""
import re, sys, os
from html.parser import HTMLParser
VOID = {'input','img','br','hr','meta','link','source','path_'}
A = {'class':'className','for':'htmlFor','tabindex':'tabIndex','viewbox':'viewBox','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin','fill-rule':'fillRule','clip-rule':'clipRule','maxlength':'maxLength','autocomplete':'autoComplete','readonly':'readOnly','colspan':'colSpan'}
def style(v):
    o = []
    for d in filter(None, (x.strip() for x in v.split(';'))):
        k, _, val = d.partition(':'); k = re.sub(r'-(\w)', lambda m: m.group(1).upper(), k.strip()); o.append(f'{k}:{val.strip()!r}')
    return '{{' + ','.join(o) + '}}'
class P(HTMLParser):
    def __init__(s): super().__init__(convert_charrefs=False); s.o = []; s.skip = 0
    def handle_starttag(s, t, at):
        if t in ('script', 'style'): s.skip += 1; return
        out = []
        for k, v in at:
            if k.startswith('on') or k in ('xmlns', 'selected'): continue
            if k == 'style': out.append(f'style={style(v)}'); continue
            if k == 'checked': out.append('defaultChecked'); continue
            if k == 'value' and t in ('input', 'textarea'): out.append(f'defaultValue="{v}"'); continue
            k = A.get(k, k)
            out.append(k if v in (None, '') and k in ('required', 'disabled', 'defaultChecked') else (f'{k}={{true}}' if v in (None, '') else f'{k}="{v}"'))
        s.o.append(f'<{t} {" ".join(out)}' + (' />' if t in VOID else '>'))
    def handle_startendtag(s, t, at): s.handle_starttag(t, at); (s.o.append('') if t in VOID else s.o.append(f'</{t}>'))
    def handle_endtag(s, t):
        if t in ('script', 'style'): s.skip -= 1; return
        if t not in VOID: s.o.append(f'</{t}>')
    def handle_data(s, d):
        if not s.skip: s.o.append(d.replace('{', '{"{"}').replace('}', '{"}"}'))
    def handle_entityref(s, n): s.o.append(f'&{n};')
    def handle_charref(s, n): s.o.append(f'&#{n};')
def jsx(h): p = P(); p.feed(h); return ''.join(p.o)
def between(s, a, b): i = s.index(a); return s[i:s.index(b, i) + len(b)]
D = sys.argv[1]; G = 'client/src/generated'; os.makedirs(G, exist_ok=True)
rd = lambda n: open(f'{D}/{n}_desktop/code.html', encoding='utf-8').read()
# ---- head (fuentes + Tailwind + config) -> client/index.html
r = rd('realizar_reserva'); head = r[:r.index('</head>')]
keep = re.findall(r'<link[^>]*>', head) + re.findall(r'<script src="https://cdn\.tailwindcss\.com[^>]*></script>', head) + re.findall(r'<script[^>]*>\s*tailwind\.config.*?</script>', head, re.S) + re.findall(r'<style>.*?</style>', head, re.S)
ix = open('client/index.html', encoding='utf-8').read()
ix = re.sub(r'<!--NEXO-HEAD-->.*?<!--/NEXO-HEAD-->', '', ix, flags=re.S).replace('</head>', '<!--NEXO-HEAD-->' + '\n'.join(keep) + '<!--/NEXO-HEAD--></head>').replace('<body>', '<body class="bg-surface font-body-md text-body-md text-on-surface antialiased">')
open('client/index.html', 'w', encoding='utf-8').write(ix)
# ---- Layout: header + footer reales
hd = jsx(between(r, '<header', '</header>')); ft = jsx(between(r, '<footer', '</footer>'))
open(f'{G}/Layout.jsx', 'w', encoding='utf-8').write('''import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../main.jsx';
const ROUTES = { 'explorar-eventos': '/', 'resultados-de-busqueda': '/buscar', 'mapa-cultural': '/mapa', 'mis-reservas': '/mis-reservas' };
export default function Layout({ children }) {
  const nav = useNavigate(), loc = useLocation(), { user, logout } = useAuth(), bare = ['/login', '/registro'].includes(loc.pathname), wide = ['/', '/buscar'].includes(loc.pathname) || /^\/(reservar|confirmacion)\//.test(loc.pathname);
  const click = e => { const a = e.target.closest('a[data-path]'); if (a) { e.preventDefault(); nav(ROUTES[a.dataset.path] || '/'); } };
  const key = e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.closest('header') && e.target.value.trim()) nav('/buscar?q=' + encodeURIComponent(e.target.value.trim())); };
  return <div onClick={click} onKeyDown={key}>
    {!bare && HEADER}
    {bare ? children : <div className="pt-20">{wide ? children : <main className="old">{children}</main>}</div>}
    {!bare && FOOTER}
    <div className="fixed bottom-4 right-4 z-50 rounded-full bg-white px-4 py-2 text-sm shadow-lg">{user ? <>{user.name} · <a href="#" onClick={e => { e.preventDefault(); logout(); nav('/'); }}>Salir</a></> : <a href="#" onClick={e => { e.preventDefault(); nav('/login'); }}>Iniciar sesión</a>}</div>
  </div>;
}
const HEADER = (''' + hd + ''');
const FOOTER = (''' + ft + ''');
''')
# ---- Login
SEL = 'bg-surface-container-lowest text-primary shadow-sm'; UNSEL = 'text-on-surface-variant hover:text-primary'
l = jsx(between(rd('inicio_de_sesi_n_multi_rol'), '<main', '</main>'))
l = l.replace('<form ', '<form onSubmit={submit} ', 1)
l = l.replace('id="email"', 'id="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })}').replace('id="password"', 'id="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })}')
l = l.replace('type="password"', "type={show ? 'text' : 'password'}", 1).replace('id="togglePasswordBtn"', 'id="togglePasswordBtn" onClick={() => setShow(!show)}').replace('>visibility<', ">{show ? 'visibility_off' : 'visibility'}<")
l = re.sub(r'<button aria-selected="(?:true|false)" className="([^"]*)" data-role="(\w+)"', lambda m: f'<button aria-selected={{f.role === "{m.group(2)}"}} className={{`{re.sub(SEL.replace(" ", "|"), "", m.group(1)).strip()} ${{f.role === "{m.group(2)}" ? "{SEL}" : "{UNSEL}"}}`}} onClick={{() => setF({{ ...f, role: "{m.group(2)}" }})}} data-role="{m.group(2)}"', l)
l = re.sub(r'(id="roleNotice"[^>]*>)[^<]*<', r'\1{NOTICES[f.role]}<', l)
l = re.sub(r'(<button[^>]*type="submit")', r'{err && <p className="text-error text-sm">{err}</p>}\1', l, 1)
l = re.sub(r'href="#">(\s*<span >Crear cuenta)', r'href="#" onClick={e => { e.preventDefault(); nav("/registro"); }}>\1', l)
# ---- Registro
g = jsx(between(rd('crear_cuenta_usuario'), '<main', '</main>')).replace('<form ', '<form onSubmit={submit} ', 1)
for k, i in (('name', 'full-name'), ('email', 'email'), ('password', 'password')): g = g.replace(f'id="{i}"', f'id="{i}" value={{f.{k}}} onChange={{e => setF({{ ...f, {k}: e.target.value }})}}', 1)
g = g.replace('type="password"', "type={show ? 'text' : 'password'}", 1)
g = re.sub(r'(<button[^>]*type="submit")', r'{err && <p className="text-error text-sm">{err}</p>}\1', g, 1)
open(f'{G}/auth.jsx', 'w', encoding='utf-8').write('''import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js'; import { useAuth } from '../main.jsx';
const NOTICES = { asistente: 'Cartelera personalizada, accesos de sala y reservas privadas.', organizador: 'Panel de aforos, ticketing cultural, taquilla y liquidaciones.', curador: 'Revisión editorial de propuestas, dictamen de cartelera y archivo.' };
export function Login() {
  const { user, login } = useAuth(), nav = useNavigate(), loc = useLocation(), [f, setF] = useState({ email: '', password: '', role: 'asistente' }), [err, setErr] = useState(''), [show, setShow] = useState(false);
  if (user?.role === 'asistente') return <Navigate to={loc.state?.from || '/'} replace />;
  const submit = async e => { e.preventDefault(); try { const d = await api('/auth/login', { method: 'POST', body: f }); login(d); nav(d.user.role === 'asistente' ? loc.state?.from || '/' : '/denegado'); } catch (x) { setErr(x.message); } };
  return (''' + l + ''');
}
export function Register() {
  const { login } = useAuth(), nav = useNavigate(), [f, setF] = useState({ name: '', email: '', password: '' }), [err, setErr] = useState(''), [show, setShow] = useState(false);
  const submit = async e => { e.preventDefault(); try { login(await api('/auth/register', { method: 'POST', body: f })); nav('/'); } catch (x) { setErr(x.message); } };
  return (''' + g + ''');
}
''')
print('generado:', os.listdir(G))

exec(open('tools_part2.py', encoding='utf-8').read())
exec(open('tools_part3.py', encoding='utf-8').read())
