using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;
using Nexo.Services;

namespace Nexo.Controllers.Api;

// Acciones de moderación, cuentas y reportes.
[Route("api/admin")]
[Authorize(Roles = Roles.Admin + "," + Roles.Curador)]
public class AdminApiController(AdminService admin) : ApiBase
{
    [HttpPost("eventos/{id:int}/moderar")]
    public async Task<IActionResult> Moderar(int id, AccionEventoDto dto) =>
        Responder(await admin.ModerarAsync(id, dto.Accion));

    [HttpPost("eventos/{id:int}/reportes")]
    public async Task<IActionResult> Reportar(int id, CrearReporteDto dto) =>
        Responder(await admin.ReportarAsync(UserId, id, dto));

    [HttpPut("usuarios/{id:int}/activo"), Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Activo(int id, ValorBoolDto dto) =>
        Responder(await admin.CambiarActivoAsync(id, dto.Valor!.Value));

    [HttpPut("organizadores/{id:int}/verificado"), Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Verificado(int id, ValorBoolDto dto) =>
        Responder(await admin.VerificarAsync(id, dto.Valor!.Value));

    [HttpPut("reportes/{id:int}"), Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Reporte(int id, EstadoReporteDto dto) =>
        Responder(await admin.CambiarReporteAsync(id, dto.Estado));
}
