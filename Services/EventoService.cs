using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;
using Nexo.Models.ViewModels;

namespace Nexo.Services;

// Resultado de una operación; Codigo es el estado HTTP que corresponde.
public record Resultado(int Codigo = 200, string? Error = null, int? Id = null)
{
    public bool Ok => Error is null;
    public static Resultado NoEncontrado => new(404, "No se encontró el registro.");
    public static Resultado Conflicto(string error) => new(409, error);
}

// Gestión de eventos del organizador (RF-41 a RF-54). Toda consulta filtra por el dueño.
public class EventoService(NexoDbContext db)
{
    // Proyección compartida por las listas de organizador y administración.
    public static readonly Expression<Func<Event, EventoListaViewModel>> ALista = e => new EventoListaViewModel(
        e.EventId, e.Title, e.StartsAt, e.Venue.Name, e.Category.Name, e.Organizer.Name, e.Status,
        e.Capacity, e.SoldCount, e.AvailableSeats, e.Reservations.Count(r => r.Status == EstadoReserva.Confirmada), e.ImageUrl);

    private IQueryable<Event> Propios(int userId) => db.Events.Where(e => e.Organizer.OwnerUserId == userId);

    public Task<List<EventoListaViewModel>> ListarAsync(int userId) =>
        Propios(userId).OrderByDescending(e => e.StartsAt).Select(ALista).ToListAsync();

    public async Task<DashboardOrganizadorViewModel?> DashboardAsync(int userId, string? filtro)
    {
        var org = await db.Organizers.AsNoTracking().FirstOrDefaultAsync(o => o.OwnerUserId == userId);
        if (org is null) return null;

        var todos = await ListarAsync(userId);
        var vigentes = todos.Where(e => e.Estado == EstadoEvento.Publicado && !e.Finalizado).ToList();
        var visibles = filtro switch
        {
            "publicados" => vigentes,
            "borradores" => todos.Where(e => e.Estado == EstadoEvento.Borrador).ToList(),
            "revision" => todos.Where(e => e.Estado == EstadoEvento.Pendiente).ToList(),
            "cancelados" => todos.Where(e => e.Estado == EstadoEvento.Cancelado).ToList(),
            "finalizados" => todos.Where(e => e.Finalizado).ToList(),
            _ => todos
        };
        return new DashboardOrganizadorViewModel(org.Name, org.IsVerified, vigentes.Count,
            todos.Where(e => e.Estado != EstadoEvento.Cancelado).Sum(e => e.Reservados),
            vigentes.Sum(e => e.Disponibles), visibles, filtro);
    }

    public async Task<EventoFormViewModel> FormularioNuevoAsync() =>
        new() { Categorias = await db.Categories.AsNoTracking().OrderBy(c => c.Name).ToListAsync() };

    public async Task<EventoFormViewModel?> FormularioEdicionAsync(int userId, int eventId)
    {
        var e = await Propios(userId).AsNoTracking().Include(x => x.Venue).FirstOrDefaultAsync(x => x.EventId == eventId);
        if (e is null) return null;

        var vm = await FormularioNuevoAsync();
        vm.EventId = e.EventId;
        vm.Estado = e.Status;
        vm.Reservados = e.SoldCount;
        vm.Datos = new EventoFormDto
        {
            Title = e.Title, Description = e.Description ?? "", CategoryId = e.CategoryId, StartsAt = e.StartsAt,
            VenueName = e.Venue.Name, Address = e.Venue.Address, City = e.Venue.City,
            Latitude = e.Venue.Latitude, Longitude = e.Venue.Longitude, Price = e.Price, Capacity = e.Capacity,
            ImageUrl = e.ImageUrl, ExternalUrl = e.ExternalUrl, Contact = e.Contact ?? ""
        };
        return vm;
    }

    public async Task<Resultado> CrearAsync(int userId, EventoFormDto dto)
    {
        var organizerId = await db.Organizers.Where(o => o.OwnerUserId == userId)
            .Select(o => (int?)o.OrganizerId).FirstOrDefaultAsync();
        if (organizerId is null) return new Resultado(403, "Tu cuenta no tiene un perfil de organizador.");

        var error = await ValidarAsync(dto);
        if (error is not null) return error;

        var evento = new Event
        {
            OrganizerId = organizerId.Value,
            Status = dto.Publicar ? EstadoEvento.Publicado : EstadoEvento.Borrador,
            Venue = new Venue()
        };
        Aplicar(evento, dto);
        db.Events.Add(evento);
        await db.SaveChangesAsync();
        return new Resultado(201, Id: evento.EventId);
    }

    public async Task<Resultado> ActualizarAsync(int userId, int eventId, EventoFormDto dto)
    {
        // Un evento ajeno se responde como inexistente (RF-54).
        var evento = await Propios(userId).Include(e => e.Venue).FirstOrDefaultAsync(e => e.EventId == eventId);
        if (evento is null) return Resultado.NoEncontrado;

        var bloqueo = Bloqueo(evento) ?? await ValidarAsync(dto);
        if (bloqueo is not null) return bloqueo;
        if (dto.Capacity < evento.SoldCount)
            return Resultado.Conflicto($"La capacidad no puede ser menor que los {evento.SoldCount} cupos ya reservados.");

        // Si otro evento comparte el recinto, no se le cambia la ubicación.
        if (await db.Events.AnyAsync(e => e.VenueId == evento.VenueId && e.EventId != eventId))
            evento.Venue = new Venue { IsAccessible = evento.Venue.IsAccessible };

        Aplicar(evento, dto);
        // Un evento oculto o en revisión solo lo publica la administración.
        if (evento.Status != EstadoEvento.Pendiente)
        {
            if (dto.Publicar) evento.Status = EstadoEvento.Publicado;
            else if (evento.SoldCount == 0) evento.Status = EstadoEvento.Borrador;
        }
        return await GuardarAsync(eventId);
    }

    public async Task<Resultado> CancelarAsync(int userId, int eventId)
    {
        var evento = await Propios(userId).FirstOrDefaultAsync(e => e.EventId == eventId);
        if (evento is null) return Resultado.NoEncontrado;
        var bloqueo = Bloqueo(evento);
        if (bloqueo is not null) return bloqueo;

        // En una transacción: primero el evento (deja de admitir reservas) y luego sus reservas.
        await using var tx = await db.Database.BeginTransactionAsync();
        evento.Status = EstadoEvento.Cancelado;
        await db.SaveChangesAsync();

        var confirmadas = db.Reservations.Where(r => r.EventId == eventId && r.Status == EstadoReserva.Confirmada);
        var cupos = await confirmadas.SumAsync(r => (int)r.Quantity);
        await confirmadas.ExecuteUpdateAsync(s => s
            .SetProperty(r => r.Status, EstadoReserva.Cancelada)
            .SetProperty(r => r.CancelledAt, DateTime.UtcNow));
        await db.Events.Where(e => e.EventId == eventId)
            .ExecuteUpdateAsync(s => s.SetProperty(e => e.SoldCount, e => e.SoldCount - cupos));
        await tx.CommitAsync();
        return new Resultado(Id: eventId);
    }

    // Un evento cancelado o ya realizado no admite cambios.
    private static Resultado? Bloqueo(Event e) =>
        e.Status == EstadoEvento.Cancelado ? Resultado.Conflicto("El evento está cancelado y ya no admite cambios.")
        : e.StartsAt <= DateTime.Now ? Resultado.Conflicto("El evento ya se realizó y no admite cambios.")
        : null;

    private async Task<Resultado?> ValidarAsync(EventoFormDto dto)
    {
        if (dto.StartsAt <= DateTime.Now) return new Resultado(400, "La fecha y hora deben ser futuras.");
        if (!await db.Categories.AnyAsync(c => c.CategoryId == dto.CategoryId))
            return new Resultado(400, "La categoría no existe.");
        return null;
    }

    private async Task<Resultado> GuardarAsync(int id)
    {
        try
        {
            await db.SaveChangesAsync();
            return new Resultado(Id: id);
        }
        catch (DbUpdateException)
        {
            // CK_Events_Sold: entró una reserva mientras se reducía la capacidad.
            return Resultado.Conflicto("No se pudo guardar: revisa los cupos reservados e inténtalo de nuevo.");
        }
    }

    // Copia el formulario a la entidad y a su recinto.
    private static void Aplicar(Event e, EventoFormDto d)
    {
        static string? Limpiar(string? s) => string.IsNullOrWhiteSpace(s) ? null : s.Trim();

        e.Title = d.Title.Trim();
        e.Description = d.Description.Trim();
        e.CategoryId = d.CategoryId!.Value;
        e.StartsAt = d.StartsAt!.Value;
        e.Price = Math.Round(d.Price!.Value, 2);
        e.Capacity = d.Capacity!.Value;
        e.ImageUrl = Limpiar(d.ImageUrl);
        e.ExternalUrl = Limpiar(d.ExternalUrl);
        e.Contact = d.Contact.Trim();
        e.Venue.Name = d.VenueName.Trim();
        e.Venue.Address = Limpiar(d.Address);
        e.Venue.City = d.City.Trim();
        e.Venue.Latitude = Math.Round(d.Latitude!.Value, 6);
        e.Venue.Longitude = Math.Round(d.Longitude!.Value, 6);
    }
}
