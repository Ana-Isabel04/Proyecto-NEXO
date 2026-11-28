using System.ComponentModel.DataAnnotations;

namespace Nexo.Models.ViewModels;

// Datos de las pantallas y formularios de administración.
public record DashboardAdminViewModel(
    int Usuarios, int Organizadores, int OrganizadoresSinVerificar, int Eventos, int EventosEnRevision,
    int Reservas, int ReportesPendientes, IReadOnlyList<EventoListaViewModel> Recientes);

public record RevisionEventoViewModel(
    EventoListaViewModel Evento, string? Descripcion, string? ImagenUrl, string? Direccion, string Ciudad,
    decimal Latitud, decimal Longitud, decimal Precio, string? ExternalUrl, string? Contacto,
    bool OrganizadorVerificado, IReadOnlyList<ReporteViewModel> Reportes);

public record UsuarioViewModel(
    int UserId, string Nombre, string Email, string Rol, bool Activo, DateTime Alta,
    int? OrganizerId, string? Organizacion, bool Verificado);

public record ReporteViewModel(
    int ReportId, int EventId, string Evento, string Usuario, string Motivo, string? Descripcion, string Estado, DateTime Fecha);

public class AccionEventoDto
{
    [Required, RegularExpression("^(aprobar|devolver|ocultar)$", ErrorMessage = "Acción no válida.")]
    public string Accion { get; set; } = "";
}

public class CrearReporteDto
{
    [Required(ErrorMessage = "Indica el motivo."), StringLength(100)]
    public string Motivo { get; set; } = "";

    [StringLength(1000)]
    public string? Descripcion { get; set; }
}

public class EstadoReporteDto
{
    [Required, RegularExpression("^(pendiente|revisado|descartado)$", ErrorMessage = "Estado no válido.")]
    public string Estado { get; set; } = "";
}

public class ValorBoolDto
{
    [Required]
    public bool? Valor { get; set; }
}
