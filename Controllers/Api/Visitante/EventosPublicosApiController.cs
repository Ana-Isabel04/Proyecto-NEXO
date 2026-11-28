using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;

namespace Nexo.Controllers.Api.Visitante;

// Catálogo público: búsqueda, filtros, orden y paginación (publicados que aún no han pasado).
[Route("api/events"), AllowAnonymous]
public class EventosPublicosApiController(NexoDbContext db) : VisitanteApiBase
{
    [HttpGet]
    public async Task<IActionResult> Listar(string? q, string? cat, decimal? maxPrice, string? sort, int? page, int? limit,
        DateTime? date, int? hour, bool? available, double? lat, double? lng, double? radius)
    {
        var pg = Math.Max(1, page ?? 1);
        var lim = Math.Clamp(limit ?? 12, 1, 100);

        var consulta = db.Events.AsNoTracking()
            .Where(e => e.Status == EstadoEvento.Publicado && e.StartsAt > DateTime.Now);
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

        if (date is not null)
        {
            var dia = date.Value.Date;
            var siguiente = dia.AddDays(1);
            consulta = consulta.Where(e => e.StartsAt >= dia && e.StartsAt < siguiente);
        }
        // Hora mínima de inicio (0 a 23).
        if (hour is not null) consulta = consulta.Where(e => e.StartsAt.Hour >= hour);
        if (available == true) consulta = consulta.Where(e => e.SoldCount < e.Capacity);
        // Distancia en km al punto de referencia (fórmula de haversine, resuelta en SQL).
        if (lat is not null && lng is not null && radius > 0)
        {
            const double rad = Math.PI / 180, diametro = 12742;
            double lat0 = lat.Value * rad, lng0 = lng.Value * rad, max = radius.Value;
            consulta = consulta.Where(e => diametro * Math.Asin(Math.Sqrt(
                Math.Pow(Math.Sin(((double)e.Venue.Latitude * rad - lat0) / 2), 2) +
                Math.Cos(lat0) * Math.Cos((double)e.Venue.Latitude * rad) *
                Math.Pow(Math.Sin(((double)e.Venue.Longitude * rad - lng0) / 2), 2))) <= max);
        }

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
            .Where(x => x.EventId == id
                && (x.Status == EstadoEvento.Publicado || x.Status == EstadoEvento.Cancelado))
            .Select(EventoPublicoDto.Proyeccion).FirstOrDefaultAsync();
        return e is null ? Err(404, "Evento no encontrado") : Ok(e);
    }
}
