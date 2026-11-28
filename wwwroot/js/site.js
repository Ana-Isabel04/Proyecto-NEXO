// Funciones compartidas por todas las páginas.
// fetch() con cookie de sesión y token antiforgery para las APIs /api/...
async function nexoFetch(url, { method = 'GET', body } = {}) {
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    const headers = { Accept: 'application/json' };
    if (token) headers['X-CSRF-TOKEN'] = token;
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const res = await fetch(url, { method, headers, credentials: 'same-origin', body: body === undefined ? undefined : JSON.stringify(body) });
    const data = res.headers.get('content-type')?.includes('json') ? await res.json() : null;
    return { ok: res.ok, status: res.status, data };
}

// Botones de acción: data-api, data-method, data-body (JSON) y data-confirm.
document.addEventListener('click', async e => {
    const btn = e.target.closest('[data-api]');
    if (!btn) return;
    if (btn.dataset.confirm && !(await nexoConfirmar(btn.dataset.confirm))) return;
    btn.disabled = true;
    try {
        const r = await nexoFetch(btn.dataset.api, { method: btn.dataset.method, body: btn.dataset.body ? JSON.parse(btn.dataset.body) : undefined });
        if (r.ok) { window.location.reload(); return; }
        alert(r.data?.mensaje ?? 'No se pudo completar la acción.');
    } catch {
        alert('Sin conexión. Inténtalo de nuevo.');
    }
    btn.disabled = false;
});

// Diálogo de confirmación con el estilo de NEXO.
function nexoConfirmar(texto) {
    const d = document.createElement('dialog');
    if (!d.showModal) return Promise.resolve(window.confirm(texto));
    d.className = 'nx-dialogo rounded-2xl p-0 bg-surface-container-lowest text-on-surface shadow-2xl w-[min(26rem,90vw)]';
    d.innerHTML = `<form method="dialog" class="p-6 flex flex-col gap-4">
        <span class="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center"><span class="material-symbols-outlined">help</span></span>
        <p class="font-headline-sm text-headline-sm"></p>
        <div class="flex justify-end gap-2">
            <button value="no" class="px-4 py-2.5 rounded-xl bg-surface-container font-label-lg text-label-lg">Volver</button>
            <button value="si" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg">Confirmar</button>
        </div></form>`;
    d.querySelector('p').textContent = texto;
    document.body.append(d);
    d.showModal();
    return new Promise(resolver => d.addEventListener('close', () => { resolver(d.returnValue === 'si'); d.remove(); }));
}

// Pills que filtran en pantalla: [data-filtros="#lista"] button[data-valor] sobre elementos [data-tags].
document.addEventListener('click', e => {
    const pill = e.target.closest('[data-filtros] button[data-valor]');
    if (!pill) return;
    const grupo = pill.closest('[data-filtros]');
    grupo.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === pill)));
    const lista = document.querySelector(grupo.dataset.filtros);
    let visibles = 0;
    lista.querySelectorAll('[data-tags]').forEach(item => {
        const mostrar = !pill.dataset.valor || item.dataset.tags.split('|').includes(pill.dataset.valor);
        item.hidden = !mostrar;
        if (mostrar) visibles++;
    });
    lista.querySelector('[data-sin-coincidencias]')?.toggleAttribute('hidden', visibles > 0);
});
