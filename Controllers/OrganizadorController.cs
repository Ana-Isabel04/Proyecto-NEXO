using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.Entities;
using Nexo.Services;

namespace Nexo.Controllers;

// Pantallas del organizador. Los datos los guarda la API con fetch().
[Authorize(Roles = Roles.Organizador)]
public class OrganizadorController(EventoService eventos, ReservaService reservas) : Controller
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("Organizador")]
    public async Task<IActionResult> Index(string? filtro)
    {
        var vm = await eventos.DashboardAsync(UserId, filtro);
        return vm is null ? Forbid() : View("Dashboard", vm);
    }

    [HttpGet("Organizador/CrearEvento")]
    public async Task<IActionResult> CrearEvento() => View(await eventos.FormularioNuevoAsync());

    [HttpGet("Organizador/EditarEvento/{id:int}")]
    public async Task<IActionResult> EditarEvento(int id)
    {
        var vm = await eventos.FormularioEdicionAsync(UserId, id);
        return vm is null ? NotFound() : View(vm);
    }

    [HttpGet("Organizador/Reservas/{id:int?}")]
    public async Task<IActionResult> Reservas(int? id)
    {
        // Sin id: elegir primero el evento.
        if (id is null) return View("ElegirEvento", await eventos.ListarAsync(UserId));
        var vm = await reservas.DeEventoAsync(UserId, id.Value);
        return vm is null ? NotFound() : View("ReservasEvento", vm);
    }
}
