namespace Nexo.Models.Entities;

// Reporte de un evento (RF-64).
public class Report
{
    public int ReportId { get; set; }
    public int UserId { get; set; }
    public int EventId { get; set; }
    public string Reason { get; set; } = "";
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = EstadoReporte.Pendiente;
    public User User { get; set; } = null!;
    public Event Event { get; set; } = null!;
}
