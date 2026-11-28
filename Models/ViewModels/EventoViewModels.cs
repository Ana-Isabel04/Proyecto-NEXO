using System.ComponentModel.DataAnnotations;
using Nexo.Models.Entities;

namespace Nexo.Models.ViewModels;

// Datos de creación y edición de un evento (RF-42 a RF-49, RF-67).
public class EventoFormDto
{
    private const string Http = @"^https?://\S+$";

    [Required(ErrorMessage = "El nombre es obligatorio."), StringLength(200, MinimumLength = 3, ErrorMessage = "Entre 3 y 200 caracteres.")]
    [Display(Name = "Nombre del evento")]
    public string Title { get; set; } = "";

    [Required(ErrorMessage = "La descripción es obligatoria."), StringLength(1000, ErrorMessage = "Máximo 1000 caracteres.")]
    [Display(Name = "Descripción")]
    public string Description { get; set; } = "";

    [Required(ErrorMessage = "Elige una categoría."), Range(1, int.MaxValue, ErrorMessage = "Elige una categoría.")]
    [Display(Name = "Categoría")]
    public int? CategoryId { get; set; }

    [Required(ErrorMessage = "Indica fecha y hora."), Display(Name = "Fecha y hora")]
    public DateTime? StartsAt { get; set; }

    [Required(ErrorMessage = "Indica el nombre del lugar."), StringLength(200)]
    [Display(Name = "Lugar")]
    public string VenueName { get; set; } = "";

    [StringLength(250), Display(Name = "Dirección")]
    public string? Address { get; set; }

    [Required(ErrorMessage = "Indica la ciudad."), StringLength(100), Display(Name = "Ciudad")]
    public string City { get; set; } = "";

    [Required(ErrorMessage = "Marca la ubicación en el mapa."), Range(-90d, 90d, ErrorMessage = "Latitud no válida.")]
    public decimal? Latitude { get; set; }

    [Required(ErrorMessage = "Marca la ubicación en el mapa."), Range(-180d, 180d, ErrorMessage = "Longitud no válida.")]
    public decimal? Longitude { get; set; }

    [Required(ErrorMessage = "Indica el precio (0 si es gratuito)."), Range(0d, 99999999d, ErrorMessage = "Precio no válido.")]
    [Display(Name = "Precio (0 = gratuito)")]
    public decimal? Price { get; set; }

    [Required(ErrorMessage = "Indica la capacidad."), Range(1, 1000000, ErrorMessage = "La capacidad debe ser mayor que 0.")]
    [Display(Name = "Capacidad")]
    public int? Capacity { get; set; }

    [StringLength(1000), RegularExpression(Http, ErrorMessage = "Debe empezar por http:// o https://")]
    [Display(Name = "Imagen (URL)")]
    public string? ImageUrl { get; set; }

    [StringLength(1000), RegularExpression(Http, ErrorMessage = "Debe empezar por http:// o https://")]
    [Display(Name = "Enlace externo de reserva o pago")]
    public string? ExternalUrl { get; set; }

    [Required(ErrorMessage = "Indica un contacto."), StringLength(150)]
    [Display(Name = "Contacto")]
    public string Contact { get; set; } = "";

    // true publica; false guarda como borrador.
    public bool Publicar { get; set; }
}

public record EventoListaViewModel(
    int EventId, string Titulo, DateTime Fecha, string Lugar, string Categoria, string Organizador,
    string Estado, int Capacidad, int Reservados, int Disponibles, int Reservas, string? ImageUrl)
{
    public bool Finalizado => Estado == EstadoEvento.Publicado && Fecha <= DateTime.Now;
    public bool Gestionable => Estado != EstadoEvento.Cancelado && Fecha > DateTime.Now;
    public string EstadoVisible => Finalizado ? "finalizado"
        : Estado == EstadoEvento.Pendiente ? "en revisión"
        : Estado == EstadoEvento.Publicado && Disponibles == 0 ? "agotado" : Estado;
}

public record DashboardOrganizadorViewModel(
    string Organizador, bool Verificado, int Publicados, int CuposReservados, int CuposDisponibles,
    IReadOnlyList<EventoListaViewModel> Eventos, string? Filtro);

public class EventoFormViewModel
{
    public int? EventId { get; set; }
    public EventoFormDto Datos { get; set; } = new();
    public string Estado { get; set; } = EstadoEvento.Borrador;
    public int Reservados { get; set; }
    public IReadOnlyList<Category> Categorias { get; set; } = [];
}

public record ReservaViewModel(
    string Codigo, string Usuario, string Email, int EventId, string Evento,
    int Cantidad, decimal Total, string Estado, DateTime Fecha);

public record ReservasEventoViewModel(EventoListaViewModel Evento, string? ExternalUrl, IReadOnlyList<ReservaViewModel> Reservas);
