using System.Linq.Expressions;
using Nexo.Models.Entities;

namespace Nexo.Controllers.Api.Visitante;

// Forma JSON que espera el cliente React (camelCase por defecto).
public sealed record EventoPublicoDto(
    int Id, string Title, string Cat, string Tag, string Venue, string Desc, string Img,
    decimal Lat, decimal Lng, DateTime Date, decimal Price, int Cap, int Sold, string? PayUrl, int Left,
    string Organizer, string Contact, string Status)
{
    public static readonly Expression<Func<Event, EventoPublicoDto>> Proyeccion = e => new EventoPublicoDto(
        e.EventId, e.Title, e.Category.Name, e.Tag ?? "", e.Venue.Name, e.Description ?? "", e.ImageUrl ?? "",
        e.Venue.Latitude, e.Venue.Longitude, e.StartsAt, e.Price, e.Capacity, e.SoldCount, e.ExternalUrl,
        e.Capacity - e.SoldCount, e.Organizer.Name, e.Contact ?? "",
        e.Status == EstadoEvento.Cancelado ? "cancelado"
            : e.StartsAt <= DateTime.Now ? "finalizado"
            : e.SoldCount >= e.Capacity ? "agotado"
            : "disponible");

    private static readonly Func<Event, EventoPublicoDto> Compilada = Proyeccion.Compile();
    public static EventoPublicoDto De(Event e) => Compilada(e);
}

public sealed record ReservaDto(
    string Code, int EventId, int UserId, int Qty, string Payment, decimal Total, string Status,
    DateTime CreatedAt, EventoPublicoDto? Event)
{
    // Requiere cargar Payments, Event, Event.Category, Event.Venue y Event.Organizer.
    public static ReservaDto De(Reservation r) => new(
        r.Code, r.EventId, r.UserId, r.Quantity, r.Payments.Select(p => p.Method).FirstOrDefault() ?? "apple-pay",
        r.Total, r.Status, r.CreatedAt, EventoPublicoDto.De(r.Event));
}
