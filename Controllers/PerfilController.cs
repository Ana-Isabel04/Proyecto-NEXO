using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.Entities;
using Nexo.Services;

namespace Nexo.Controllers;

// Perfil del asistente y pantalla para valorar un evento.
[Authorize(Roles = Roles.Asistente)]
public class PerfilController(PerfilService perfiles, ValoracionService valoraciones) : Controller
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public async Task<IActionResult> Index()
    {
        var perfil = await perfiles.ObtenerAsync(UserId);
        return perfil is null ? NotFound() : View(perfil);
    }

    [HttpGet("Perfil/Valorar/{eventId:int}")]
    public async Task<IActionResult> Valorar(int eventId) =>
        View((await valoraciones.PendientesAsync(UserId, eventId)).FirstOrDefault());
}
