namespace Nexo.Models.Entities;

// Valores de estado que se guardan como texto en la base.
public static class EstadoEvento
{
    public const string Borrador = "borrador";
    public const string Pendiente = "pendiente";
    public const string Publicado = "publicado";
    public const string Cancelado = "cancelado";
}

public static class EstadoReserva
{
    public const string Confirmada = "confirmada";
    public const string Cancelada = "cancelada";
}

public static class EstadoReporte
{
    public const string Pendiente = "pendiente";
    public const string Revisado = "revisado";
    public const string Descartado = "descartado";
}
