// Cliente HTTP: sesión por cookie (misma que las vistas MVC) + token CSRF en cada escritura.
export const LANDING = { admin: '/Admin', curador: '/Admin/Eventos', organizador: '/Organizador', asistente: '/Perfil' };

async function csrf() {
  const r = await fetch('/api/csrf', { credentials: 'same-origin' });
  return (await r.json()).token;
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (method !== 'GET') headers['X-CSRF-TOKEN'] = await csrf();
  const r = await fetch('/api' + path, { method, headers, credentials: 'same-origin', body: body && JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (r.status === 401 && !path.startsWith('/auth/')) { location.assign('/app/login'); }
  if (!r.ok) throw Object.assign(new Error(data.error || 'Error'), { status: r.status, data });
  return data;
}
export const money = n => '$' + Number(n).toLocaleString('es-CO', { maximumFractionDigits: 0 }); // pesos colombianos
export const fmt = d => new Date(d).toLocaleString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
