using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;

namespace Nexo.Controllers.Api.Visitante;

// Catálogo público: búsqueda, filtros, orden y paginación (solo eventos publicados).
[Route("api/events"), AllowAnonymous]
public class EventosPublicosApiController(NexoDbContext db) : VisitanteApiBase
{
    [HttpGet]
    public async Task<IActionResult> Listar(string? q, string? cat, decimal? maxPrice, string? sort, int? page, int? limit)
    {
        var pg = Math.Max(1, page ?? 1);
        var lim = Math.Clamp(limit ?? 12, 1, 100);

        var consulta = db.Events.AsNoTracking().Where(e => e.Status == EstadoEvento.Publicado);
        if (!string.IsNullOrWhiteSpace(q))
        {
            // Búsqueda sin distinguir mayúsculas ni tildes; se escapan los comodines de LIKE.
            var like = "%" + q.Trim().Replace("[", "[[]").Replace("%", "[%]").Replace("_", "[_]") + "%";
            const string ci = "Latin1_General_CI_AI";
            consulta = consulta.Where(e =>
                EF.Functions.Like(EF.Functions.Collate(e.Title, ci), like) ||
                EF.Functions.Like(EF.Functions.Collate(e.Venue.Name, ci), like) ||
                EF.Functions.Like(EF.Functions.Collate(e.Category.Name, ci), like));
        }
        if (!string.IsNullOrWhiteSpace(cat)) consulta = consulta.Where(e => e.Category.Name == cat);
        if (maxPrice is not null) consulta = consulta.Where(e => e.Price <= maxPrice);

        var total = await consulta.CountAsync();
        var ordenada = sort == "precio"
            ? consulta.OrderBy(e => e.Price).ThenBy(e => e.StartsAt)
            : consulta.OrderBy(e => e.StartsAt);
        var items = await ordenada.Skip((pg - 1) * lim).Take(lim).Select(EventoPublicoDto.Proyeccion).ToListAsync();
        return Ok(new { total, items });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Detalle(int id)
    {
        var e = await db.Events.AsNoTracking()
            .Where(x => x.EventId == id && x.Status == EstadoEvento.Publicado)
            .Select(EventoPublicoDto.Proyeccion).FirstOrDefaultAsync();
        return e is null ? Err(404, "Evento no encontrado") : Ok(e);
    }
}
