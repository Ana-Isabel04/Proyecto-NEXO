namespace Nexo.Models.Entities;

// Cuenta de la plataforma. La contraseña solo se guarda como hash.
public class User
{
    public int UserId { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public byte RoleId { get; set; }
    public string? City { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }

    public Role Role { get; set; } = null!;
    public ICollection<Organizer> Organizers { get; set; } = new List<Organizer>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
