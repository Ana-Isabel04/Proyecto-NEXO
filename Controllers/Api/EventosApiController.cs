using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;
using Nexo.Services;

namespace Nexo.Controllers.Api;

// Alta, edición y cancelación de eventos propios.
[Route("api/eventos")]
[Authorize(Roles = Roles.Organizador)]
public class EventosApiController(EventoService eventos) : ApiBase
{
    // Eventos del organizador autenticado.
    [HttpGet("mios")]
    public async Task<ActionResult<IEnumerable<EventoListaViewModel>>> Mios() => await eventos.ListarAsync(UserId);

    [HttpPost]
    public async Task<IActionResult> Crear(EventoFormDto dto) => Responder(await eventos.CrearAsync(UserId, dto));

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Actualizar(int id, EventoFormDto dto) =>
        Responder(await eventos.ActualizarAsync(UserId, id, dto));

    [HttpPost("{id:int}/cancelar")]
    public async Task<IActionResult> Cancelar(int id) => Responder(await eventos.CancelarAsync(UserId, id));
}
