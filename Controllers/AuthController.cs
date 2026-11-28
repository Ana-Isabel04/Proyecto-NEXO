using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;
using Nexo.Services;

namespace Nexo.Controllers;

// Inicio y cierre de sesión y los tres tipos de registro.
public class AuthController(AuthService auth) : Controller
{
    [HttpGet]
    public IActionResult Login(string? returnUrl = null) =>
        User.Identity?.IsAuthenticated == true ? Inicio(User) : View(new LoginViewModel { ReturnUrl = returnUrl });

    [HttpPost]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var principal = await auth.ValidarCredencialesAsync(model.Email, model.Password);
        if (principal is null)
        {
            ModelState.AddModelError("", "Correo o contraseña incorrectos, o cuenta inactiva.");
            return View(model);
        }

        await IniciarSesionAsync(principal, model.Recordar);
        return Url.IsLocalUrl(model.ReturnUrl) ? LocalRedirect(model.ReturnUrl!) : Inicio(principal);
    }

    [HttpPost]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        return Redirect("/");
    }

    [HttpGet]
    public IActionResult AccesoDenegado() => View();

    [HttpGet]
    public IActionResult Registro() => View(new RegistroUsuarioViewModel());

    [HttpPost]
    public async Task<IActionResult> Registro(RegistroUsuarioViewModel model) =>
        ModelState.IsValid ? await CompletarAsync(await auth.RegistrarUsuarioAsync(model), model) : View(model);

    [HttpGet]
    public IActionResult RegistroOrganizador() => View(new RegistroOrganizadorViewModel());

    [HttpPost]
    public async Task<IActionResult> RegistroOrganizador(RegistroOrganizadorViewModel model) =>
        ModelState.IsValid ? await CompletarAsync(await auth.RegistrarOrganizadorAsync(model), model) : View(model);

    [HttpGet]
    public IActionResult RegistroAdmin() => View(new RegistroAdminViewModel());

    [HttpPost]
    public async Task<IActionResult> RegistroAdmin(RegistroAdminViewModel model) =>
        ModelState.IsValid ? await CompletarAsync(await auth.RegistrarAdminAsync(model), model) : View(model);

    private async Task<IActionResult> CompletarAsync(ResultadoRegistro resultado, object model)
    {
        if (resultado.Principal is null)
        {
            ModelState.AddModelError(resultado.Campo ?? "", resultado.Error ?? "No se pudo crear la cuenta.");
            return View(model);
        }
        await IniciarSesionAsync(resultado.Principal, false);
        return Inicio(resultado.Principal);
    }

    private Task IniciarSesionAsync(ClaimsPrincipal principal, bool recordar) =>
        HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal,
            new AuthenticationProperties { IsPersistent = recordar });

    // Cada rol aterriza en su propia pantalla.
    private IActionResult Inicio(ClaimsPrincipal user) =>
        user.IsInRole(Roles.Admin) ? Redirect("/Admin")
        : user.IsInRole(Roles.Curador) ? Redirect("/Admin/Eventos")
        : user.IsInRole(Roles.Organizador) ? Redirect("/Organizador")
        : user.IsInRole(Roles.Asistente) ? Redirect("/Perfil")
        : Redirect("/");
}
