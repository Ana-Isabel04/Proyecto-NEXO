using Microsoft.EntityFrameworkCore;
using Nexo.Models.Entities;

namespace Nexo.Data;

// Datos iniciales idempotentes: roles, categorías y (opcional) un usuario por rol.
public static class DbSeeder
{
    public static async Task SeedAsync(NexoDbContext db, IConfiguration config)
    {
        var roles = new (byte Id, string Name)[] { (1, Roles.Asistente), (2, Roles.Organizador), (3, Roles.Curador), (4, Roles.Admin) };
        foreach (var (id, name) in roles)
            if (!await db.Roles.AnyAsync(r => r.RoleId == id))
                db.Roles.Add(new Role { RoleId = id, Name = name });

        var categories = new (string Name, string Color)[]
        {
            ("Música", "#E11D48"), ("Tecnología", "#2563EB"), ("Deportivo", "#059669"), ("Gastronomía", "#EA580C"),
            ("Educativo", "#6366F1"), ("Arte", "#DC2626"), ("Entretenimiento", "#CA8A04")
        };
        foreach (var (name, color) in categories)
            if (!await db.Categories.AnyAsync(c => c.Name == name))
                db.Categories.Add(new Category { Name = name, ColorHex = color });
        await db.SaveChangesAsync();

        var password = config["Seed:DemoPassword"];
        if (!config.GetValue<bool>("Seed:DemoUsers") || string.IsNullOrEmpty(password)) return;

        var users = new (string FullName, string Email, byte RoleId)[]
        {
            ("Camila Arismendi", "asistente@nexo.com", 1), ("Organizador Demo", "organizador@nexo.com", 2),
            ("Curaduría NEXO", "curador@nexo.com", 3), ("Administrador NEXO", "admin@nexo.com", 4)
        };
        foreach (var (fullName, email, roleId) in users)
            if (!await db.Users.AnyAsync(u => u.Email == email))
                db.Users.Add(new User
                {
                    FullName = fullName, Email = email, RoleId = roleId, City = "Madrid",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
                });
        await db.SaveChangesAsync();

        var owner = await db.Users.FirstOrDefaultAsync(u => u.Email == "organizador@nexo.com");
        if (owner is not null && !await db.Organizers.AnyAsync(o => o.OwnerUserId == owner.UserId))
        {
            db.Organizers.Add(new Organizer { OwnerUserId = owner.UserId, Name = "Colectivo NEXO Demo", Description = "Organizador de ejemplo", IsVerified = true });
            await db.SaveChangesAsync();
        }
    }
}
