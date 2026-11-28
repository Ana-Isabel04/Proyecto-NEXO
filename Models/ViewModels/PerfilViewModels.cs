using System.ComponentModel.DataAnnotations;

namespace Nexo.Models.ViewModels;

// Datos del perfil y de las valoraciones.
public record EventoResumenViewModel(
    int EventId, string Titulo, DateTime Fecha, string Lugar, string Categoria, string? ImagenUrl, string CodigoReserva);

public record ValoracionViewModel(int ReviewId, int EventId, string Evento, int Calificacion, string? Comentario, DateTime Fecha);

public record PerfilViewModel(
    string Nombre, string Email, string? Ciudad, string Rol, DateTime MiembroDesde, int EventosAsistidos,
    IReadOnlyList<EventoResumenViewModel> PorValorar, IReadOnlyList<ValoracionViewModel> Valoraciones);

public class CrearValoracionDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Evento no válido.")]
    public int EventId { get; set; }

    [Range(1, 5, ErrorMessage = "Elige una calificación de 1 a 5.")]
    public int Calificacion { get; set; }

    [StringLength(1000, ErrorMessage = "Máximo 1000 caracteres.")]
    public string? Comentario { get; set; }
}
