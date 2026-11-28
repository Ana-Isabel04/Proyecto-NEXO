using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;

namespace Nexo.Services;

// Junta los datos que muestra el perfil del usuario.
public class PerfilService(NexoDbContext db, ValoracionService valoraciones)
{
    public async Task<PerfilViewModel?> ObtenerAsync(int userId)
    {
        var user = await db.Users.AsNoTracking().Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);
        if (user is null) return null;

        var ahora = DateTime.Now;
        var asistidos = await db.Reservations
            .Where(r => r.UserId == userId && r.Status == EstadoReserva.Confirmada
                        && r.Event.Status != EstadoEvento.Cancelado && r.Event.StartsAt <= ahora)
            .Select(r => r.EventId).Distinct().CountAsync();

        return new PerfilViewModel(user.FullName, user.Email, user.City, user.Role.Name, user.CreatedAt, asistidos,
            await valoraciones.PendientesAsync(userId), await valoraciones.DelUsuarioAsync(userId));
    }
}
