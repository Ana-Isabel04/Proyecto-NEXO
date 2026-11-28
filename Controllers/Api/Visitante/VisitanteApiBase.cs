using Microsoft.AspNetCore.Mvc;

namespace Nexo.Controllers.Api.Visitante;

// Base de la API del visitante/asistente (consumida por el cliente React en /app).
// Los errores usan { error } para que el cliente muestre el mensaje tal cual.
public abstract class VisitanteApiBase : ApiBase
{
    protected IActionResult Err(int codigo, string mensaje) => StatusCode(codigo, new { error = mensaje });
}
