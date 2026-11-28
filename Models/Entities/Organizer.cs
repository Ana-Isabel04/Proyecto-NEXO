namespace Nexo.Models.Entities;

// Colectivo o espacio que pertenece a un usuario organizador.
public class Organizer
{
    public int OrganizerId { get; set; }
    public int OwnerUserId { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public bool IsVerified { get; set; }
    public User Owner { get; set; } = null!;
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
