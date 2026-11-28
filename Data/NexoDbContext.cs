using Microsoft.EntityFrameworkCore;
using Nexo.Models.Entities;

namespace Nexo.Data;

// Mapeo de nexo_database.sql más Events.Contact y Reports.
public class NexoDbContext(DbContextOptions<NexoDbContext> options) : DbContext(options)
{
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Venue> Venues => Set<Venue>();
    public DbSet<Organizer> Organizers => Set<Organizer>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Report> Reports => Set<Report>();

    private const string Now = "SYSUTCDATETIME()";

    // Los índices son exactamente los del script: EF no añade índices automáticos por cada FK.
    protected override void ConfigureConventions(ModelConfigurationBuilder c) =>
        c.Conventions.Remove(typeof(Microsoft.EntityFrameworkCore.Metadata.Conventions.ForeignKeyIndexConvention));

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Role>(e =>
        {
            e.ToTable("Roles");
            e.Property(x => x.RoleId).ValueGeneratedNever();
            e.Property(x => x.Name).HasMaxLength(30);
            e.HasIndex(x => x.Name).IsUnique().HasDatabaseName("UQ_Roles_Name");
        });

        b.Entity<User>(e =>
        {
            e.ToTable("Users");
            e.Property(x => x.FullName).HasMaxLength(150);
            e.Property(x => x.Email).HasMaxLength(256);
            e.Property(x => x.PasswordHash).HasMaxLength(255);
            e.Property(x => x.City).HasMaxLength(100);
            // El centinela "true" permite guardar IsActive = false explícitamente.
            e.Property(x => x.IsActive).HasDefaultValue(true).HasSentinel(true);
            e.Property(x => x.CreatedAt).HasDefaultValueSql(Now);
            e.HasIndex(x => x.Email).IsUnique().HasDatabaseName("UQ_Users_Email");
            e.HasOne(x => x.Role).WithMany(x => x.Users).HasForeignKey(x => x.RoleId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Users_Roles");
        });

        b.Entity<Category>(e =>
        {
            e.ToTable("Categories");
            e.Property(x => x.Name).HasMaxLength(60);
            e.Property(x => x.ColorHex).HasColumnType("char(7)");
            e.HasIndex(x => x.Name).IsUnique().HasDatabaseName("UQ_Categories_Name");
        });

        b.Entity<Venue>(e =>
        {
            e.ToTable("Venues");
            e.Property(x => x.Name).HasMaxLength(200);
            e.Property(x => x.Address).HasMaxLength(250);
            e.Property(x => x.City).HasMaxLength(100);
            e.Property(x => x.Latitude).HasPrecision(9, 6);
            e.Property(x => x.Longitude).HasPrecision(9, 6);
        });

        b.Entity<Organizer>(e =>
        {
            e.ToTable("Organizers");
            e.Property(x => x.Name).HasMaxLength(150);
            e.Property(x => x.Description).HasMaxLength(500);
            e.HasOne(x => x.Owner).WithMany(x => x.Organizers).HasForeignKey(x => x.OwnerUserId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Organizers_Users");
        });

        // Mismas restricciones e índices que nexo_database.sql.
        b.Entity<Event>(e =>
        {
            e.ToTable("Events", t =>
            {
                t.HasCheckConstraint("CK_Events_Price", "Price >= 0");
                t.HasCheckConstraint("CK_Events_Cap", "Capacity > 0");
                t.HasCheckConstraint("CK_Events_Sold", "SoldCount BETWEEN 0 AND Capacity");
                t.HasCheckConstraint("CK_Events_Status", "Status IN (N'borrador', N'pendiente', N'publicado', N'cancelado')");
            });
            e.Property(x => x.Title).HasMaxLength(200);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.Tag).HasMaxLength(60);
            e.Property(x => x.ImageUrl).HasMaxLength(1000);
            e.Property(x => x.Price).HasPrecision(10, 2);
            e.Property(x => x.ExternalUrl).HasMaxLength(1000);
            e.Property(x => x.Status).HasMaxLength(20);
            e.Property(x => x.CreatedAt).HasDefaultValueSql(Now);
            e.Property(x => x.AvailableSeats).HasComputedColumnSql("[Capacity] - [SoldCount]", stored: true);
            e.Property(x => x.Contact).HasMaxLength(150);
            e.HasIndex(x => new { x.Status, x.StartsAt }).HasDatabaseName("IX_Events_Status_Starts")
                .IncludeProperties(x => new { x.CategoryId, x.Price });
            e.HasIndex(x => x.CategoryId).HasDatabaseName("IX_Events_Category");
            e.HasIndex(x => x.VenueId).HasDatabaseName("IX_Events_Venue");
            e.HasOne(x => x.Category).WithMany(x => x.Events).HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Events_Categories");
            e.HasOne(x => x.Venue).WithMany(x => x.Events).HasForeignKey(x => x.VenueId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Events_Venues");
            e.HasOne(x => x.Organizer).WithMany(x => x.Events).HasForeignKey(x => x.OrganizerId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Events_Organizers");
        });

        b.Entity<Reservation>(e =>
        {
            e.ToTable("Reservations", t =>
            {
                t.HasCheckConstraint("CK_Res_Qty", "Quantity BETWEEN 1 AND 4");
                t.HasCheckConstraint("CK_Res_Status", "Status IN (N'confirmada', N'cancelada')");
            });
            e.Property(x => x.Code).HasMaxLength(20);
            e.Property(x => x.UnitPrice).HasPrecision(10, 2);
            e.Property(x => x.Subtotal).HasPrecision(10, 2);
            e.Property(x => x.ServiceFee).HasPrecision(10, 2);
            e.Property(x => x.Total).HasPrecision(10, 2);
            e.Property(x => x.Status).HasMaxLength(20);
            e.Property(x => x.CreatedAt).HasDefaultValueSql(Now);
            e.HasIndex(x => x.Code).IsUnique().HasDatabaseName("UQ_Reservations_Code");
            e.HasIndex(x => new { x.UserId, x.Status }).HasDatabaseName("IX_Res_User")
                .IncludeProperties(x => new { x.EventId, x.CreatedAt });
            e.HasIndex(x => x.EventId).HasDatabaseName("IX_Res_Event");
            e.HasOne(x => x.User).WithMany(x => x.Reservations).HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Res_Users");
            e.HasOne(x => x.Event).WithMany(x => x.Reservations).HasForeignKey(x => x.EventId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Res_Events");
        });

        b.Entity<Payment>(e =>
        {
            e.ToTable("Payments", t =>
            {
                t.HasCheckConstraint("CK_Pay_Method", "Method IN (N'apple-pay', N'credit-card')");
                t.HasCheckConstraint("CK_Pay_Status", "Status IN (N'pendiente', N'aprobado', N'rechazado', N'reembolsado')");
            });
            e.Property(x => x.Method).HasMaxLength(30);
            e.Property(x => x.Amount).HasPrecision(10, 2);
            e.Property(x => x.Status).HasMaxLength(20);
            e.Property(x => x.ProviderRef).HasMaxLength(100);
            e.Property(x => x.CreatedAt).HasDefaultValueSql(Now);
            e.HasIndex(x => x.ReservationId).HasDatabaseName("IX_Pay_Res");
            e.HasOne(x => x.Reservation).WithMany(x => x.Payments).HasForeignKey(x => x.ReservationId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Pay_Res");
        });

        b.Entity<Favorite>(e =>
        {
            e.ToTable("Favorites");
            e.HasKey(x => new { x.UserId, x.EventId });
            e.Property(x => x.CreatedAt).HasDefaultValueSql(Now);
            e.HasOne(x => x.User).WithMany(x => x.Favorites).HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Fav_Users");
            e.HasOne(x => x.Event).WithMany(x => x.Favorites).HasForeignKey(x => x.EventId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Fav_Events");
        });

        b.Entity<Review>(e =>
        {
            e.ToTable("Reviews", t => t.HasCheckConstraint("CK_Rev_Rating", "Rating BETWEEN 1 AND 5"));
            e.Property(x => x.Comment).HasMaxLength(1000);
            e.Property(x => x.CreatedAt).HasDefaultValueSql(Now);
            e.HasIndex(x => x.ReservationId).IsUnique().HasDatabaseName("UQ_Reviews_Res");
            e.HasOne(x => x.Reservation).WithOne(x => x.Review).HasForeignKey<Review>(x => x.ReservationId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Rev_Res");
        });

        b.Entity<Report>(e =>
        {
            e.ToTable("Reports");
            e.HasIndex(x => x.UserId).HasDatabaseName("IX_Reports_User");
            e.HasIndex(x => x.EventId).HasDatabaseName("IX_Reports_Event");
            e.Property(x => x.Reason).HasMaxLength(100);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.Status).HasMaxLength(20);
            e.Property(x => x.CreatedAt).HasDefaultValueSql(Now);
            e.HasOne(x => x.User).WithMany(x => x.Reports).HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Reports_Users");
            e.HasOne(x => x.Event).WithMany(x => x.Reports).HasForeignKey(x => x.EventId)
                .OnDelete(DeleteBehavior.NoAction).HasConstraintName("FK_Reports_Events");
        });
    }
}
