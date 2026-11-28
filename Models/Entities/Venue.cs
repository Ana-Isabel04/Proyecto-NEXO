namespace Nexo.Models.Entities;

// Lugar del evento y sus coordenadas para el mapa.
public class Venue
{
    public int VenueId { get; set; }
    public string Name { get; set; } = "";
    public string? Address { get; set; }
    public string City { get; set; } = "Madrid";
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public bool IsAccessible { get; set; }
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
