using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;

namespace Nexo.Services;

// Valoraciones (RF-38 a RF-40). Solo se valora un evento ya realizado con reserva confirmada.
public class ValoracionService(NexoDbContext db)
{
    private IQueryable<Reservation> ReservasValorables(int userId)
    {
        var ahora = DateTime.Now; // StartsAt es hora local del recinto.
        return db.Reservations.Where(r =>
            r.UserId == userId
            && r.Status == EstadoReserva.Confirmada
            && r.Event.Status != EstadoEvento.Cancelado
            && r.Event.StartsAt <= ahora
            && !db.Reviews.Any(v => v.Reservation.UserId == userId && v.Reservation.EventId == r.EventId));
    }

    public async Task<List<EventoResumenViewModel>> PendientesAsync(int userId, int? eventId = null)
    {
        var filas = await ReservasValorables(userId)
            .Where(r => eventId == null || r.EventId == eventId)
            .OrderByDescending(r => r.Event.StartsAt).ThenBy(r => r.ReservationId)
            .Select(r => new EventoResumenViewModel(r.EventId, r.Event.Title, r.Event.StartsAt,
                r.Event.Venue.Name, r.Event.Category.Name, r.Event.ImageUrl, r.Code))
            .ToListAsync();
        return filas.DistinctBy(f => f.EventId).ToList();
    }

    public Task<List<ValoracionViewModel>> DelUsuarioAsync(int userId) =>
        db.Reviews.Where(v => v.Reservation.UserId == userId)
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new ValoracionViewModel(v.ReviewId, v.Reservation.EventId, v.Reservation.Event.Title,
                v.Rating, v.Comment, v.CreatedAt))
            .ToListAsync();

    // Devuelve null si se guardó, o el motivo del rechazo.
    public async Task<string?> CrearAsync(int userId, CrearValoracionDto dto)
    {
        const string rechazo = "Solo puedes valorar una vez los eventos ya realizados en los que tuviste una reserva confirmada.";

        // Siempre la misma reserva: el índice único impide duplicados por envíos simultáneos.
        var reservationId = await ReservasValorables(userId)
            .Where(r => r.EventId == dto.EventId)
            .OrderBy(r => r.ReservationId)
            .Select(r => (int?)r.ReservationId)
            .FirstOrDefaultAsync();
        if (reservationId is null) return rechazo;

        db.Reviews.Add(new Review
        {
            ReservationId = reservationId.Value,
            Rating = (byte)dto.Calificacion,
            Comment = string.IsNullOrWhiteSpace(dto.Comentario) ? null : dto.Comentario.Trim()
        });
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException e) when (e.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return rechazo;
        }
        return null;
    }
}
