using System.Net;
using System.Net.Http.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Nexo.Data;
using Nexo.Models.Entities;

namespace Nexo.Tests;

// Levanta la aplicación completa contra una base SQL Server temporal que se borra al terminar.
public class NexoFactory : WebApplicationFactory<NexoDbContext>, IAsyncLifetime
{
    public const string Clave = "Clave-Pruebas-123!";
    public const string CodigoAdmin = "codigo-de-prueba";

    // Para usar otro servidor, definir la variable de entorno NEXO_TEST_SERVER.
    private readonly string _conexion = new SqlConnectionStringBuilder
    {
        DataSource = Environment.GetEnvironmentVariable("NEXO_TEST_SERVER") ?? @"(localdb)\MSSQLLocalDB",
        InitialCatalog = "NexoDb_Tests_" + Guid.NewGuid().ToString("N")[..8],
        IntegratedSecurity = true,
        TrustServerCertificate = true,
        ConnectTimeout = 60
    }.ConnectionString;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.UseSetting("ConnectionStrings:NexoDb", _conexion);
        builder.UseSetting("Seed:DemoUsers", "true");
        builder.UseSetting("Seed:DemoPassword", Clave);
        builder.UseSetting("Registro:CodigoInvitacionAdmin", CodigoAdmin);
    }

    public Task InitializeAsync()
    {
        _ = Server; // Arranca la app: aplica migraciones y carga los datos iniciales.
        return Task.CompletedTask;
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await DbAsync(db => db.Database.EnsureDeletedAsync());
        await DisposeAsync();
    }

    public async Task<T> DbAsync<T>(Func<NexoDbContext, Task<T>> accion)
    {
        using var scope = Services.CreateScope();
        return await accion(scope.ServiceProvider.GetRequiredService<NexoDbContext>());
    }

    public HttpClient Anonimo() => CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

    public async Task<HttpClient> SesionAsync(string email)
    {
        var cliente = Anonimo();
        var respuesta = await FormAsync(cliente, "/Auth/Login", new() { ["Email"] = email, ["Password"] = Clave });
        Assert.Equal(HttpStatusCode.Redirect, respuesta.StatusCode);
        return cliente;
    }

    public static async Task<string> TokenAsync(HttpClient cliente)
    {
        var html = await cliente.GetStringAsync("/Auth/AccesoDenegado");
        return Regex.Match(html, "csrf-token\" content=\"([^\"]+)\"").Groups[1].Value;
    }

    public static async Task<HttpResponseMessage> FormAsync(HttpClient cliente, string ruta, Dictionary<string, string> campos)
    {
        campos["__RequestVerificationToken"] = await TokenAsync(cliente);
        return await cliente.PostAsync(ruta, new FormUrlEncodedContent(campos));
    }

    public static async Task<HttpResponseMessage> ApiAsync(HttpClient cliente, HttpMethod metodo, string ruta,
        object? cuerpo = null, bool conToken = true)
    {
        var peticion = new HttpRequestMessage(metodo, ruta);
        if (cuerpo is not null) peticion.Content = JsonContent.Create(cuerpo);
        if (conToken) peticion.Headers.Add("X-CSRF-TOKEN", await TokenAsync(cliente));
        return await cliente.SendAsync(peticion);
    }

    // ---- Datos de apoyo: cada prueba crea los suyos para no depender de las demás ----

    public static string Correo() => $"p{Guid.NewGuid():N}@prueba.test";

    public async Task<(string Email, int Id)> UsuarioAsync(string rol)
    {
        var email = Correo();
        var id = await DbAsync(async db =>
        {
            var usuario = new User
            {
                FullName = "Persona de prueba",
                Email = email,
                City = "Medellín",
                RoleId = await db.Roles.Where(r => r.Name == rol).Select(r => r.RoleId).SingleAsync(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(Clave)
            };
            if (rol == Roles.Organizador) usuario.Organizers.Add(new Organizer { Name = "Colectivo " + email });
            db.Users.Add(usuario);
            await db.SaveChangesAsync();
            return usuario.UserId;
        });
        return (email, id);
    }

    public Task<int> CategoriaAsync() => DbAsync(db => db.Categories.Select(c => c.CategoryId).FirstAsync());

    public async Task<int> EventoAsync(int duenoId, int dias = 10, int reservados = 0, string estado = EstadoEvento.Publicado)
    {
        var categoria = await CategoriaAsync();
        return await DbAsync(async db =>
        {
            var evento = new Event
            {
                Title = "Evento de prueba",
                Description = "Descripción",
                CategoryId = categoria,
                OrganizerId = await db.Organizers.Where(o => o.OwnerUserId == duenoId).Select(o => o.OrganizerId).SingleAsync(),
                Venue = new Venue { Name = "Sala de prueba", City = "Medellín", Latitude = 6.2442m, Longitude = -75.5812m },
                StartsAt = DateTime.Now.AddDays(dias),
                Price = 12.5m,
                Capacity = 50,
                SoldCount = reservados,
                Status = estado,
                Contact = "info@example.com"
            };
            db.Events.Add(evento);
            await db.SaveChangesAsync();
            return evento.EventId;
        });
    }

    public Task<string> ReservaAsync(int usuarioId, int eventoId) => DbAsync(async db =>
    {
        var codigo = "NX-" + Guid.NewGuid().ToString("N")[..10];
        db.Reservations.Add(new Reservation { Code = codigo, UserId = usuarioId, EventId = eventoId, Quantity = 1 });
        await db.SaveChangesAsync();
        return codigo;
    });
}

// Todas las pruebas comparten la misma app y se ejecutan una tras otra.
[CollectionDefinition("nexo")]
public class NexoCollection : ICollectionFixture<NexoFactory>;
