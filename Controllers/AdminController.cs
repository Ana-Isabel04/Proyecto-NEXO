using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.Entities;
using Nexo.Services;

namespace Nexo.Controllers;

// Curaduría solo accede a eventos; el resto del panel es exclusivo de admin (RF-65).
[Authorize(Roles = Roles.Admin + "," + Roles.Curador)]
public class AdminController(AdminService admin, ReservaService reservas) : Controller
{
    [HttpGet("Admin"), Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Index() => View("Dashboard", await admin.DashboardAsync());

    [HttpGet("Admin/Eventos")]
    public async Task<IActionResult> Eventos(string? estado, string? q)
    {
        ViewData["Estado"] = estado;
        ViewData["Q"] = q;
        return View(await admin.EventosAsync(estado, q));
    }

    [HttpGet("Admin/Eventos/{id:int}")]
    public async Task<IActionResult> Revision(int id)
    {
        var vm = await admin.RevisionAsync(id);
        return vm is null ? NotFound() : View("RevisionEvento", vm);
    }

    [HttpGet("Admin/Usuarios"), Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Usuarios(string? q)
    {
        ViewData["Q"] = q;
        return View(await admin.UsuariosAsync(q));
    }

    [HttpGet("Admin/Reservas"), Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Reservas(string? q)
    {
        ViewData["Q"] = q;
        return View(await reservas.TodasAsync(q));
    }

    [HttpGet("Admin/Reportes"), Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Reportes() => View(await admin.ReportesAsync());
}
