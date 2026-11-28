using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;
using Nexo.Services;

namespace Nexo.Controllers.Api;

// Consulta de reservas para el organizador.
[Route("api/reservas")]
[Authorize(Roles = Roles.Organizador)]
public class ReservasApiController(ReservaService reservas) : ApiBase
{
    // Reservas y cupos de un evento propio.
    [HttpGet("evento/{eventId:int}")]
    public async Task<ActionResult<ReservasEventoViewModel>> DeEvento(int eventId)
    {
        var vm = await reservas.DeEventoAsync(UserId, eventId);
        return vm is null ? NotFound() : vm;
    }
}
