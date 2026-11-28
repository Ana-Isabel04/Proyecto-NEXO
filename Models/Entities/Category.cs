namespace Nexo.Models.Entities;

// Categoría de un evento, con su color.
public class Category
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = "";
    public string? ColorHex { get; set; }
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
