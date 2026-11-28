namespace Nexo.Models.Entities;

// Usuario y evento se obtienen a través de la reserva (1 a 1).
public class Review
{
    public int ReviewId { get; set; }
    public int ReservationId { get; set; }
    public byte Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public Reservation Reservation { get; set; } = null!;
}
