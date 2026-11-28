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

        if (config.GetValue<bool>("Seed:DemoEvents")) await SeedEventosDemoAsync(db);
    }

    // Eventos de ejemplo (Envigado, precios en COP) para el catálogo público. Solo si no hay ninguno.
    private static async Task SeedEventosDemoAsync(NexoDbContext db)
    {
        if (await db.Events.AnyAsync()) return;
        var organizador = await db.Organizers.OrderBy(o => o.OrganizerId).FirstOrDefaultAsync();
        if (organizador is null) return; // requiere Seed:DemoUsers (crea el organizador demo)

        var venues = new (string Name, string City, decimal Lat, decimal Lng, bool Accessible)[]
        {
            ("Parque Principal de Envigado", "Envigado", 6.1716m, -75.5911m, true),
            ("Casa de la Cultura Miguel Uribe Restrepo", "Envigado", 6.1722m, -75.5897m, true),
            ("Parroquia Santa Gertrudis la Magna", "Envigado", 6.1713m, -75.5906m, true),
            ("Parque Ecológico El Salado", "Envigado", 6.156m, -75.559m, true),
            ("Casa Museo Débora Arango", "Envigado", 6.169m, -75.58m, true),
            ("Mirador Alto de Misael", "Envigado", 6.189m, -75.578m, true),
            ("Plaza de Mercado de Envigado", "Envigado", 6.1692m, -75.5865m, true),
            ("Institución Universitaria de Envigado", "Envigado", 6.159m, -75.592m, true),
            ("Galería Alabastro, Envigado", "Envigado", 6.175m, -75.588m, true),
        };
        foreach (var v in venues)
            if (!await db.Venues.AnyAsync(x => x.Name == v.Name))
                db.Venues.Add(new Venue { Name = v.Name, City = v.City, Latitude = v.Lat, Longitude = v.Lng, IsAccessible = v.Accessible });
        await db.SaveChangesAsync();

        var hoy = DateTime.Today;
        var eventos = new (string Title, string Desc, string Tag, string Img, string Cat, string Venue, int Dias, int Minutos, decimal Price, int Cap, int Sold, string? Ext)[]
        {
            ("Sinfonía Nocturna al Aire Libre", "Interpretación de la Serenade para cuerdas de Dvořák y piezas del romanticismo temprano entre cipreses y esculturas históricas.", "Casi completo", "https://lh3.googleusercontent.com/aida-public/AB6AXuDvDQQA03Z_GnxBc2ya-pPgZux3bLj4-PlMLKX-ByzO7XETPUtbl3ZNuwPUAT9Yk7IRAXswj5z4OVUUKIesI2Ki13R7-RRRpr_9JB73U3xHonMMiygvg209RRgV-WvWSTqVDNUDTqD-66g4fNyQM0Pd1aTVBbuaYBUL94sLxJeA7tH8Prf58_OeH7Z8SbRjbVlxYPYISrsoLs78MMswP-EQq-miJZ94V0MoBUMgbgEMQw7kAcGl4jE", "Música", "Parque Principal de Envigado", 5, 1230, 55000m, 200, 184, null),
            ("Ensamble Barroco & Velada de Velas", "Sonatas para clavecín y viola da gamba iluminadas exclusivamente por cera virgen. Acústica reverberante protegida.", "Acústica Única", "https://lh3.googleusercontent.com/aida-public/AB6AXuDUEyBw44HvUVJ2DYTxFr8TbD9wcUm5ERTL2uqjsNztgYTWHg7eLEwTe2_g-eBPrOJ7H4S3BWT3gYevKbP7RCFmlIk5TkWXD0YiUIUxD160_A85m4_Nu0CiBUDezROOSMfvU1bCCT8oPW2qHSy707ORxMhX796rq9zfWe5sl-owgExRBrH68elH1QtclizZoEA-v1XmXERkUmrZWne6ai7aSnzc4Ucs4H_VfECKixx4-kSIqPgHL9c", "Música", "Casa de la Cultura Miguel Uribe Restrepo", 9, 1230, 45000m, 120, 82, null),
            ("Polifonías en la Parroquia: Ecos del Siglo XVII", "Obras de Tomás Luis de Victoria interpretadas por octeto vocal especializado en manuscritos de la corte hispana.", "Coro de Cámara", "https://lh3.googleusercontent.com/aida-public/AB6AXuAfId5u3Ime4Y_BudQS2PT5doH4Vq5iZLHqXEwxsTF8ACN0DiOG7QtkjT1uTnV8r_ZO1CgNqbs1SU8grMdjqESApj6GBrwXn6VY-9PLNVE6n7p-fgX8Gbo_CGx-3cTKYwlqgDuuuGtoaiYTkjLPo8qRbkDeuJ0GnNaEZXOpAHK-dK-dRnwdkBzFYLSSVJczuMM8jqrbkrRcggBB8HsqufNA5DutTxKG2rYfeZE6Lc9Zr3yNRtKRqgs", "Música", "Parroquia Santa Gertrudis la Magna", 18, 1200, 45000m, 85, 38, "https://example.com/entradas"),
            ("Resonancias de Agua: Minimalismo en El Salado", "Texturas sonoras continuas y el murmullo natural de la quebrada entre el bosque. Experiencia inmersiva única.", "Vanguardia", "https://lh3.googleusercontent.com/aida-public/AB6AXuBUwDngw2JWkIO5DKMPfNf3D01hfDqszjf_DDhXaW3vvvCfpQ_-2MLKEnKSqutE9SDx1wB4JvUrYK1eKLFQloJfuP5EDncWstafF6wveeRLOuyR_N456xC4ZUgY_RyjxAPzTMZXlCrQaYPg7TGt6p1dHiTba9oZBUoJogxlnKQ1sp1whvPFLtVRjU5ZPK-RY6PJG2tK4rY6Ff2ZMOWFhT5dKsuBupx6O1AuupE8-pxdJOuprD1kZno", "Música", "Parque Ecológico El Salado", 32, 1260, 48000m, 60, 33, null),
            ("Jazz & Poesía en el Patio", "Lectura de versos entrelazados con improvisaciones modales de contrabajo y corneta bajo los corredores de una casa patrimonial.", "Coloquio", "https://lh3.googleusercontent.com/aida-public/AB6AXuAm4oy6VXdavRVQTUGxd1hQOYdQ9iLyCrhnImLmlKMa8CoS5GdQ0qmurmYhJ3hr8NjhZq9lPTo6330NCJvhD3me8fSrEK7PJPc8DM1eTt0ywibzXLK6EI2sHHpKPGNxim-QwwCRC-R1XX7KM4tq9_zEhLahVy1WeIzFHi5fuze_cAzuXoZkpv1QlrHKlXi0BTQirr4i4HeKsjPdtKdvw3yQNmZrsO4vTvFvQt7p5dR9G21sX8Xz-_c", "Música", "Casa Museo Débora Arango", 6, 1170, 40000m, 110, 82, null),
            ("Noche de Cello y Arpa Antigua", "Piezas medievales del Códice Calixtino y suites de Bach adaptadas a instrumentos de época por maestros concertistas.", "Patrimonio", "https://lh3.googleusercontent.com/aida-public/AB6AXuC4QxCthAuVnxrRwO6mRARz3_OFsmurlE9ObMtD6s754hQS1I2hAzJoQU8gWIbAuzAq2C3OECL40haK7uQPBn9DbOMNn8jm1nwvOhZQFLEmCf_gP2C7v4rlV1fa27pKd287rYkNEgzFkBaa4TtkB2ygDSkuyesmH5WRFy3mSw6UclsJXNK41lwRQiH553859suL5h3P_Z1DdbK6TVLENC6Ra6ZTj5A1TW0mfj_gE4bxrHXYuDlqDRI", "Música", "Mirador Alto de Misael", 23, 1200, 35000m, 90, 34, null),
            ("Cata Sensorial & Maridaje", "", "Gastronomía", "", "Gastronomía", "Plaza de Mercado de Envigado", 3, 1140, 45000m, 30, 24, null),
            ("Hackathon Creativo", "", "Tecnología", "", "Tecnología", "Institución Universitaria de Envigado", 4, 600, 0m, 80, 40, null),
            ("Muestra Textil", "", "Arte", "", "Arte", "Galería Alabastro, Envigado", 5, 1050, 15000m, 60, 10, null),
        };
        var categorias = await db.Categories.ToDictionaryAsync(c => c.Name, c => c.CategoryId);
        var lugares = await db.Venues.ToDictionaryAsync(v => v.Name, v => v.VenueId);
        foreach (var e in eventos)
            db.Events.Add(new Event
            {
                Title = e.Title, Description = e.Desc, Tag = e.Tag, ImageUrl = e.Img,
                CategoryId = categorias[e.Cat], VenueId = lugares[e.Venue], OrganizerId = organizador.OrganizerId,
                StartsAt = hoy.AddDays(e.Dias).AddMinutes(e.Minutos), Price = e.Price, Capacity = e.Cap, SoldCount = e.Sold,
                ExternalUrl = e.Ext, Status = EstadoEvento.Publicado
            });
        await db.SaveChangesAsync();
    }
}
