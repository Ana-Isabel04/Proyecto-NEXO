document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscador-usuarios-admin");
    const tabsRol = document.querySelectorAll(".tab-rol-admin");
    const tarjetas = document.querySelectorAll(".tarjeta-usuario-admin");

    const modalAdmin = document.getElementById("modal-crear-admin");
    const btnAbrirModal = document.getElementById("btn-abrir-modal-admin");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal-admin");
    const btnCancelarModal = document.getElementById("btn-cancelar-modal-admin");

    let rolActivo = "todos";

    function filtrarUsuarios() {
        const texto = (buscador?.value || "").toLowerCase().trim();
        tarjetas.forEach((tarjeta) => {
            const coincideTexto = tarjeta.textContent.toLowerCase().includes(texto);
            const coincideRol = rolActivo === "todos" || tarjeta.dataset.rol === rolActivo;
            tarjeta.style.display = (coincideTexto && coincideRol) ? "" : "none";
        });
    }

    buscador?.addEventListener("input", filtrarUsuarios);

    tabsRol.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabsRol.forEach((t) => {
                t.classList.remove("bg-primary", "text-on-primary");
                t.classList.add("bg-surface-container-low", "text-on-surface");
            });
            tab.classList.remove("bg-surface-container-low", "text-on-surface");
            tab.classList.add("bg-primary", "text-on-primary");

            rolActivo = tab.dataset.filtroRol;
            filtrarUsuarios();
        });
    });

    function abrirModal() {
        modalAdmin?.classList.remove("hidden");
        modalAdmin?.classList.add("flex");
    }

    function cerrarModal() {
        modalAdmin?.classList.add("hidden");
        modalAdmin?.classList.remove("flex");
    }

    btnAbrirModal?.addEventListener("click", abrirModal);
    btnCerrarModal?.addEventListener("click", cerrarModal);
    btnCancelarModal?.addEventListener("click", cerrarModal);
});