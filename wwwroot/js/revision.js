// Revisión de un evento: mapa del recinto y formulario de reporte.
(() => {
    const caja = document.getElementById('mapa');
    const aviso = document.getElementById('mapa-aviso');
    if (window.L) {
        const guardado = [Number(caja.dataset.lat), Number(caja.dataset.lng)];
        // 0,0 o un valor no numérico significa que el recinto no tiene coordenadas.
        const tienePunto = guardado.every(Number.isFinite) && guardado.some(v => v !== 0);
        const mapa = L.map(caja).setView(tienePunto ? guardado : [6.2442, -75.5812], tienePunto ? 15 : 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' })
            .on('tileerror', () => aviso.textContent = 'El servicio de mapas no está disponible.')
            .addTo(mapa);
        if (tienePunto) L.marker(guardado).addTo(mapa);
    } else {
        aviso.textContent = 'No se pudo cargar el mapa.';
    }

    const form = document.getElementById('form-reporte');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const r = await nexoFetch(`/api/admin/eventos/${form.dataset.event}/reportes`, {
            method: 'POST',
            body: { motivo: form.elements.motivo.value, descripcion: form.elements.descripcion.value }
        });
        if (r.ok) window.location.reload();
        else alert(r.data?.mensaje ?? 'No se pudo registrar el reporte.');
    });
})();
