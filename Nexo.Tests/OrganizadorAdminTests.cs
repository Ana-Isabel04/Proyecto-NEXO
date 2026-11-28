using System.Net;
using Microsoft.EntityFrameworkCore;
using Nexo.Models.Entities;
using static Nexo.Tests.NexoFactory;

namespace Nexo.Tests;

// Módulos de organizador y administración (46 casos).
[Collection("nexo")]
public class OrganizadorAdminTests(NexoFactory app)
{
    private record Escenario(HttpClient Organizador, int OrganizadorId, int EventoId);

    private async Task<Escenario> EscenarioAsync(int reservados = 0, string estado = EstadoEvento.Publicado)
    {
        var (email, id) = await app.UsuarioAsync(Roles.Organizador);
        var evento = await app.EventoAsync(id, reservados: reservados, estado: estado);
        return new Escenario(await app.SesionAsync(email), id, evento);
    }

    private async Task<Dictionary<string, object?>> DatosAsync(string? campo = null, object? valor = null)
    {
        var datos = new Dictionary<string, object?>
        {
            ["title"] = "Evento por API", ["description"] = "Descripción", ["categoryId"] = await app.CategoriaAsync(),
            ["startsAt"] = DateTime.Now.AddDays(10).ToString("yyyy-MM-ddTHH:mm"), ["venueName"] = "Sala", ["city"] = "Medellín",
            ["latitude"] = 6.244203m, ["longitude"] = -75.581212m, ["price"] = 12.5m, ["capacity"] = 50,
            ["externalUrl"] = "https://example.com/x", ["contact"] = "info@example.com", ["publicar"] = true
        };
        if (campo is not null) datos[campo] = valor;
        return datos;
    }

    private async Task<HttpStatusCode> CrearAsync(string? campo = null, object? valor = null)
    {
        var e = await EscenarioAsync();
        return (await ApiAsync(e.Organizador, HttpMethod.Post, "/api/eventos", await DatosAsync(campo, valor))).StatusCode;
    }

    private async Task<HttpStatusCode> ActualizarAsync(HttpClient c, int evento, string? campo = null, object? valor = null) =>
        (await ApiAsync(c, HttpMethod.Put, $"/api/eventos/{evento}", await DatosAsync(campo, valor))).StatusCode;

    private static async Task<HttpStatusCode> CancelarAsync(HttpClient c, int evento) =>
        (await ApiAsync(c, HttpMethod.Post, $"/api/eventos/{evento}/cancelar")).StatusCode;

    private static async Task<HttpStatusCode> ModerarAsync(HttpClient c, int evento, string accion) =>
        (await ApiAsync(c, HttpMethod.Post, $"/api/admin/eventos/{evento}/moderar", new { accion })).StatusCode;

    private Task<string> EstadoAsync(int evento) =>
        app.DbAsync(db => db.Events.Where(e => e.EventId == evento).Select(e => e.Status).SingleAsync());

    private Task<HttpClient> AdminAsync() => app.SesionAsync("admin@nexo.com");
    private Task<HttpClient> CuradorAsync() => app.SesionAsync("curador@nexo.com");

    private static bool Denegado(HttpResponseMessage r) => r.Headers.Location?.ToString().Contains("AccesoDenegado") == true;

    // ---- Recursos locales ----

    [Theory]
    [InlineData("/lib/tailwind/tailwind.min.js")]
    [InlineData("/lib/leaflet/leaflet.js")]
    [InlineData("/lib/leaflet/leaflet.css")]
    [InlineData("/lib/leaflet/images/marker-icon.png")]
    public async Task Los_recursos_locales_se_sirven(string ruta) =>
        Assert.Equal(HttpStatusCode.OK, (await app.Anonimo().GetAsync(ruta)).StatusCode);

    // ---- Organizador ----

    [Theory]
    [InlineData("/Organizador")]
    [InlineData("/Organizador/CrearEvento")]
    [InlineData("/Organizador/Reservas")]
    public async Task Las_pantallas_del_organizador_cargan(string ruta)
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.OK, (await e.Organizador.GetAsync(ruta)).StatusCode);
    }

    [Fact]
    public async Task Se_puede_crear_un_evento() => Assert.Equal(HttpStatusCode.Created, await CrearAsync());

    [Fact]
    public async Task Se_guardan_el_contacto_y_las_coordenadas()
    {
        var e = await EscenarioAsync();
        await ApiAsync(e.Organizador, HttpMethod.Post, "/api/eventos", await DatosAsync());
        var guardado = await app.DbAsync(db => db.Events.Include(x => x.Venue)
            .Where(x => x.Organizer.OwnerUserId == e.OrganizadorId && x.Title == "Evento por API").SingleAsync());
        Assert.Equal("info@example.com", guardado.Contact);
        Assert.Equal(6.244203m, guardado.Venue.Latitude);
        Assert.Equal(-75.581212m, guardado.Venue.Longitude);
    }

    [Fact]
    public async Task Se_rechaza_un_enlace_javascript() =>
        Assert.Equal(HttpStatusCode.BadRequest, await CrearAsync("externalUrl", "javascript:alert(1)"));

    [Fact]
    public async Task La_ubicacion_es_obligatoria() => Assert.Equal(HttpStatusCode.BadRequest, await CrearAsync("latitude", null));

    [Fact]
    public async Task No_se_admiten_fechas_pasadas() =>
        Assert.Equal(HttpStatusCode.BadRequest, await CrearAsync("startsAt", "2020-01-01T10:00"));

    [Fact]
    public async Task El_formulario_de_edicion_trae_los_valores()
    {
        var e = await EscenarioAsync();
        var html = await e.Organizador.GetStringAsync($"/Organizador/EditarEvento/{e.EventoId}");
        Assert.Contains("value=\"6.244200\"", html);
        Assert.Contains("value=\"12.50\"", html);
    }

    [Fact]
    public async Task La_capacidad_no_baja_de_lo_reservado()
    {
        var e = await EscenarioAsync(reservados: 3);
        Assert.Equal(HttpStatusCode.Conflict, await ActualizarAsync(e.Organizador, e.EventoId, "capacity", 2));
    }

    [Fact]
    public async Task Se_puede_actualizar_un_evento_propio()
    {
        var e = await EscenarioAsync(reservados: 3);
        Assert.Equal(HttpStatusCode.OK, await ActualizarAsync(e.Organizador, e.EventoId, "capacity", 3));
    }

    [Fact]
    public async Task El_organizador_ve_las_reservas_de_su_evento()
    {
        var e = await EscenarioAsync();
        var (_, asistente) = await app.UsuarioAsync(Roles.Asistente);
        var codigo = await app.ReservaAsync(asistente, e.EventoId);
        Assert.Contains(codigo, await e.Organizador.GetStringAsync($"/Organizador/Reservas/{e.EventoId}"));
    }

    [Fact]
    public async Task La_api_entrega_las_reservas_del_evento()
    {
        var e = await EscenarioAsync();
        var (_, asistente) = await app.UsuarioAsync(Roles.Asistente);
        var codigo = await app.ReservaAsync(asistente, e.EventoId);
        Assert.Contains(codigo, await e.Organizador.GetStringAsync($"/api/reservas/evento/{e.EventoId}"));
    }

    // ---- Un organizador frente a eventos ajenos ----

    private async Task<(HttpClient Otro, int Evento)> AjenoAsync()
    {
        var dueno = await EscenarioAsync();
        var otro = await EscenarioAsync();
        return (otro.Organizador, dueno.EventoId);
    }

    [Fact]
    public async Task No_puede_abrir_la_edicion_ajena()
    {
        var (otro, evento) = await AjenoAsync();
        Assert.Equal(HttpStatusCode.NotFound, (await otro.GetAsync($"/Organizador/EditarEvento/{evento}")).StatusCode);
    }

    [Fact]
    public async Task No_puede_actualizar_un_evento_ajeno()
    {
        var (otro, evento) = await AjenoAsync();
        Assert.Equal(HttpStatusCode.NotFound, await ActualizarAsync(otro, evento));
    }

    [Fact]
    public async Task No_puede_cancelar_un_evento_ajeno()
    {
        var (otro, evento) = await AjenoAsync();
        Assert.Equal(HttpStatusCode.NotFound, await CancelarAsync(otro, evento));
    }

    [Fact]
    public async Task No_puede_ver_reservas_ajenas()
    {
        var (otro, evento) = await AjenoAsync();
        Assert.Equal(HttpStatusCode.NotFound, (await otro.GetAsync($"/api/reservas/evento/{evento}")).StatusCode);
    }

    [Fact]
    public async Task Su_panel_solo_muestra_eventos_propios()
    {
        await EscenarioAsync(); // Evento de otra persona.
        var (email, _) = await app.UsuarioAsync(Roles.Organizador);
        var cliente = await app.SesionAsync(email);
        Assert.Contains("Sin eventos", await cliente.GetStringAsync("/Organizador"));
    }

    // ---- Administración y permisos ----

    [Theory]
    [InlineData("/Admin")]
    [InlineData("/Admin/Eventos")]
    [InlineData("/Admin/Eventos/{0}")]
    [InlineData("/Admin/Usuarios")]
    [InlineData("/Admin/Reservas?q=NX")]
    [InlineData("/Admin/Reportes")]
    public async Task Las_pantallas_de_administracion_cargan(string ruta)
    {
        var e = await EscenarioAsync();
        var admin = await AdminAsync();
        Assert.Equal(HttpStatusCode.OK, (await admin.GetAsync(string.Format(ruta, e.EventoId))).StatusCode);
    }

    [Fact]
    public async Task Curaduria_ve_los_eventos()
    {
        var e = await EscenarioAsync();
        var curador = await CuradorAsync();
        Assert.Equal(HttpStatusCode.OK, (await curador.GetAsync("/Admin/Eventos")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await curador.GetAsync($"/Admin/Eventos/{e.EventoId}")).StatusCode);
    }

    [Fact]
    public async Task Curaduria_no_entra_al_resto_del_panel()
    {
        var curador = await CuradorAsync();
        foreach (var ruta in new[] { "/Admin", "/Admin/Usuarios", "/Admin/Reportes", "/Admin/Reservas" })
            Assert.True(Denegado(await curador.GetAsync(ruta)), ruta);
    }

    [Fact]
    public async Task Organizadores_y_asistentes_no_entran_a_administracion()
    {
        foreach (var email in new[] { "organizador@nexo.com", "asistente@nexo.com" })
            Assert.True(Denegado(await (await app.SesionAsync(email)).GetAsync("/Admin/Eventos")), email);
    }

    [Fact]
    public async Task Curaduria_no_suspende_usuarios()
    {
        var (_, id) = await app.UsuarioAsync(Roles.Asistente);
        var r = await ApiAsync(await CuradorAsync(), HttpMethod.Put, $"/api/admin/usuarios/{id}/activo", new { valor = false });
        Assert.Equal(HttpStatusCode.Forbidden, r.StatusCode);
    }

    [Fact]
    public async Task Un_organizador_no_modera()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.Forbidden, await ModerarAsync(e.Organizador, e.EventoId, "aprobar"));
    }

    // ---- Moderación ----

    [Fact]
    public async Task Ocultar_deja_el_evento_en_revision()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.OK, await ModerarAsync(await CuradorAsync(), e.EventoId, "ocultar"));
        Assert.Equal(EstadoEvento.Pendiente, await EstadoAsync(e.EventoId));
    }

    [Fact]
    public async Task El_organizador_no_republica_un_evento_oculto()
    {
        var e = await EscenarioAsync(estado: EstadoEvento.Pendiente);
        await ActualizarAsync(e.Organizador, e.EventoId);
        Assert.Equal(EstadoEvento.Pendiente, await EstadoAsync(e.EventoId));
    }

    [Fact]
    public async Task Aprobar_publica_el_evento()
    {
        var e = await EscenarioAsync(estado: EstadoEvento.Pendiente);
        Assert.Equal(HttpStatusCode.OK, await ModerarAsync(await AdminAsync(), e.EventoId, "aprobar"));
        Assert.Equal(EstadoEvento.Publicado, await EstadoAsync(e.EventoId));
    }

    [Fact]
    public async Task Devolver_lo_pasa_a_borrador()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.OK, await ModerarAsync(await AdminAsync(), e.EventoId, "devolver"));
        Assert.Equal(EstadoEvento.Borrador, await EstadoAsync(e.EventoId));
    }

    // ---- Reportes ----

    private async Task<(HttpClient Admin, int Reporte, string Motivo, HttpStatusCode Codigo)> ReporteAsync()
    {
        var e = await EscenarioAsync();
        var admin = await AdminAsync();
        var motivo = "Motivo " + Guid.NewGuid().ToString("N")[..8];
        var r = await ApiAsync(admin, HttpMethod.Post, $"/api/admin/eventos/{e.EventoId}/reportes", new { motivo });
        var id = await app.DbAsync(db => db.Reports.Where(x => x.Reason == motivo).Select(x => x.ReportId).SingleAsync());
        return (admin, id, motivo, r.StatusCode);
    }

    [Fact]
    public async Task Se_puede_reportar_un_evento() => Assert.Equal(HttpStatusCode.Created, (await ReporteAsync()).Codigo);

    [Fact]
    public async Task El_reporte_aparece_en_la_lista()
    {
        var r = await ReporteAsync();
        Assert.Contains(r.Motivo, await r.Admin.GetStringAsync("/Admin/Reportes"));
    }

    [Fact]
    public async Task Se_puede_marcar_como_revisado()
    {
        var r = await ReporteAsync();
        var respuesta = await ApiAsync(r.Admin, HttpMethod.Put, $"/api/admin/reportes/{r.Reporte}", new { estado = "revisado" });
        Assert.Equal(HttpStatusCode.OK, respuesta.StatusCode);
    }

    // ---- Cuentas ----

    [Fact]
    public async Task No_se_suspende_a_un_administrador()
    {
        var (_, id) = await app.UsuarioAsync(Roles.Admin);
        var r = await ApiAsync(await AdminAsync(), HttpMethod.Put, $"/api/admin/usuarios/{id}/activo", new { valor = false });
        Assert.Equal(HttpStatusCode.Forbidden, r.StatusCode);
    }

    [Fact]
    public async Task Suspender_a_un_asistente_cierra_su_acceso()
    {
        var (email, id) = await app.UsuarioAsync(Roles.Asistente);
        var asistente = await app.SesionAsync(email);
        var r = await ApiAsync(await AdminAsync(), HttpMethod.Put, $"/api/admin/usuarios/{id}/activo", new { valor = false });
        Assert.Equal(HttpStatusCode.OK, r.StatusCode);
        Assert.Contains("Login", (await asistente.GetAsync("/Perfil")).Headers.Location!.ToString());
    }

    [Fact]
    public async Task Se_puede_verificar_un_organizador()
    {
        var (_, id) = await app.UsuarioAsync(Roles.Organizador);
        var organizacion = await app.DbAsync(db => db.Organizers.Where(o => o.OwnerUserId == id).Select(o => o.OrganizerId).SingleAsync());
        var r = await ApiAsync(await AdminAsync(), HttpMethod.Put, $"/api/admin/organizadores/{organizacion}/verificado", new { valor = true });
        Assert.Equal(HttpStatusCode.OK, r.StatusCode);
        Assert.True(await app.DbAsync(db => db.Organizers.Where(o => o.OrganizerId == organizacion).Select(o => o.IsVerified).SingleAsync()));
    }

    // ---- Cancelación ----

    [Fact]
    public async Task El_organizador_cancela_su_evento()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.OK, await CancelarAsync(e.Organizador, e.EventoId));
        Assert.Equal(EstadoEvento.Cancelado, await EstadoAsync(e.EventoId));
    }

    [Fact]
    public async Task Un_evento_cancelado_no_se_edita()
    {
        var e = await EscenarioAsync(estado: EstadoEvento.Cancelado);
        Assert.Equal(HttpStatusCode.Conflict, await ActualizarAsync(e.Organizador, e.EventoId));
    }

    [Fact]
    public async Task Un_evento_cancelado_no_se_aprueba()
    {
        var e = await EscenarioAsync(estado: EstadoEvento.Cancelado);
        Assert.Equal(HttpStatusCode.Conflict, await ModerarAsync(await AdminAsync(), e.EventoId, "aprobar"));
    }
}
