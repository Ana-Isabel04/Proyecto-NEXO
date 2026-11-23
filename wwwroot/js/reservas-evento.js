document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscador-asistentes");
    const filas = document.querySelectorAll("#tabla-asistentes tr");
    const tabsFiltro = document.querySelectorAll(".tab-filtro");

    if (buscador) {
        buscador.addEventListener("input", () => {
            const consulta = buscador.value.toLowerCase().trim();
            filas.forEach((fila) => {
                const texto = fila.textContent.toLowerCase();
                fila.style.display = texto.includes(consulta) ? "" : "none";
            });
        });
    }

    tabsFiltro.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabsFiltro.forEach((t) => {
                t.classList.remove("bg-primary", "text-on-primary", "font-bold");
                t.classList.add("text-on-surface-variant", "font-semibold");
            });
            tab.classList.add("bg-primary", "text-on-primary", "font-bold");
            tab.classList.remove("text-on-surface-variant");

            const filtro = tab.dataset.filtro;
            filas.forEach((fila) => {
                const estado = fila.dataset.estado;
                if (filtro === "todas" || estado === filtro) {
                    fila.style.display = "";
                } else {
                    fila.style.display = "none";
                }
            });
        });
    });
});