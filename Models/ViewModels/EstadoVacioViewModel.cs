namespace Nexo.Models.ViewModels;

// Mensaje para las listas sin resultados.
public record EstadoVacioViewModel(
    string Titulo, string Mensaje, string Icono = "inbox",
    string? TextoAccion = null, string? UrlAccion = null);
