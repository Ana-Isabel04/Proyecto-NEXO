namespace Nexo.Models.Entities;

// Evento publicado por un organizador.
public class Event
{
    public int EventId { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public string? Tag { get; set; }
    public string? ImageUrl { get; set; }
    public int CategoryId { get; set; }
    public int VenueId { get; set; }
    public int OrganizerId { get; set; }
    public DateTime StartsAt { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public int SoldCount { get; set; }
    public string? ExternalUrl { get; set; }
    public string Status { get; set; } = EstadoEvento.Publicado;
    public DateTime CreatedAt { get; set; }
    // Columna calculada (Capacity - SoldCount).
    public int AvailableSeats { get; private set; }
    // Contacto del evento (RF-47).
    public string? Contact { get; set; }

    public Category Category { get; set; } = null!;
    public Venue Venue { get; set; } = null!;
    public Organizer Organizer { get; set; } = null!;
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
