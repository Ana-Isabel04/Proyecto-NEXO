using System.Net;
using Microsoft.EntityFrameworkCore;
using Nexo.Models.Entities;
using static Nexo.Tests.NexoFactory;

namespace Nexo.Tests;

// Registro, inicio de sesión, perfil y valoraciones (30 casos).
[Collection("nexo")]
public class AccesoPerfilTests(NexoFactory app)
{
    private static Dictionary<string, string> Registro(string email, string acepta = "true") => new()
    {
        ["FullName"] = "Persona Prueba", ["Email"] = email, ["Password"] = Clave, ["City"] = "Medellín", ["AceptaTerminos"] = acepta
    };

    private static string Destino(HttpResponseMessage r) => r.Headers.Location?.ToString() ?? "";

    private Task<bool> ExisteAsync(string email) => app.DbAsync(db => db.Users.AnyAsync(u => u.Email == email));

    // Asistente con un evento ya realizado, uno futuro (ambos reservados) y uno sin reserva.
    private async Task<(HttpClient Cliente, int Pasado, int Futuro, int SinReserva)> EscenarioAsync()
    {
        var (_, organizadorId) = await app.UsuarioAsync(Roles.Organizador);
        var (email, id) = await app.UsuarioAsync(Roles.Asistente);
        var pasado = await app.EventoAsync(organizadorId, -2);
        var futuro = await app.EventoAsync(organizadorId, 5);
        var sinReserva = await app.EventoAsync(organizadorId, -2);
        await app.ReservaAsync(id, pasado);
        await app.ReservaAsync(id, futuro);
        return (await app.SesionAsync(email), pasado, futuro, sinReserva);
    }

    private static Task<HttpResponseMessage> ValorarAsync(HttpClient c, int evento, int nota, bool conToken = true) =>
        ApiAsync(c, HttpMethod.Post, "/api/valoraciones", new { eventId = evento, calificacion = nota, comentario = "Muy bien" }, conToken);

    [Theory]
    [InlineData("Login")]
    [InlineData("Registro")]
    [InlineData("RegistroOrganizador")]
    [InlineData("RegistroAdmin")]
    [InlineData("AccesoDenegado")]
    public async Task Las_pantallas_de_acceso_cargan(string pantalla) =>
        Assert.Equal(HttpStatusCode.OK, (await app.Anonimo().GetAsync("/Auth/" + pantalla)).StatusCode);

    [Fact]
    public async Task Registrar_un_asistente_lleva_al_perfil()
    {
        var r = await FormAsync(app.Anonimo(), "/Auth/Registro", Registro(Correo()));
        Assert.Equal("/Perfil", Destino(r));
    }

    [Fact]
    public async Task El_asistente_registrado_puede_ver_su_perfil()
    {
        var cliente = app.Anonimo();
        await FormAsync(cliente, "/Auth/Registro", Registro(Correo()));
        Assert.Equal(HttpStatusCode.OK, (await cliente.GetAsync("/Perfil")).StatusCode);
    }

    [Fact]
    public async Task No_se_admite_un_correo_repetido()
    {
        var email = Correo();
        await FormAsync(app.Anonimo(), "/Auth/Registro", Registro(email));
        var r = await FormAsync(app.Anonimo(), "/Auth/Registro", Registro(email.ToUpperInvariant()));
        Assert.Contains("Ya existe una cuenta", await r.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task No_se_registra_sin_aceptar_los_terminos()
    {
        var email = Correo();
        var r = await FormAsync(app.Anonimo(), "/Auth/Registro", Registro(email, "false"));
        Assert.Equal(HttpStatusCode.OK, r.StatusCode);
        Assert.False(await ExisteAsync(email));
    }

    [Fact]
    public async Task Registrar_un_organizador_lleva_a_su_panel()
    {
        var campos = Registro(Correo());
        campos["OrganizationName"] = "Colectivo Prueba";
        var r = await FormAsync(app.Anonimo(), "/Auth/RegistroOrganizador", campos);
        Assert.Equal("/Organizador", Destino(r));
    }

    [Fact]
    public async Task El_registro_de_organizador_crea_su_organizacion()
    {
        var email = Correo();
        var campos = Registro(email);
        campos["OrganizationName"] = "Sala " + email;
        await FormAsync(app.Anonimo(), "/Auth/RegistroOrganizador", campos);
        Assert.True(await app.DbAsync(db => db.Organizers.AnyAsync(o => o.Name == "Sala " + email && o.Owner.Email == email)));
    }

    [Fact]
    public async Task Un_codigo_de_invitacion_incorrecto_no_crea_administradores()
    {
        var email = Correo();
        var campos = Registro(email);
        campos["CodigoInvitacion"] = "incorrecto";
        var r = await FormAsync(app.Anonimo(), "/Auth/RegistroAdmin", campos);
        Assert.Equal(HttpStatusCode.OK, r.StatusCode);
        Assert.False(await ExisteAsync(email));
    }

    [Fact]
    public async Task Con_el_codigo_correcto_se_crea_un_administrador()
    {
        var campos = Registro(Correo());
        campos["CodigoInvitacion"] = CodigoAdmin;
        var r = await FormAsync(app.Anonimo(), "/Auth/RegistroAdmin", campos);
        Assert.Equal("/Admin", Destino(r));
    }

    [Fact]
    public async Task Una_clave_incorrecta_no_inicia_sesion()
    {
        var r = await FormAsync(app.Anonimo(), "/Auth/Login", new() { ["Email"] = "asistente@nexo.com", ["Password"] = "mala" });
        Assert.Contains("incorrectos", await r.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task El_login_ignora_un_returnUrl_externo()
    {
        var r = await FormAsync(app.Anonimo(), "/Auth/Login",
            new() { ["Email"] = "asistente@nexo.com", ["Password"] = Clave, ["ReturnUrl"] = "https://example.org/" });
        Assert.Equal("/Perfil", Destino(r));
    }

    [Fact]
    public async Task Un_organizador_no_entra_al_perfil_de_asistente()
    {
        var cliente = await app.SesionAsync("organizador@nexo.com");
        Assert.Contains("AccesoDenegado", Destino(await cliente.GetAsync("/Perfil")));
    }

    [Fact]
    public async Task La_api_responde_401_a_un_anonimo() =>
        Assert.Equal(HttpStatusCode.Unauthorized, (await app.Anonimo().GetAsync("/api/valoraciones")).StatusCode);

    [Fact]
    public async Task La_api_responde_403_a_otro_rol()
    {
        var cliente = await app.SesionAsync("organizador@nexo.com");
        Assert.Equal(HttpStatusCode.Forbidden, (await cliente.GetAsync("/api/valoraciones")).StatusCode);
    }

    [Fact]
    public async Task El_perfil_solo_ofrece_valorar_eventos_realizados()
    {
        var e = await EscenarioAsync();
        var html = await e.Cliente.GetStringAsync("/Perfil");
        Assert.Contains($"/Perfil/Valorar/{e.Pasado}\"", html);
        Assert.DoesNotContain($"/Perfil/Valorar/{e.Futuro}\"", html);
    }

    [Fact]
    public async Task La_pantalla_de_valorar_muestra_el_formulario()
    {
        var e = await EscenarioAsync();
        Assert.Contains("form-valoracion", await e.Cliente.GetStringAsync($"/Perfil/Valorar/{e.Pasado}"));
    }

    [Fact]
    public async Task No_se_valora_un_evento_futuro()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.Conflict, (await ValorarAsync(e.Cliente, e.Futuro, 5)).StatusCode);
    }

    [Fact]
    public async Task No_se_valora_sin_reserva()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.Conflict, (await ValorarAsync(e.Cliente, e.SinReserva, 5)).StatusCode);
    }

    [Fact]
    public async Task La_calificacion_debe_estar_entre_1_y_5()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.BadRequest, (await ValorarAsync(e.Cliente, e.Pasado, 6)).StatusCode);
    }

    [Fact]
    public async Task Sin_token_antiforgery_se_rechaza()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.BadRequest, (await ValorarAsync(e.Cliente, e.Pasado, 4, conToken: false)).StatusCode);
    }

    [Fact]
    public async Task Una_valoracion_valida_se_guarda()
    {
        var e = await EscenarioAsync();
        Assert.Equal(HttpStatusCode.Created, (await ValorarAsync(e.Cliente, e.Pasado, 4)).StatusCode);
    }

    [Fact]
    public async Task No_se_valora_dos_veces()
    {
        var e = await EscenarioAsync();
        await ValorarAsync(e.Cliente, e.Pasado, 4);
        Assert.Equal(HttpStatusCode.Conflict, (await ValorarAsync(e.Cliente, e.Pasado, 4)).StatusCode);
    }

    [Fact]
    public async Task El_perfil_muestra_la_valoracion()
    {
        var e = await EscenarioAsync();
        await ValorarAsync(e.Cliente, e.Pasado, 4);
        Assert.Contains("Muy bien", await e.Cliente.GetStringAsync("/Perfil"));
    }

    [Fact]
    public async Task Una_cuenta_desactivada_pierde_la_sesion()
    {
        var (email, id) = await app.UsuarioAsync(Roles.Asistente);
        var cliente = await app.SesionAsync(email);
        await app.DbAsync(db => db.Users.Where(u => u.UserId == id).ExecuteUpdateAsync(s => s.SetProperty(u => u.IsActive, false)));
        Assert.Contains("Login", Destino(await cliente.GetAsync("/Perfil")));
    }

    [Fact]
    public async Task Swagger_documenta_las_valoraciones() =>
        Assert.Contains("/api/valoraciones", await app.Anonimo().GetStringAsync("/swagger/v1/swagger.json"));

    [Fact]
    public async Task Cerrar_sesion_quita_el_acceso()
    {
        var cliente = await app.SesionAsync("asistente@nexo.com");
        await FormAsync(cliente, "/Auth/Logout", new());
        Assert.Equal(HttpStatusCode.Redirect, (await cliente.GetAsync("/Perfil")).StatusCode);
    }
}
