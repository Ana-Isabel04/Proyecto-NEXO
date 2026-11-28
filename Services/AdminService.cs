using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;

namespace Nexo.Services;

// Administración de la plataforma (RF-57 a RF-64).
public class AdminService(NexoDbContext db)
{
    private static readonly Expression<Func<Report, ReporteViewModel>> AReporte = r => new ReporteViewModel(
        r.ReportId, r.EventId, r.Event.Title, r.User.FullName, r.Reason, r.Description, r.Status, r.CreatedAt);

    public async Task<DashboardAdminViewModel> DashboardAsync() => new(
        await db.Users.CountAsync(),
        await db.Organizers.CountAsync(),
        await db.Organizers.CountAsync(o => !o.IsVerified),
        await db.Events.CountAsync(),
        await db.Events.CountAsync(e => e.Status == EstadoEvento.Pendiente),
        await db.Reservations.CountAsync(r => r.Status == EstadoReserva.Confirmada),
        await db.Reports.CountAsync(r => r.Status == EstadoReporte.Pendiente),
        await db.Events.OrderByDescending(e => e.CreatedAt).Take(5).Select(EventoService.ALista).ToListAsync());

    public Task<List<EventoListaViewModel>> EventosAsync(string? estado, string? q)
    {
        var consulta = db.Events.AsQueryable();
        if (!string.IsNullOrWhiteSpace(estado)) consulta = consulta.Where(e => e.Status == estado);
        if (!string.IsNullOrWhiteSpace(q))
        {
            var t = q.Trim();
            consulta = consulta.Where(e => e.Title.Contains(t) || e.Organizer.Name.Contains(t));
        }
        return consulta.OrderByDescending(e => e.CreatedAt).Take(200).Select(EventoService.ALista).ToListAsync();
    }

    public async Task<RevisionEventoViewModel?> RevisionAsync(int eventId)
    {
        var consulta = db.Events.Where(e => e.EventId == eventId);
        var lista = await consulta.Select(EventoService.ALista).FirstOrDefaultAsync();
        if (lista is null) return null;

        var e = await consulta.AsNoTracking().Include(x => x.Venue).Include(x => x.Organizer).FirstAsync();
        var reportes = await db.Reports.Where(r => r.EventId == eventId)
            .OrderByDescending(r => r.CreatedAt).Select(AReporte).ToListAsync();
        return new RevisionEventoViewModel(lista, e.Description, e.ImageUrl, e.Venue.Address, e.Venue.City,
            e.Venue.Latitude, e.Venue.Longitude, e.Price, e.ExternalUrl, e.Contact, e.Organizer.IsVerified, reportes);
    }

    // aprobar → publicado; ocultar → pendiente; devolver → borrador (RF-60).
    public async Task<Resultado> ModerarAsync(int eventId, string accion)
    {
        var evento = await db.Events.FindAsync(eventId);
        if (evento is null) return Resultado.NoEncontrado;
        if (evento.Status == EstadoEvento.Cancelado) return Resultado.Conflicto("Un evento cancelado no se puede moderar.");
        // Un borrador aún no ha sido publicado por su organizador.
        if (evento.Status == EstadoEvento.Borrador) return Resultado.Conflicto("El evento es un borrador del organizador.");

        evento.Status = accion switch
        {
            "aprobar" => EstadoEvento.Publicado,
            "ocultar" => EstadoEvento.Pendiente,
            _ => EstadoEvento.Borrador
        };
        await db.SaveChangesAsync();
        return new Resultado();
    }

    public async Task<Resultado> ReportarAsync(int userId, int eventId, CrearReporteDto dto)
    {
        if (!await db.Events.AnyAsync(e => e.EventId == eventId)) return Resultado.NoEncontrado;
        db.Reports.Add(new Report
        {
            UserId = userId,
            EventId = eventId,
            Reason = dto.Motivo.Trim(),
            Description = string.IsNullOrWhiteSpace(dto.Descripcion) ? null : dto.Descripcion.Trim()
        });
        await db.SaveChangesAsync();
        return new Resultado(201);
    }

    public Task<List<UsuarioViewModel>> UsuariosAsync(string? q)
    {
        var consulta = db.Users.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var t = q.Trim();
            consulta = consulta.Where(u => u.FullName.Contains(t) || u.Email.Contains(t));
        }
        return consulta.OrderByDescending(u => u.CreatedAt).Take(200)
            .Select(u => new UsuarioViewModel(u.UserId, u.FullName, u.Email, u.Role.Name, u.IsActive, u.CreatedAt,
                u.Organizers.Select(o => (int?)o.OrganizerId).FirstOrDefault(),
                u.Organizers.Select(o => o.Name).FirstOrDefault(),
                u.Organizers.Any(o => o.IsVerified)))
            .ToListAsync();
    }

    // Solo se gestionan cuentas de asistentes y organizadores (RF-62).
    public async Task<Resultado> CambiarActivoAsync(int userId, bool activo)
    {
        var user = await db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserId == userId);
        if (user is null) return Resultado.NoEncontrado;
        if (user.Role.Name is not (Roles.Asistente or Roles.Organizador))
            return new Resultado(403, "Las cuentas de administración y curaduría no se gestionan desde aquí.");

        user.IsActive = activo;
        await db.SaveChangesAsync();
        return new Resultado();
    }

    public async Task<Resultado> VerificarAsync(int organizerId, bool verificado)
    {
        var org = await db.Organizers.FindAsync(organizerId);
        if (org is null) return Resultado.NoEncontrado;
        org.IsVerified = verificado;
        await db.SaveChangesAsync();
        return new Resultado();
    }

    public Task<List<ReporteViewModel>> ReportesAsync() =>
        db.Reports.OrderBy(r => r.Status == EstadoReporte.Pendiente ? 0 : 1).ThenByDescending(r => r.CreatedAt)
            .Take(200).Select(AReporte).ToListAsync();

    public async Task<Resultado> CambiarReporteAsync(int reportId, string estado)
    {
        var reporte = await db.Reports.FindAsync(reportId);
        if (reporte is null) return Resultado.NoEncontrado;
        reporte.Status = estado;
        await db.SaveChangesAsync();
        return new Resultado();
    }
}
