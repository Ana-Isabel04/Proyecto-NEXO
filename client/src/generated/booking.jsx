import React, { useEffect, useState } from 'react';
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
  return (<><div className="flex flex-col w-full">
<div className="max-w-[1440px] w-full mx-auto px-margin-desktop py-space-lg">

<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
<div className="flex items-center gap-space-sm text-body-sm font-body-sm text-on-surface-variant">
<a className="hover:text-primary transition-colors flex items-center gap-1" data-path="explorar-eventos" href="#">
<span className="material-symbols-outlined text-[16px]">arrow_back</span>
<span >Eventos</span>
</a>
<span className="text-outline-variant">/</span>
<span className="text-on-surface font-label-md uppercase tracking-wider">Paso 1 de 2: Selección de Localidades y Reserva</span>
</div>

<div className="inline-flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container-high shadow-sm">
<span className="material-symbols-outlined text-[18px] text-error animate-pulse">timer</span>
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tiempo restante:</span>
<span className="font-title-md text-title-md font-bold text-on-surface tracking-tight" id="reservation-timer">{timer}</span>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">

<div className="lg:col-span-8 flex flex-col gap-space-xl">

<div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<div className="relative w-full h-64 md:h-72 bg-surface-container">
<img className="w-full h-full object-cover" src={e.img || FALLBACK} />
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent"></div>
<div className="absolute top-space-md left-space-md flex items-center gap-space-xs">
<span className="px-space-sm py-1 rounded-full bg-[#FFF1F2] text-[#F43F5E] font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Música / Concierto
              </span>
<span className="px-space-sm py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm uppercase tracking-wider">
                Temporada Estival
              </span>
</div>
<div className="absolute bottom-space-md left-space-md right-space-md text-on-primary">
<div className="flex items-center gap-space-xs text-label-sm uppercase tracking-widest text-primary-fixed mb-1">
<span className="material-symbols-outlined text-[14px]">event_seat</span>
<span >{e.cat} • Cupos limitados</span>
</div>
<h1 className="font-headline-lg text-headline-lg font-normal tracking-tight text-on-primary leading-tight">
                {e.title}
              </h1>
</div>
</div>
<div className="p-space-lg grid grid-cols-1 md:grid-cols-3 gap-space-md bg-surface-container-low/40">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
<span className="material-symbols-outlined text-[20px]">calendar_today</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Fecha &amp; Horario</span>
<span className="font-title-md text-title-md text-on-surface">{fmt(e.date)}</span>
</div>
</div>
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
<span className="material-symbols-outlined text-[20px]">nature_people</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Recinto</span>
<span className="font-title-md text-title-md text-on-surface">{e.venue}</span>
</div>
</div>
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
<span className="material-symbols-outlined text-[20px]">verified</span>
</div>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Producción</span>
<span className="font-title-md text-title-md text-on-surface">Filarmónica de Cámara NEXO</span>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface">Tipo de Localidad</span>
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Sector A Privilegiado</span>
</div>
<span className="text-label-sm font-label-sm text-on-tertiary-container bg-tertiary-fixed/30 px-space-sm py-0.5 rounded">
              Cupos limitados por aforo acústico
            </span>
</div>

<div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
<div className="flex flex-col gap-1 max-w-md">
<div className="flex items-center gap-space-xs">
<span className="font-title-lg text-title-lg text-on-surface">Entrada General - Acceso Preferente</span>
<span className="bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">Casi completo</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Incluye butaca numerada en el Sector A acústico, programa de mano de edición limitada y cóctel botánico de bienvenida en la rosaleda histórica.
              </p>
<div className="flex items-center gap-space-sm mt-2 text-label-sm text-on-surface-variant">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[15px] text-primary">local_bar</span>
                  Copa de bienvenida
                </span>
<span >•</span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[15px] text-primary">auto_stories</span>
                  Guía de partituras impresa
                </span>
</div>
</div>

<div className="flex flex-col md:items-end gap-space-sm">
<div className="flex items-baseline gap-1">
<span className="font-headline-md text-headline-md font-medium text-primary">{money(e.price)}</span>
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase">COP / ud</span>
</div>

<div className="inline-flex items-center bg-surface-container-lowest rounded-xl p-1 shadow-sm">
<button className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed" id="btn-decrement" disabled={qty <= 1} onClick={() => setQty(qty - 1)} type="button">
<span className="material-symbols-outlined text-[18px]">remove</span>
</button>
<span className="w-10 text-center font-title-lg text-title-lg text-on-surface" id="ticket-quantity">{qty}</span>
<button className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" id="btn-increment" disabled={qty >= max} onClick={() => setQty(qty + 1)} type="button">
<span className="material-symbols-outlined text-[18px]">add</span>
</button>
</div>
</div>
</div>
<div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant bg-surface-container/50 px-space-md py-2.5 rounded-lg">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">info</span>
<span >Máximo 4 entradas por reserva para garantizar distribución equitativa de butacas.</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface">Datos del Titular</span>
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Emisión digital nominal</span>
</div>
<button className="font-label-sm text-label-sm uppercase tracking-wider text-primary hover:underline flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-[14px]">edit</span>
              Modificar datos
            </button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Nombre Completo</span>
<div className="flex items-center justify-between mt-1">
<span className="font-title-md text-title-md text-on-surface">{user.name}</span>
<span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#DCFCE7] text-[#166534]">
<span className="material-symbols-outlined text-[14px]">check</span>
</span>
</div>
<span className="text-[11px] text-on-surface-variant/80">Identificación cotejada con credencial NEXO</span>
</div>
<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Correo Electrónico de Envío Digital</span>
<div className="flex items-center justify-between mt-1">
<span className="font-title-md text-title-md text-on-surface truncate">{user.email}</span>
<span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#DCFCE7] text-[#166534]">
<span className="material-symbols-outlined text-[14px]">check</span>
</span>
</div>
<span className="text-[11px] text-on-surface-variant/80">Recibirás los e-tickets PDF y pases Wallet al instante</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface">Forma de Pago</span>
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Pasarela de alta seguridad</span>
</div>
<span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[14px]">lock</span>
              Cifrado 256-Bit
            </span>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">

<label className="relative flex items-center p-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all">
<input className="sr-only peer" name="payment-method" type="radio" value="apple-pay" checked={pay === 'apple-pay'} onChange={() => setPay('apple-pay')} />
<div className="w-5 h-5 rounded-full bg-surface-container-highest peer-checked:bg-primary peer-checked:ring-4 peer-checked:ring-primary/20 flex items-center justify-center mr-space-md transition-all">
<span className="w-2 h-2 rounded-full bg-surface-container-lowest peer-checked:bg-on-primary"></span>
</div>
<div className="flex flex-col flex-1">
<div className="flex items-center gap-space-xs">
<span className="font-title-md text-title-md text-on-surface">Apple Pay</span>
<span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface">1-Tap</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Confirmación biométrica rápida y segura</span>
</div>
<span className="material-symbols-outlined text-[24px] text-on-surface">contactless</span>
</label>

<label className="relative flex items-center p-space-md rounded-xl bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all">
<input className="sr-only peer" name="payment-method" type="radio" value="credit-card" checked={pay === 'credit-card'} onChange={() => setPay('credit-card')} />
<div className="w-5 h-5 rounded-full bg-surface-container-highest peer-checked:bg-primary peer-checked:ring-4 peer-checked:ring-primary/20 flex items-center justify-center mr-space-md transition-all">
<span className="w-2 h-2 rounded-full bg-surface-container-lowest peer-checked:bg-on-primary"></span>
</div>
<div className="flex flex-col flex-1">
<div className="flex items-center gap-space-xs">
<span className="font-title-md text-title-md text-on-surface">Tarjeta Guardada</span>
<span className="text-[11px] font-semibold text-on-surface-variant font-mono">•••• 8421</span>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Mastercard • Expira 09/27</span>
</div>
<span className="material-symbols-outlined text-[24px] text-on-surface">credit_card</span>
</label>
</div>

<div className="pt-space-xs flex items-center justify-between text-body-sm">
<button className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface hover:text-primary transition-colors" type="button">
<span className="material-symbols-outlined text-[16px]">add_circle</span>
<span >Añadir otra tarjeta o método de pago alternativo</span>
</button>
<div className="flex items-center gap-space-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">payments</span>
<span className="text-label-sm font-label-sm">Sin comisiones imprevistas</span>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 sticky top-24 flex flex-col gap-space-lg">

<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-sm">
<h2 className="font-headline-sm text-headline-sm font-normal text-on-surface">Resumen de Reserva</h2>
<span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Orden #NX-8842</span>
</div>

<div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
<div className="w-16 h-16 rounded-md bg-cover bg-center shrink-0" data-location="Parque Principal de Envigado, Colombia" style={{backgroundImage:"url('https://lh3.googleusercontent.com/aida-public/AB6AXuBcb8G7V7PYwXAqziDwfweL9VEpRUBmCY_DF5QEyA9E0n-dPh_eNcgYULmSkHL7VbZmMCXT28Qt0At9fmP93hkitoQfAZ2yxu9CtS-aGhhF8qwm9sRaSKCrQ7sOZt0P30mwuOBhXfvJW64aHqn2SR2FnZ3-buTqg1efuJ20Jb2ML2ImS8_zRa_dmidZT0FUTSIbfUiHp_D_qxgVT9Ip2XEPo5qOVzW6qVOlkStZAGe98FG_cZnLjdE')"}}></div>
<div className="flex flex-col min-w-0">
<span className="font-label-md text-label-md text-on-surface truncate">{e.venue}</span>
<span className="font-body-sm text-body-sm text-on-surface-variant truncate">Entrada general</span>
<span className="text-[11px] text-secondary font-semibold">{qty} pase(s) seleccionado(s)</span>
</div>
</div>

<div className="flex flex-col gap-space-sm py-space-sm">
<div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
<span id="label-subtotal">Subtotal ({qty} x {money(e.price)})</span>
<span className="text-on-surface font-medium" id="val-subtotal">{money(sub)} COP</span>
</div>
<div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
<div className="flex items-center gap-1 group relative cursor-help">
<span >Preservación y Curaduría Cultural (5%)</span>
<span className="material-symbols-outlined text-[15px] text-outline">help_outline</span>
</div>
<span className="text-on-surface font-medium" id="val-fee">{money(fee)} COP</span>
</div>
<div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
<span >Impuestos locales (IVA incluido)</span>
<span className="text-on-surface font-medium">$0 COP</span>
</div>
<div className="pt-space-sm mt-space-xs flex items-baseline justify-between bg-surface-container-high/60 p-space-md rounded-lg">
<div className="flex flex-col">
<span className="font-label-lg text-label-lg uppercase tracking-wider text-on-surface">Total a abonar</span>
<span className="text-[11px] text-on-surface-variant">Impuestos y tasas comprendidos</span>
</div>
<div className="flex flex-col items-end">
<span className="font-headline-md text-headline-md font-bold text-primary" id="val-total">{money(total)}</span>
<span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">COP</span>
</div>
</div>
</div>

<button className="w-full bg-primary hover:bg-[#2E2E2E] text-on-primary font-label-lg text-label-lg uppercase tracking-wider py-4 px-6 rounded-xl flex items-center justify-center gap-space-xs transition-all shadow-md active:scale-[0.99]" id="btn-submit-order" disabled={busy || e.left < 1} onClick={doPay} type="button">
<span className="material-symbols-outlined text-[18px]">lock</span>
<span id="btn-text">CONFIRMAR Y PROCEDER AL PAGO ({money(total)} COP)</span>
</button>{err && <p className="text-error text-sm text-center mt-3">{err}</p>}

<div className="flex items-center justify-center gap-space-xs text-label-sm text-label-sm text-on-surface-variant text-center">
<span className="material-symbols-outlined text-[14px] text-[#166534]">verified_user</span>
<span >Transacción encriptada con protocolo TLS 256-bit</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-start gap-space-md">
<div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-[20px]">shield</span>
</div>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Garantía Cultural NEXO</span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Cancelación gratuita y reintegro del 100% de los fondos hasta 48 horas antes del inicio de la presentación. Sin preguntas ni penalizaciones.
            </p>
</div>
</div>

<div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-sm">
<div className="flex items-center justify-between text-body-sm">
<span className="font-label-md text-label-md uppercase tracking-wider text-on-surface">¿Necesitas asistencia?</span>
<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534]">
<span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
              Operador conectado
            </span>
</div>
<p className="text-body-sm text-on-surface-variant">
            Nuestro equipo de conserjería cultural está disponible para resolver dudas sobre accesibilidad, menú o ubicaciones.
          </p>
<a className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:underline" href="#">
<span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
<span >Abrir chat de soporte con curador en vivo</span>
</a>
</div>
</div>
</div>
</div>
</div>
</>);
}
export function Confirmation() {
  const { code } = useParams(), { user } = useAuth(), [r, setR] = useState(null), [err, setErr] = useState('');
  useEffect(() => { api('/reservations/' + code).then(setR).catch(x => setErr(x.message)); }, [code]);
  if (!r) return <p className={'p-space-xl ' + (err ? 'text-error' : '')}>{err || 'Cargando…'}</p>;
  const e = r.event, d = new Date(e.date), doors = new Date(d - 30 * 60000), hm = x => x.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) + ' hs';
  const maps = `https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`, z = x => x.toISOString().replace(/[-:]|\.\d{3}/g, '');
  const ics = () => { const t = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', 'UID:' + r.code + '@nexo', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(d), 'DTEND:' + z(new Date(+d + 2 * 3600000)), 'SUMMARY:' + e.title, 'LOCATION:' + e.venue, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/calendar' })); a.download = r.code + '.ics'; a.click(); };
  return (<><div className="flex flex-col w-full">
<section className="w-full relative overflow-hidden py-space-xl">
<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
<div className="absolute top-96 right-10 w-[420px] h-[420px] bg-surface-container-high/60 rounded-full blur-2xl pointer-events-none -z-10"></div>
<div className="max-w-[1240px] mx-auto px-margin-desktop">
<div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant mb-space-md shadow-sm">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-sm text-label-sm uppercase tracking-widest font-semibold text-on-surface">Transmisión Completada • Comprobante Fiscal Emitido</span>
</div>
<div className="relative w-16 h-16 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center mb-space-md">
<span className="material-symbols-outlined text-secondary text-[34px]">verified</span>
<div className="absolute inset-0 rounded-full bg-secondary/10 animate-ping opacity-75"></div>
</div>
<h1 className="font-display text-display text-primary tracking-tight mb-space-xs">
          ¡Reserva Confirmada!
        </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Hemos enviado los detalles, el recibo digital con sellado temporal y comprobante fiscal a tu correo <strong className="text-on-surface font-semibold">{user.email}</strong>.
        </p>
<div className="flex items-center gap-space-sm mt-space-sm font-label-md text-label-md text-outline">
<span >Identificador de Transacción: <span className="text-on-surface font-mono font-medium">{'TRX-' + r.createdAt.slice(0, 10).replace(/-/g, '') + '-' + r.code.slice(3, 8)}</span></span>
<span >•</span>
<span className="flex items-center gap-1 text-on-surface font-medium">
<span className="material-symbols-outlined text-[15px] text-secondary">lock</span>
            Acceso Cifrado
          </span>
</div>
</div>
<div className="relative max-w-4xl mx-auto bg-surface-container-lowest rounded-[28px] shadow-xl overflow-hidden mb-space-xl">
<div className="relative w-full h-72 md:h-80 overflow-hidden">
<div className="bg-cover bg-center w-full h-full transform scale-105 transition-transform duration-700 hover:scale-100" data-alt="Atmospheric twilight symphonic orchestra performing in a lush botanical garden at dusk with illuminated stage lights, cellos, violins, silhouettes of audience, warm ambient stage glows, cinematic photography, rich deep shadows, fine art editorial" style={{backgroundImage:"url('https://lh3.googleusercontent.com/aida-public/AB6AXuDD7JP81-RKYqPu3W_Gf_Ncg5EnJ6AGZdBS_SY7j9rY51uz7MPBwtzhiLcCbjlT0M6ZzZOvtHXgsWq5aC8i9NQzKRpoDbCwAkfBB6xXUT4bEQBBy0u5HAK8wY6tAlEdp8OJLSg8XFvsCR5ubcQhv7ejn56bLGb__DShY72hCXQ5eE2_k59lmtUWd4FAwimkfnDvOkGFJz01mqFh2slQE384mamt21gxcp51d6mJ1iRh6P0TKXl-Y04')"}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent"></div>
<div className="absolute top-6 left-6 right-6 flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md uppercase tracking-wider font-bold shadow-sm">
                {e.cat}
              </span>
<span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-sm text-label-sm uppercase tracking-widest font-semibold shadow-sm">
                Vol. IV Acústico
              </span>
</div>
<div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Pase Nº</span>
<span className="font-label-md text-label-md text-on-surface font-mono font-bold tracking-wider">#{r.code}</span>
</div>
</div>
<div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-space-md text-on-primary">
<div >
<p className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed mb-1">{e.tag}</p>
<h2 className="font-headline-lg text-headline-lg text-on-primary tracking-tight">{e.title}</h2>
<p className="font-body-md text-body-md text-primary-fixed-dim">{e.venue}</p>
</div>
<div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest/15 backdrop-blur-md">
<span className="material-symbols-outlined text-[20px] text-tertiary-fixed">confirmation_number</span>
<span className="font-label-md text-label-md tracking-wider uppercase font-semibold">{r.qty} Entrada(s)</span>
</div>
</div>
</div>
<div className="p-space-lg md:p-space-xl bg-surface-container-lowest">
<div className="grid grid-cols-2 md:grid-cols-4 gap-space-md md:gap-space-lg mb-space-lg">
<div className="p-4 rounded-2xl bg-surface-container-low flex flex-col justify-between">
<div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-2">
<span className="material-symbols-outlined text-[17px] text-secondary">calendar_today</span>
<span >Fecha</span>
</div>
<div >
<p className="font-title-lg text-title-lg text-on-surface font-semibold">{d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">{'Edición ' + d.getFullYear()}</p>
</div>
</div>
<div className="p-4 rounded-2xl bg-surface-container-low flex flex-col justify-between">
<div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-2">
<span className="material-symbols-outlined text-[17px] text-secondary">schedule</span>
<span >Horario</span>
</div>
<div >
<p className="font-title-lg text-title-lg text-on-surface font-semibold">{hm(d)}</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Puertas: {hm(doors)}</p>
</div>
</div>
<div className="p-4 rounded-2xl bg-surface-container-low flex flex-col justify-between">
<div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-2">
<span className="material-symbols-outlined text-[17px] text-secondary">location_on</span>
<span >Recinto</span>
</div>
<div >
<p className="font-title-lg text-title-lg text-on-surface font-semibold truncate">{e.venue}</p>
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">Envigado, CO</p>
</div>
</div>
<div className="p-4 rounded-2xl bg-surface-container-low flex flex-col justify-between">
<div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-2">
<span className="material-symbols-outlined text-[17px] text-secondary">airline_seat_recline_extra</span>
<span >Ubicación</span>
</div>
<div >
<p className="font-title-lg text-title-lg text-on-surface font-semibold">Entrada general</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Sin asiento asignado</p>
</div>
</div>
</div>
<div className="relative py-4 flex items-center justify-between">
<div className="absolute -left-10 md:-left-12 w-6 h-6 rounded-full bg-surface shadow-inner"></div>
<div className="w-full flex items-center justify-center gap-2 overflow-hidden px-4">
<div className="w-full h-[2px] bg-repeat-x bg-[length:12px_2px] opacity-30" style={{backgroundImage:'linear-gradient(to right, #747878 50%, transparent 50%)'}}></div>
</div>
<div className="absolute -right-10 md:-right-12 w-6 h-6 rounded-full bg-surface shadow-inner"></div>
</div>
<div className="mt-space-md grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
<div className="md:col-span-4 flex flex-col items-center justify-center p-space-md rounded-2xl bg-surface-container-low">
<div className="relative p-3 bg-surface-container-lowest rounded-xl shadow-md flex items-center justify-center">
<svg className="w-44 h-44 text-on-surface" fill="currentColor" viewBox="0 0 160 160">
<path d="M10,10 h40 v40 h-40 z M20,20 v20 h20 v-20 z M25,25 h10 v10 h-10 z"></path>
<path d="M110,10 h40 v40 h-40 z M120,20 v20 h20 v-20 z M125,25 h10 v10 h-10 z"></path>
<path d="M10,110 h40 v40 h-40 z M20,120 v20 h20 v-20 z M25,125 h10 v10 h-10 z"></path>
<rect height="8" width="8" x="60" y="15"></rect>
<rect height="8" width="12" x="75" y="15"></rect>
<rect height="15" width="8" x="95" y="25"></rect>
<rect height="8" width="15" x="65" y="35"></rect>
<rect height="8" width="8" x="15" y="60"></rect>
<rect height="8" width="12" x="35" y="65"></rect>
<rect height="8" width="20" x="20" y="80"></rect>
<rect height="8" width="12" x="115" y="60"></rect>
<rect height="10" width="15" x="135" y="75"></rect>
<rect height="12" width="8" x="110" y="90"></rect>
<rect height="8" width="12" x="130" y="95"></rect>
<rect height="8" width="12" x="60" y="115"></rect>
<rect height="15" width="15" x="80" y="110"></rect>
<rect height="12" width="8" x="100" y="125"></rect>
<rect height="8" width="25" x="120" y="130"></rect>
<rect className="text-surface-container-high" height="40" rx="8" width="40" x="60" y="60"></rect>
<circle className="text-primary" cx="80" cy="80" r="14"></circle>
</svg>
<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
<span className="font-headline-sm text-label-sm tracking-widest font-bold text-on-primary bg-primary px-1.5 py-0.5 rounded shadow">NEXO</span>
</div>
</div>
<span className="font-label-sm text-label-sm text-outline tracking-wider uppercase mt-3">Pase Dinámico Anti-Fraude</span>
</div>
<div className="md:col-span-8 flex flex-col justify-center">
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-[20px] text-secondary">qr_code_scanner</span>
<span className="font-title-md text-title-md text-on-surface font-semibold">Instrucciones de Lectura Digital</span>
</div>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                Presenta este código QR activo directamente desde tu dispositivo o tarjeta de billetera digital al ingresar al recinto. Para agilizar el escaneo en el acceso por <strong className="text-on-surface font-semibold">Torniquete A-3</strong>, te sugerimos ajustar el <strong className="text-on-surface font-semibold">brillo de la pantalla al 100%</strong>.
              </p>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm p-4 rounded-2xl bg-surface-container-low">
<div className="flex items-start gap-2.5">
<span className="material-symbols-outlined text-[18px] text-outline mt-0.5">brightness_high</span>
<div >
<span className="font-label-md text-label-md text-on-surface font-medium block">Contraste Automático</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Válido en modo oscuro o claro sin restricciones.</span>
</div>
</div>
<div className="flex items-start gap-2.5">
<span className="material-symbols-outlined text-[18px] text-outline mt-0.5">badge</span>
<div >
<span className="font-label-md text-label-md text-on-surface font-medium block">Titular Registrado</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">{user.name} (cuenta verificada).</span>
</div>
</div>
</div>
<div className="mt-space-md flex items-center justify-between">
<div className="flex items-center gap-2 text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">autorenew</span>
<span className="font-body-sm text-body-sm">Token refresca en <span className="font-mono font-semibold text-on-surface" id="token-timer">59s</span></span>
</div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Código Seguro SHA-256</span>
</div>
</div>
</div>
</div>
</div>
<div className="max-w-4xl mx-auto mb-space-xl">
<p className="font-label-sm text-label-sm uppercase tracking-widest text-outline text-center mb-space-md font-semibold">
          Almacenamiento y Sincronización Inmediata
        </p>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-md">
<button className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-primary text-on-primary hover:bg-neutral-800 transition-all shadow-md group cursor-pointer" type="button">
<span className="material-symbols-outlined text-[20px] text-on-primary">wallet</span>
<div className="flex flex-col text-left">
<span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider leading-none mb-1">Añadir a</span>
<span className="font-label-lg text-label-lg font-bold leading-tight">Apple / Google Wallet</span>
</div>
</button>
<button className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all shadow-md group cursor-pointer" type="button" onClick={() => window.print()}>
<span className="material-symbols-outlined text-[20px] text-secondary">download</span>
<div className="flex flex-col text-left">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider leading-none mb-1">Descarga Oficial</span>
<span className="font-label-lg text-label-lg font-bold leading-tight">Ticket en PDF HD</span>
</div>
</button>
<button className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all shadow-md group cursor-pointer" type="button" onClick={ics}>
<span className="material-symbols-outlined text-[20px] text-secondary">event_available</span>
<div className="flex flex-col text-left">
<span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider leading-none mb-1">Agendar velada</span>
<span className="font-label-lg text-label-lg font-bold leading-tight">Sincronizar Calendario</span>
</div>
</button>
</div>
<div className="flex flex-col sm:flex-row items-center justify-center gap-space-md pt-space-xs">
<a className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-wider text-on-surface font-semibold hover:text-secondary transition-colors" data-path="mis-reservas" href="#">
<span className="material-symbols-outlined text-[16px]">folder_special</span>
<span >Ver en Mis Reservas</span>
</a>
<span className="hidden sm:inline text-outline">•</span>
<a className="inline-flex items-center gap-2 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors" data-path="explorar-eventos" href="#">
<span >Explorar más veladas culturales</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
</div>
<div className="max-w-4xl mx-auto rounded-[28px] bg-surface-container-low p-space-lg md:p-space-xl shadow-sm mb-space-xl">
<div className="flex items-center justify-between mb-space-lg">
<div >
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">Guía de Llegada &amp; Experiencia</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Cómo llegar y consideraciones del recinto</h3>
</div>
<span className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[15px] text-secondary">park</span>
            Entorno Histórico Protegido
          </span>
</div>
<div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg">
<div className="md:col-span-5 flex flex-col justify-between">
<div className="space-y-space-md">
<div className="flex items-start gap-3">
<div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-sm">
<span className="material-symbols-outlined text-[20px]">directions_walk</span>
</div>
<div >
<h4 className="font-title-md text-title-md text-on-surface font-semibold">Acceso Peatonal Principal</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Ingreso exclusivamente por la Puerta de Cristal Norte (Av. de las Palmeras 450). La Puerta Este permanecerá cerrada por mantenimiento.</p>
</div>
</div>
<div className="flex items-start gap-3">
<div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-sm">
<span className="material-symbols-outlined text-[20px]">styler</span>
</div>
<div >
<h4 className="font-title-md text-title-md text-on-surface font-semibold">Vestimenta &amp; Clima</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Código Smart Casual con prenda de abrigo recomendada: el microclima botánico desciende a 14°C pasadas las 22:00 hs.</p>
</div>
</div>
<div className="flex items-start gap-3">
<div className="w-9 h-9 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shrink-0 shadow-sm">
<span className="material-symbols-outlined text-[20px]">volume_off</span>
</div>
<div >
<h4 className="font-title-md text-title-md text-on-surface font-semibold">Protocolo de Acústica</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Concierto en formato no amplificado. Se ruega silenciar dispositivos móviles y evitar ingreso durante los movimientos sinfónicos.</p>
</div>
</div>
</div>
<div className="mt-space-md p-3.5 rounded-xl bg-surface-container-lowest flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-secondary">local_parking</span>
<span className="font-label-md text-label-md text-on-surface">Parking Subterráneo Puerta del Real</span>
</div>
<span className="font-label-sm text-label-sm text-outline">A 180 m</span>
</div>
</div>
<div className="md:col-span-7 flex flex-col">
<div className="w-full h-72 md:h-80 rounded-2xl bg-surface-container-highest shadow-inner overflow-hidden relative" data-location="Parque Principal de Envigado, Antioquia" style={{backgroundImage:"url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDZw9fk5hp7Rt9ActxFaD0ZvClfXXouqkNkTERO2vb2is4cjn7Rp3c-HLxdVF13Z98D_PWefK381l9nrKw7qQ1Ql0EhnSpObxpyX6vsOU6uJDg-34WuL-uGGdVP6l4Nx3Pq6C0WBpEhXR6IBvZWHqzeBuO7C3CEzxAofFpyghhIjt1vCSzvPvD3Q58EQvVMS-reYlcWfUauYch7VZ_d2ABhCeomBIrRzc04l-5JfcG1uNJdfDtcrw')"}}>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none"></div>
<div className="absolute top-4 left-4 p-2.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-md flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-secondary">pin_drop</span>
<span className="font-label-md text-label-md text-on-surface font-semibold">Punto de Control NEXO A-3</span>
</div>
<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-on-primary">
<div >
<p className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">Recinto del evento</p>
<p className="font-title-md text-title-md font-semibold">{e.venue}, Envigado, Antioquia</p>
</div>
<a className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-surface-container-high transition-colors shadow-sm flex items-center gap-1.5" href={maps} rel="noopener noreferrer" target="_blank">
<span >Abrir GPS</span>
<span className="material-symbols-outlined text-[14px]">open_in_new</span>
</a>
</div>
</div>
</div>
</div>
</div>
<div className="max-w-4xl mx-auto rounded-2xl bg-surface-container-lowest p-space-md md:p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md shadow-sm">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
<span className="material-symbols-outlined text-[24px]">support_agent</span>
</div>
<div >
<h4 className="font-title-md text-title-md text-on-surface font-semibold">¿Necesitas asistencia con tu reserva?</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Nuestro equipo de concierge cultural puede gestionar accesibilidad, cambio de titularidad o dietas especiales.</p>
</div>
</div>
<a className="px-5 py-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md font-bold uppercase tracking-wider transition-colors shrink-0" data-path="soporte" href="#">
          Contactar Soporte
        </a>
</div>
</div>
</section>
</div>
</>);
}
