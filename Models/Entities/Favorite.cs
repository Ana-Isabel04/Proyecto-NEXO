namespace Nexo.Models.Entities;

// Eventos marcados como favoritos (tabla del script).
public class Favorite
{
    public int UserId { get; set; }
    public int EventId { get; set; }
    public DateTime CreatedAt { get; set; }
    public User User { get; set; } = null!;
    public Event Event { get; set; } = null!;
}
