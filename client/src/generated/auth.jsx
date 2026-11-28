import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api, LANDING } from '../api.js'; import { useAuth } from '../main.jsx';
const NOTICES = { asistente: 'Cartelera personalizada, accesos de sala y reservas privadas.', organizador: 'Panel de aforos, ticketing cultural, taquilla y liquidaciones.', curador: 'Revisión editorial de propuestas, dictamen de cartelera y archivo.' };
export function Login() {
  const { user, login } = useAuth(), nav = useNavigate(), loc = useLocation(), [f, setF] = useState({ email: '', password: '', role: 'asistente' }), [err, setErr] = useState(''), [show, setShow] = useState(false);
  if (user?.role === 'asistente') return <Navigate to={loc.state?.from || '/'} replace />;
  const submit = async e => { e.preventDefault(); try { const d = await api('/auth/login', { method: 'POST', body: f }); login(d); d.user.role === 'asistente' ? nav(loc.state?.from || '/') : location.assign(LANDING[d.user.role] || '/'); } catch (x) { setErr(x.message); } };
  return (<main className="w-full min-h-screen bg-background flex flex-col justify-center items-center py-space-xl px-margin-tablet"><div className="flex flex-col w-full items-center justify-center py-6 sm:py-10">

<div className="relative w-full max-w-xl px-4 sm:px-0">
<div className="absolute -top-16 -left-12 w-64 h-64 bg-surface-container-high rounded-full blur-3xl opacity-50 pointer-events-none"></div>
<div className="absolute -bottom-12 -right-8 w-72 h-72 bg-surface-variant rounded-full blur-3xl opacity-40 pointer-events-none"></div>

<div className="relative bg-surface-container-lowest rounded-2xl shadow-xl p-8 sm:p-12 overflow-hidden">

<div className="flex flex-col items-center text-center space-y-3 pb-8">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">Acceso al Ecosistema • NEXO Cultural</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-2">
          Iniciar Sesión
        </h1>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
          Accede a tus reservas, carteleras curatoriales y módulos de gestión independiente.
        </p>
</div>

<div className="mb-8">
<div className="grid grid-cols-3 gap-1 p-1 bg-surface-container-low rounded-xl" id="roleSelector" role="tablist">
<button aria-selected={f.role === "asistente"} className={`role-tab flex flex-col items-center justify-center py-2.5 px-2 rounded-lg font-label-md text-label-md transition-all duration-200 ${f.role === "asistente" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`} onClick={() => setF({ ...f, role: "asistente" })} data-role="asistente" role="tab" type="button">
<span className="material-symbols-outlined text-[18px] mb-1">person</span>
<span className="truncate w-full text-center">Asistente</span>
</button>
<button aria-selected={f.role === "organizador"} className={`role-tab flex flex-col items-center justify-center py-2.5 px-2 rounded-lg font-label-md text-label-md transition-all duration-200 text-on-surface-variant hover: ${f.role === "organizador" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`} onClick={() => setF({ ...f, role: "organizador" })} data-role="organizador" role="tab" type="button">
<span className="material-symbols-outlined text-[18px] mb-1">groups</span>
<span className="truncate w-full text-center">Organizador</span>
</button>
<button aria-selected={f.role === "curador"} className={`role-tab flex flex-col items-center justify-center py-2.5 px-2 rounded-lg font-label-md text-label-md transition-all duration-200 text-on-surface-variant hover: ${f.role === "curador" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`} onClick={() => setF({ ...f, role: "curador" })} data-role="curador" role="tab" type="button">
<span className="material-symbols-outlined text-[18px] mb-1">verified</span>
<span className="truncate w-full text-center">Curaduría</span>
</button>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-2.5 italic" id="roleNotice">{NOTICES[f.role]}</p>
</div>

<form onSubmit={submit} className="space-y-5">

<div className="space-y-1.5">
<label className="block font-label-md text-label-md uppercase tracking-wider text-on-surface" htmlFor="email">
            Correo electrónico
          </label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant pointer-events-none text-[20px]">
              alternate_email
            </span>
<input className="w-full h-12 pl-11 pr-4 bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md rounded-xl transition duration-200 focus:outline-none focus:bg-surface-container-lowest focus:shadow-md" id="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} name="email" placeholder="nombre@ejemplo.com" required type="email" />
</div>
</div>

<div className="space-y-1.5">
<div className="flex items-center justify-between">
<label className="block font-label-md text-label-md uppercase tracking-wider text-on-surface" htmlFor="password">
              Contraseña
            </label>
<a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary underline transition" href="#">
              ¿Olvidé mi contraseña?
            </a>
</div>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant pointer-events-none text-[20px]">
              lock
            </span>
<input className="w-full h-12 pl-11 pr-11 bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md rounded-xl transition duration-200 focus:outline-none focus:bg-surface-container-lowest focus:shadow-md" id="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} name="password" placeholder="••••••••••••" required type={show ? 'text' : 'password'} />
<button aria-label="Mostrar contraseña" className="absolute right-3 text-on-surface-variant hover:text-primary p-1 rounded-md transition flex items-center justify-center" id="togglePasswordBtn" onClick={() => setShow(!show)} type="button">
<span className="material-symbols-outlined text-[20px]" id="toggleEyeIcon">{show ? 'visibility_off' : 'visibility'}</span>
</button>
</div>
</div>

<div className="flex items-center justify-between pt-1">
<label className="flex items-center gap-2.5 cursor-pointer select-none">
<input className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary" id="rememberMe" type="checkbox" />
<span className="font-body-sm text-body-sm text-on-surface-variant">Recordar sesión en este equipo</span>
</label>
</div>

{err && <p className="text-error text-sm">{err}</p>}<button className="w-full h-13 py-3.5 px-6 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg tracking-wide flex items-center justify-center gap-2 shadow-md hover:bg-neutral-800 active:scale-[0.99] transition duration-200 mt-2" type="submit">
<span >INGRESAR A MI CUENTA</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</form>

<div className="relative flex py-6 items-center">
<div className="flex-grow h-px bg-surface-variant"></div>
<span className="flex-shrink mx-4 font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest px-2">
          o continúa con
        </span>
<div className="flex-grow h-px bg-surface-variant"></div>
</div>

<div className="grid grid-cols-2 gap-3">

<button className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition duration-200 font-label-md text-label-md" type="button">
<svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
<path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.71-11.65-14-4.89-7.5-8.86-16.12-11.91-25.86-3.05-9.74-4.58-19.12-4.58-28.14 0-13.48 3.51-24.62 10.53-33.42 7.02-8.8 15.75-13.3 26.2-13.5 4.8 0 10.02 1.25 15.67 3.75 5.64 2.5 9.4 3.75 11.28 3.75 1.54 0 5.48-1.3 11.83-3.9 6.35-2.6 11.75-3.75 16.2-3.45 12.18.66 21.72 5.28 28.62 13.87-10.74 6.53-16.01 15.54-15.82 27.03.19 8.98 3.63 16.48 10.33 22.5 6.7 6.02 14.57 9.45 23.6 10.29-2.44 7.39-5.48 14.73-9.13 22.02zM119.22 33.15c0-6.72 2.45-13.16 7.35-19.33 4.9-6.17 10.87-10.42 17.92-12.75.98 7.04-.69 13.72-5.01 20.03-4.32 6.31-10.39 10.55-18.21 12.72-.69-.22-1.37-.44-2.05-.67z"></path>
</svg>
<span >Apple ID</span>
</button>

<button className="flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition duration-200 font-label-md text-label-md" type="button">
<svg className="w-4 h-4" viewBox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
</svg>
<span >Google</span>
</button>
</div>

<div className="mt-8 pt-6 bg-surface-container-low/60 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 p-6 sm:p-8 text-center flex flex-col items-center gap-2">
<p className="font-body-sm text-body-sm text-on-surface-variant">
          ¿Aún no formas parte de la red NEXO?
        </p>
<div className="flex flex-wrap items-center justify-center gap-3 font-label-md text-label-md">
<a className="text-primary hover:underline font-semibold flex items-center gap-1" href="#" onClick={e => { e.preventDefault(); nav("/registro"); }}>
<span >Crear cuenta Asistente</span>
<span className="material-symbols-outlined text-[14px]">north_east</span>
</a>
<span className="text-outline text-xs">•</span>
<a className="text-primary hover:underline font-semibold flex items-center gap-1" href="#">
<span >Registro Colectivo / Espacio</span>
<span className="material-symbols-outlined text-[14px]">north_east</span>
</a>
</div>
</div>
</div>

<div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider px-2 gap-2 opacity-80">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[14px]">lock</span>
<span >Conexión cifrada TLS 256-bit</span>
</div>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[14px]">filter_vintage</span>
<span >Curaduría cultural independiente</span>
</div>
</div>
</div>
</div>
</main>);
}
export function Register() {
  const { login } = useAuth(), nav = useNavigate(), [f, setF] = useState({ name: '', email: '', password: '' }), [err, setErr] = useState(''), [show, setShow] = useState(false);
  const submit = async e => { e.preventDefault(); try { login(await api('/auth/register', { method: 'POST', body: f })); nav('/'); } catch (x) { setErr(x.message); } };
  return (<main className="w-full min-h-screen bg-background flex flex-col justify-center items-center py-space-xl px-margin-tablet"><div className="flex flex-col w-full">
<div className="w-full max-w-xl mx-auto flex flex-col items-center">

<div className="flex items-center gap-space-sm mb-space-lg text-center">
<span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase px-space-md py-space-xs rounded-full bg-surface-container-high/80">
        Membresía Cultural Gratuita • Pase Digital
      </span>
</div>

<div className="w-full bg-surface-container-lowest rounded-xl shadow-xl p-space-lg md:p-space-xl flex flex-col relative overflow-hidden">

<div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none"></div>

<div className="flex flex-col text-center space-y-space-xs mb-space-lg relative z-10">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Crea tu Cuenta de Explorador
        </h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto pt-space-xs">
          Descubre encuentros artísticos únicos, reserva entradas con aforo protegido y acumula puntos de fidelidad curatorial.
        </p>
</div>

<form onSubmit={submit} className="flex flex-col space-y-space-md relative z-10">

<div className="flex flex-col space-y-space-xs text-left">
<label className="font-label-lg text-label-lg text-on-surface" htmlFor="full-name">
            Nombre y Apellidos
          </label>
<div className="relative">
<input className="w-full h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200" id="full-name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} name="name" placeholder="Camila Arismendi" required type="text" />
<span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl">
              person
            </span>
</div>
</div>

<div className="flex flex-col space-y-space-xs text-left">
<label className="font-label-lg text-label-lg text-on-surface" htmlFor="email">
            Correo electrónico
          </label>
<div className="relative">
<input className="w-full h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200" id="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} name="email" placeholder="camila@ejemplo.com" required type="email" />
<span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl">
              alternate_email
            </span>
</div>
</div>

<div className="flex flex-col space-y-space-xs text-left">
<div className="flex justify-between items-center">
<label className="font-label-lg text-label-lg text-on-surface" htmlFor="password">
              Crea una contraseña segura
            </label>
<span className="font-label-sm text-label-sm text-on-surface-variant" id="pwd-strength-label">Mínimo 8 caracteres</span>
</div>
<div className="relative">
<input className="w-full h-12 px-space-md pr-12 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200" id="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} name="password" placeholder="••••••••••••" required type={show ? 'text' : 'password'} />
<button aria-label="Mostrar u ocultar contraseña" className="absolute right-space-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface flex items-center justify-center p-1 focus:outline-none" type="button">
<span className="material-symbols-outlined text-xl" id="eye-icon">visibility</span>
</button>
</div>

<div className="grid grid-cols-4 gap-1.5 pt-1">
<div className="h-1 rounded-full bg-surface-variant transition-colors duration-300" id="meter-1"></div>
<div className="h-1 rounded-full bg-surface-variant transition-colors duration-300" id="meter-2"></div>
<div className="h-1 rounded-full bg-surface-variant transition-colors duration-300" id="meter-3"></div>
<div className="h-1 rounded-full bg-surface-variant transition-colors duration-300" id="meter-4"></div>
</div>
</div>

<div className="flex flex-col space-y-space-xs text-left">
<label className="font-label-lg text-label-lg text-on-surface" htmlFor="city">
            Ciudad de residencia cultural
          </label>
<div className="relative">
<select className="w-full h-12 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none cursor-pointer focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all duration-200" id="city" name="city">
<option value="envigado">Envigado (Comunidad &amp; Centros Vivos)</option>
<option value="barcelona">Barcelona (Distritos de Creación)</option>
<option value="lisboa">Lisboa (Polo Atlántico &amp; Galerías)</option>
</select>
<span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline pointer-events-none text-xl">
              expand_more
            </span>
</div>
</div>

<div className="flex flex-col space-y-space-xs text-left pt-space-xs">
<div className="flex justify-between items-baseline">
<label className="font-label-lg text-label-lg text-on-surface">
              Intereses Curados
            </label>
<span className="font-label-sm text-label-sm text-outline">Selecciona tus afinidades</span>
</div>
<div className="flex flex-wrap gap-2 pt-1" id="interests-container">
<button className="chip-button group px-3.5 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all duration-200 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high" type="button">
<span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">graphic_eq</span>
<span >Música &amp; Conciertos</span>
</button>
<button className="chip-button group px-3.5 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all duration-200 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high" type="button">
<span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">wine_bar</span>
<span >Gastronomía &amp; Vinos</span>
</button>
<button className="chip-button group px-3.5 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all duration-200 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high" type="button">
<span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">palette</span>
<span >Artes Visuales</span>
</button>
<button className="chip-button group px-3.5 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all duration-200 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high" type="button">
<span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">theater_comedy</span>
<span >Teatro &amp; Danza</span>
</button>
<button className="chip-button group px-3.5 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all duration-200 bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high" type="button">
<span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">memory</span>
<span >Tecnología &amp; IA</span>
</button>
</div>
</div>

<div className="flex flex-col space-y-space-sm pt-space-xs text-left">

<label className="flex items-start gap-space-sm cursor-pointer group">
<input className="mt-1 w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary" required type="checkbox" />
<span className="font-body-sm text-body-sm text-on-surface-variant leading-snug select-none">
              Acepto los <a className="text-on-surface underline font-medium hover:text-secondary transition-colors" href="#">Términos de Servicio</a> y la <a className="text-on-surface underline font-medium hover:text-secondary transition-colors" href="#">Política de Privacidad</a> de NEXO.
            </span>
</label>

<label className="flex items-start gap-space-sm cursor-pointer group">
<input defaultChecked className="mt-1 w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary" type="checkbox" />
<span className="font-body-sm text-body-sm text-on-surface-variant leading-snug select-none">
              Deseo recibir la <span className="text-on-surface font-medium">Agenda Curatorial Semanal</span> (cada jueves por la mañana con acceso anticipado a veladas exclusivas).
            </span>
</label>
</div>

<div className="pt-space-sm">
{err && <p className="text-error text-sm">{err}</p>}<button className="w-full h-14 bg-primary text-on-primary font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-space-sm tracking-wider uppercase shadow-md hover:bg-on-surface-variant transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none" type="submit">
<span >Crear cuenta y comenzar a explorar</span>
<span className="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</div>
</form>

<div className="mt-space-lg pt-space-md flex flex-col sm:flex-row items-center justify-between text-center gap-space-xs bg-surface-container-low/60 -mx-space-lg md:-mx-space-xl -mb-space-lg md:-mb-space-xl px-space-lg py-space-md">
<a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
          ¿Ya tienes cuenta en NEXO? <span className="font-title-md text-title-md text-on-surface underline ml-1">Iniciar sesión</span>
</a>
<span className="hidden sm:inline-block text-outline-variant">•</span>
<a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
          ¿Eres artista o colectivo? <span className="font-title-md text-title-md text-on-surface underline ml-1">Registrarte como Organizador</span>
</a>
</div>
</div>

<div className="mt-space-lg text-center flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-outline text-base">verified_user</span>
<p className="font-body-sm text-body-sm text-outline">
        Custodia de datos bajo normativa GDPR • Experiencias con garantía de devolución 100%
      </p>
</div>
</div>
</div>
</main>);
}
