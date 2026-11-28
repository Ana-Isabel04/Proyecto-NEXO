using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;

namespace Nexo.Services;

// Consulta de reservas (RF-55, RF-56, RF-63). Crear reservas pertenece a RF-24 a RF-36.
public class ReservaService(NexoDbContext db)
{
    private static readonly Expression<Func<Reservation, ReservaViewModel>> AVista = r => new ReservaViewModel(
        r.Code, r.User.FullName, r.User.Email, r.EventId, r.Event.Title, r.Quantity, r.Total, r.Status, r.CreatedAt);

    // null si el evento no existe o no es del organizador.
    public async Task<ReservasEventoViewModel?> DeEventoAsync(int ownerUserId, int eventId)
    {
        var propio = db.Events.Where(e => e.EventId == eventId && e.Organizer.OwnerUserId == ownerUserId);
        var evento = await propio.Select(EventoService.ALista).FirstOrDefaultAsync();
        if (evento is null) return null;

        var url = await propio.Select(e => e.ExternalUrl).FirstAsync();
        var reservas = await db.Reservations.Where(r => r.EventId == eventId)
            .OrderByDescending(r => r.CreatedAt).Select(AVista).ToListAsync();
        return new ReservasEventoViewModel(evento, url, reservas);
    }

    // Las 200 reservas más recientes, con búsqueda por código, usuario o evento.
    public Task<List<ReservaViewModel>> TodasAsync(string? q)
    {
        var consulta = db.Reservations.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var t = q.Trim();
            consulta = consulta.Where(r => r.Code.Contains(t) || r.User.Email.Contains(t)
                || r.User.FullName.Contains(t) || r.Event.Title.Contains(t));
        }
        return consulta.OrderByDescending(r => r.CreatedAt).Take(200).Select(AVista).ToListAsync();
    }
}
