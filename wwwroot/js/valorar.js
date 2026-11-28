// Estrellas y envío de la valoración.
(() => {
    const form = document.getElementById('form-valoracion');
    if (!form) return;
    const estrellas = [...form.querySelectorAll('[data-star]')];
    const mensaje = document.getElementById('mensaje');
    let calificacion = 0;

    estrellas.forEach(btn => btn.addEventListener('click', () => {
        calificacion = Number(btn.dataset.star);
        mensaje.textContent = '';
        estrellas.forEach(b => {
            const activa = Number(b.dataset.star) <= calificacion;
            b.style.fontVariationSettings = `'FILL' ${activa ? 1 : 0}`;
            b.setAttribute('aria-pressed', String(Number(b.dataset.star) === calificacion));
        });
    }));

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!calificacion) { mensaje.textContent = 'Elige una calificación de 1 a 5.'; return; }
        const boton = form.querySelector('[type=submit]');
        boton.disabled = true;
        try {
            const r = await nexoFetch('/api/valoraciones', {
                method: 'POST',
                body: { eventId: Number(form.dataset.event), calificacion, comentario: document.getElementById('comentario').value }
            });
            if (r.ok) { window.location.href = '/Perfil'; return; }
            mensaje.textContent = r.data?.mensaje ?? Object.values(r.data?.errors ?? {}).flat()[0] ?? 'No se pudo guardar la valoración.';
        } catch {
            mensaje.textContent = 'Sin conexión. Inténtalo de nuevo.';
        }
        boton.disabled = false;
    });
})();
