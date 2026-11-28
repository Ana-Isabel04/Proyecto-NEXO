using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;

namespace Nexo.Services;

public record ResultadoRegistro(ClaimsPrincipal? Principal, string? Campo = null, string? Error = null);

// Credenciales, creación de cuentas y claims de la cookie.
public class AuthService(NexoDbContext db, IConfiguration config)
{
    // Devuelve null si el correo, la contraseña o el estado de la cuenta no son válidos (RF-02).
    public async Task<ClaimsPrincipal?> ValidarCredencialesAsync(string email, string password)
    {
        var normalizado = Normalizar(email);
        var user = await db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == normalizado);
        if (user is null || !user.IsActive || !Verificar(password, user.PasswordHash)) return null;

        user.LastLoginAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return CrearPrincipal(user, user.Role.Name);
    }

    public Task<ResultadoRegistro> RegistrarUsuarioAsync(RegistroUsuarioViewModel m) =>
        CrearCuentaAsync(m, Roles.Asistente, m.City);

    public Task<ResultadoRegistro> RegistrarOrganizadorAsync(RegistroOrganizadorViewModel m) =>
        CrearCuentaAsync(m, Roles.Organizador, m.City, user => user.Organizers.Add(new Organizer
        {
            Name = m.OrganizationName.Trim(),
            Description = string.IsNullOrWhiteSpace(m.Description) ? null : m.Description.Trim()
        }));

    public Task<ResultadoRegistro> RegistrarAdminAsync(RegistroAdminViewModel m)
    {
        // Sin código configurado, el alta de administradores queda deshabilitada.
        var esperado = config["Registro:CodigoInvitacionAdmin"];
        if (string.IsNullOrWhiteSpace(esperado) || !CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(esperado), Encoding.UTF8.GetBytes(m.CodigoInvitacion.Trim())))
            return Task.FromResult(new ResultadoRegistro(null, nameof(m.CodigoInvitacion), "Código de invitación no válido."));

        return CrearCuentaAsync(m, Roles.Admin, null);
    }

    // Parte común a todos los registros: correo único y contraseña con BCrypt.
    private async Task<ResultadoRegistro> CrearCuentaAsync(CuentaViewModel m, string rol, string? city, Action<User>? completar = null)
    {
        var email = Normalizar(m.Email);
        var duplicado = new ResultadoRegistro(null, nameof(m.Email), "Ya existe una cuenta con este correo.");
        if (await db.Users.AnyAsync(u => u.Email == email)) return duplicado;

        var user = new User
        {
            FullName = m.FullName.Trim(),
            Email = email,
            City = city?.Trim(),
            RoleId = await db.Roles.Where(r => r.Name == rol).Select(r => r.RoleId).SingleAsync(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(m.Password)
        };
        completar?.Invoke(user);
        db.Users.Add(user);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException e) when (e.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return duplicado;
        }
        return new ResultadoRegistro(CrearPrincipal(user, rol));
    }

    private static ClaimsPrincipal CrearPrincipal(User user, string rol) => new(new ClaimsIdentity(
        new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, rol)
        }, CookieAuthenticationDefaults.AuthenticationScheme));

    private static string Normalizar(string email) => email.Trim().ToLowerInvariant();

    private static bool Verificar(string password, string hash)
    {
        try { return BCrypt.Net.BCrypt.Verify(password, hash); }
        catch (BCrypt.Net.SaltParseException) { return false; }
    }
}
