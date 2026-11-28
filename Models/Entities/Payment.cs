namespace Nexo.Models.Entities;

// Tabla heredada del script SQL; NEXO no procesa pagos (RF-36).
public class Payment
{
    public int PaymentId { get; set; }
    public int ReservationId { get; set; }
    public string Method { get; set; } = "";
    public decimal Amount { get; set; }
    public string Status { get; set; } = "aprobado";
    public string? ProviderRef { get; set; }
    public DateTime CreatedAt { get; set; }
    public Reservation Reservation { get; set; } = null!;
}
