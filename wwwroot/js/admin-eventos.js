document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscador-admin-eventos");
    const selectCategoria = document.getElementById("filtro-categoria-admin");
    const tabsEstado = document.querySelectorAll(".tab-estado-admin");
    const tarjetas = document.querySelectorAll(".tarjeta-evento-admin");

    let estadoActivo = "todos";

    function filtrarTarjetas() {
        const texto = (buscador?.value || "").toLowerCase().trim();
        const categoria = selectCategoria?.value || "";

        tarjetas.forEach((tarjeta) => {
            const coincideTexto = tarjeta.textContent.toLowerCase().includes(texto);
            const coincideCategoria = !categoria || tarjeta.dataset.categoria === categoria;
            const coincideEstado = estadoActivo === "todos" || tarjeta.dataset.estado === estadoActivo;

            tarjeta.style.display = (coincideTexto && coincideCategoria && coincideEstado) ? "" : "none";
        });
    }

    buscador?.addEventListener("input", filtrarTarjetas);
    selectCategoria?.addEventListener("change", filtrarTarjetas);

    tabsEstado.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabsEstado.forEach((t) => {
                t.classList.remove("bg-primary", "text-on-primary", "shadow-sm");
                t.classList.add("text-on-surface-variant");
            });
            tab.classList.add("bg-primary", "text-on-primary", "shadow-sm");
            tab.classList.remove("text-on-surface-variant");

            estadoActivo = tab.dataset.estado;
            filtrarTarjetas();
        });
    });
});