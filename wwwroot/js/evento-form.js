// Formulario de evento: vista previa, mapa y envío a la API.
(() => {
    const form = document.getElementById('form-evento');
    if (!form) return;
    const campo = n => form.elements.namedItem(n);
    const $id = id => document.getElementById(id);
    const mensaje = $id('mensaje');

    // Vista previa en vivo (solo textContent: sin inyección de HTML).
    function vistaPrevia() {
        const v = n => campo(n).value.trim();
        const categoria = campo('categoryId');
        $id('pv-categoria').textContent = categoria.value ? categoria.selectedOptions[0].text : 'sin categoría';
        $id('pv-titulo').textContent = v('title') || 'Nombre del evento';
        $id('pv-fecha').textContent = v('startsAt') ? new Date(v('startsAt')).toLocaleString('es') : 'Fecha por definir';
        $id('pv-lugar').textContent = [v('venueName'), v('city')].filter(Boolean).join(', ') || 'Lugar por definir';
        $id('pv-descripcion').textContent = v('description');
        $id('pv-precio').textContent = v('price') === '' ? '' : Number(v('price')) === 0 ? 'Gratuito' : `${Number(v('price')).toFixed(2)} €`;
        $id('pv-contacto').textContent = v('contact') ? `Contacto: ${v('contact')}` : '';
        const img = $id('pv-imagen');
        const url = /^https?:\/\//i.test(v('imageUrl')) ? v('imageUrl') : '';
        if (img.getAttribute('src') !== url) img.setAttribute('src', url);
        img.classList.toggle('hidden', !url);
        const reservados = Number(campo('capacity').dataset.reservados);
        $id('disponibles').textContent = v('capacity') ? Math.max(0, Number(v('capacity')) - reservados) : '—';
    }
    const pills = [...form.querySelectorAll('[data-categoria]')];
    function marcarCategoria() {
        let icono = 'event';
        pills.forEach(p => {
            const activa = p.dataset.categoria === campo('categoryId').value;
            p.setAttribute('aria-pressed', String(activa));
            if (activa) icono = p.dataset.icono;
        });
        $id('pv-icono').textContent = icono;
    }
    pills.forEach(p => p.addEventListener('click', () => {
        const select = campo('categoryId');
        select.value = p.dataset.categoria;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        if (window.jQuery?.fn.valid) jQuery(select).valid();
    }));
    form.addEventListener('input', () => { marcarCategoria(); vistaPrevia(); });
    marcarCategoria();
    vistaPrevia();

    // Mapa (RF-66, RF-67).
    if (window.L) {
        const lat = campo('latitude'), lng = campo('longitude');
        const inicial = lat.value && lng.value ? [Number(lat.value), Number(lng.value)] : null;
        const mapa = L.map('mapa').setView(inicial ?? [6.2442, -75.5812], inicial ? 15 : 13); // Sin coordenadas: Medellín.
        let marcador = null;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' })
            .on('tileerror', () => $id('mapa-aviso').textContent = 'El servicio de mapas no está disponible. Puedes escribir las coordenadas.')
            .addTo(mapa);
        const fijar = (punto) => {
            lat.value = punto.lat.toFixed(6);
            lng.value = punto.lng.toFixed(6);
            colocar(punto);
        };
        const colocar = punto => {
            if (!marcador) marcador = L.marker(punto, { draggable: true }).on('dragend', () => fijar(marcador.getLatLng().wrap())).addTo(mapa);
            else marcador.setLatLng(punto);
        };
        if (inicial) colocar(inicial);
        mapa.on('click', e => fijar(e.latlng.wrap()));
        [lat, lng].forEach(c => c.addEventListener('change', () => {
            if (lat.value && lng.value) { const p = [Number(lat.value), Number(lng.value)]; colocar(p); mapa.setView(p, 15); }
        }));
    } else {
        $id('mapa-aviso').textContent = 'No se pudo cargar el mapa. Puedes escribir las coordenadas.';
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        mensaje.textContent = '';
        // Validación en cliente si jQuery está disponible; el servidor valida siempre.
        if (window.jQuery?.fn.valid && !jQuery(form).valid()) return;
        const body = { publicar: e.submitter?.dataset.publicar === 'true' };
        for (const el of form.elements) if (el.name) body[el.name] = el.value.trim() === '' ? null : el.value.trim();
        for (const n of ['categoryId', 'latitude', 'longitude', 'price', 'capacity']) if (body[n] !== null) body[n] = Number(body[n]);

        const id = form.dataset.id;
        const botones = form.querySelectorAll('button');
        botones.forEach(b => b.disabled = true);
        try {
            const r = await nexoFetch(id ? `/api/eventos/${id}` : '/api/eventos', { method: id ? 'PUT' : 'POST', body });
            if (r.ok) { window.location.href = '/Organizador'; return; }
            mensaje.textContent = r.data?.mensaje ?? Object.values(r.data?.errors ?? {}).flat().join(' ') ?? 'No se pudo guardar.';
        } catch {
            mensaje.textContent = 'Sin conexión. Inténtalo de nuevo.';
        }
        botones.forEach(b => b.disabled = false);
    });
})();
