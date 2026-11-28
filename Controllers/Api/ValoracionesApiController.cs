using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;
using Nexo.Services;

namespace Nexo.Controllers.Api;

// Valoraciones del asistente.
[ApiController]
[Route("api/valoraciones")]
[Authorize(Roles = Roles.Asistente)]
public class ValoracionesApiController(ValoracionService valoraciones) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Valoraciones del usuario autenticado.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ValoracionViewModel>>> Listar() =>
        await valoraciones.DelUsuarioAsync(UserId);

    // Registra una valoración sobre un evento con reserva válida.
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Crear(CrearValoracionDto dto)
    {
        var error = await valoraciones.CrearAsync(UserId, dto);
        return error is null
            ? StatusCode(StatusCodes.Status201Created, new { mensaje = "Valoración registrada." })
            : Conflict(new { mensaje = error });
    }
}
