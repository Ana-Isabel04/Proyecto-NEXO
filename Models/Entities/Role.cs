namespace Nexo.Models.Entities;

// Rol de la cuenta.
public class Role
{
    public byte RoleId { get; set; }
    public string Name { get; set; } = "";
    public ICollection<User> Users { get; set; } = new List<User>();
}
