using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.ViewModels;
using Nexo.Services;

namespace Nexo.Controllers.Api.Visitante;

public record RegistroReq(string? Name, string? Email, string? Password, string? City);
public record LoginReq(string? Email, string? Password, string? Role);

// Sesión del cliente React: misma cookie que usan las vistas MVC (una sola sesión para todo NEXO).
[Route("api")]
public class SesionApiController(AuthService auth, IAntiforgery antiforgery) : VisitanteApiBase
{
    // Token CSRF para fetch(): el cliente lo envía en X-CSRF-TOKEN en cada POST.
    [HttpGet("csrf"), AllowAnonymous]
    public IActionResult Csrf()
    {
        Response.Headers.CacheControl = "no-store";
        return Ok(new { token = antiforgery.GetAndStoreTokens(HttpContext).RequestToken });
    }

    [HttpPost("auth/register"), AllowAnonymous]
    public async Task<IActionResult> Register(RegistroReq r)
    {
        var m = new RegistroUsuarioViewModel
        {
            FullName = (r.Name ?? "").Trim(),
            Email = (r.Email ?? "").Trim(),
            Password = r.Password ?? "",
            City = string.IsNullOrWhiteSpace(r.City) ? "Envigado" : r.City.Trim(),
            AceptaTerminos = true
        };
        var errores = new List<ValidationResult>();
        if (!Validator.TryValidateObject(m, new ValidationContext(m), errores, validateAllProperties: true))
            return Err(400, errores[0].ErrorMessage ?? "Datos inválidos");

        var res = await auth.RegistrarUsuarioAsync(m);
        if (res.Principal is null) return Err(409, res.Error ?? "Ese correo ya está registrado");

        await EntrarAsync(res.Principal);
        return StatusCode(201, new { user = Usuario(res.Principal) });
    }

    [HttpPost("auth/login"), AllowAnonymous]
    public async Task<IActionResult> Login(LoginReq r)
    {
        var principal = await auth.ValidarCredencialesAsync(r.Email ?? "", r.Password ?? "");
        if (principal is null) return Err(401, "Correo o contraseña incorrectos");

        var rol = principal.FindFirstValue(ClaimTypes.Role)!;
        if (!string.IsNullOrEmpty(r.Role) && rol != r.Role) return Err(403, $"Esta cuenta es de tipo \"{rol}\"");

        await EntrarAsync(principal);
        return Ok(new { user = Usuario(principal) });
    }

    [HttpPost("auth/logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return NoContent();
    }

    [HttpGet("auth/me"), Authorize]
    public IActionResult Me() => Ok(Usuario(User));

    private Task EntrarAsync(ClaimsPrincipal principal) =>
        HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal,
            new AuthenticationProperties { IsPersistent = false });

    private static object Usuario(ClaimsPrincipal p) => new
    {
        id = int.Parse(p.FindFirstValue(ClaimTypes.NameIdentifier)!),
        name = p.FindFirstValue(ClaimTypes.Name),
        email = p.FindFirstValue(ClaimTypes.Email),
        role = p.FindFirstValue(ClaimTypes.Role)
    };
}
