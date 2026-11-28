namespace Nexo.Models.Entities;

// Reserva de cupos de un usuario en un evento.
public class Reservation
{
    public int ReservationId { get; set; }
    public string Code { get; set; } = "";
    public int UserId { get; set; }
    public int EventId { get; set; }
    public byte Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
    public decimal ServiceFee { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = EstadoReserva.Confirmada;
    public DateTime CreatedAt { get; set; }
    public DateTime? CancelledAt { get; set; }

    public User User { get; set; } = null!;
    public Event Event { get; set; } = null!;
    public Review? Review { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
