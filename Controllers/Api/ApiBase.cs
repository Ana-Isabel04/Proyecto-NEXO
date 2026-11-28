using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Nexo.Services;

namespace Nexo.Controllers.Api;

// Base de las APIs: usuario actual y respuesta uniforme.
[ApiController]
public abstract class ApiBase : ControllerBase
{
    protected int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    protected IActionResult Responder(Resultado r) =>
        StatusCode(r.Codigo, r.Ok ? new { mensaje = "Listo.", id = r.Id } : new { mensaje = r.Error!, id = r.Id });
}
