using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nexo.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // DDL copiado de nexo_database.sql (incluye nombres de restricciones).
            // Si la base ya se creó con el script, las tablas no se vuelven a crear.
            migrationBuilder.Sql(@"IF OBJECT_ID(N'dbo.Roles', N'U') IS NULL
BEGIN
CREATE TABLE dbo.Roles (
  RoleId TINYINT NOT NULL CONSTRAINT PK_Roles PRIMARY KEY,
  Name   NVARCHAR(30) NOT NULL CONSTRAINT UQ_Roles_Name UNIQUE
);
CREATE TABLE dbo.Users (
  UserId       INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Users PRIMARY KEY,
  FullName     NVARCHAR(150) NOT NULL,
  Email        NVARCHAR(256) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
  PasswordHash NVARCHAR(255) NOT NULL,
  RoleId       TINYINT NOT NULL CONSTRAINT FK_Users_Roles REFERENCES dbo.Roles(RoleId),
  City         NVARCHAR(100) NULL,
  IsActive     BIT NOT NULL CONSTRAINT DF_Users_Active DEFAULT 1,
  CreatedAt    DATETIME2 NOT NULL CONSTRAINT DF_Users_Created DEFAULT SYSUTCDATETIME(),
  LastLoginAt  DATETIME2 NULL
);
CREATE TABLE dbo.Categories (
  CategoryId INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Categories PRIMARY KEY,
  Name       NVARCHAR(60) NOT NULL CONSTRAINT UQ_Categories_Name UNIQUE,
  ColorHex   CHAR(7) NULL
);
CREATE TABLE dbo.Venues (
  VenueId      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Venues PRIMARY KEY,
  Name         NVARCHAR(200) NOT NULL,
  Address      NVARCHAR(250) NULL,
  City         NVARCHAR(100) NOT NULL CONSTRAINT DF_Venues_City DEFAULT N'Madrid',
  Latitude     DECIMAL(9,6) NOT NULL,
  Longitude    DECIMAL(9,6) NOT NULL,
  IsAccessible BIT NOT NULL CONSTRAINT DF_Venues_Acc DEFAULT 0
);
CREATE TABLE dbo.Organizers (
  OrganizerId INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Organizers PRIMARY KEY,
  OwnerUserId INT NOT NULL CONSTRAINT FK_Organizers_Users REFERENCES dbo.Users(UserId),
  Name        NVARCHAR(150) NOT NULL,
  Description NVARCHAR(500) NULL,
  IsVerified  BIT NOT NULL CONSTRAINT DF_Org_Verified DEFAULT 0
);
CREATE TABLE dbo.Events (
  EventId     INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Events PRIMARY KEY,
  Title       NVARCHAR(200) NOT NULL,
  Description NVARCHAR(1000) NULL,
  Tag         NVARCHAR(60) NULL,
  ImageUrl    NVARCHAR(1000) NULL,
  CategoryId  INT NOT NULL CONSTRAINT FK_Events_Categories REFERENCES dbo.Categories(CategoryId),
  VenueId     INT NOT NULL CONSTRAINT FK_Events_Venues REFERENCES dbo.Venues(VenueId),
  OrganizerId INT NOT NULL CONSTRAINT FK_Events_Organizers REFERENCES dbo.Organizers(OrganizerId),
  StartsAt    DATETIME2 NOT NULL,
  Price       DECIMAL(10,2) NOT NULL CONSTRAINT CK_Events_Price CHECK (Price >= 0),
  Capacity    INT NOT NULL CONSTRAINT CK_Events_Cap CHECK (Capacity > 0),
  SoldCount   INT NOT NULL CONSTRAINT DF_Events_Sold DEFAULT 0,
  ExternalUrl NVARCHAR(1000) NULL,   -- con valor: la reserva/pago se hace en el sitio del organizador
  Status      NVARCHAR(20) NOT NULL CONSTRAINT DF_Events_Status DEFAULT N'publicado',
  CreatedAt   DATETIME2 NOT NULL CONSTRAINT DF_Events_Created DEFAULT SYSUTCDATETIME(),
  AvailableSeats AS (Capacity - SoldCount) PERSISTED,
  CONSTRAINT CK_Events_Sold   CHECK (SoldCount BETWEEN 0 AND Capacity),
  CONSTRAINT CK_Events_Status CHECK (Status IN (N'borrador', N'pendiente', N'publicado', N'cancelado'))
);
CREATE INDEX IX_Events_Status_Starts ON dbo.Events(Status, StartsAt) INCLUDE (CategoryId, Price);
CREATE INDEX IX_Events_Category ON dbo.Events(CategoryId);
CREATE INDEX IX_Events_Venue ON dbo.Events(VenueId);
CREATE TABLE dbo.Reservations (
  ReservationId INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Reservations PRIMARY KEY,
  Code          NVARCHAR(20) NOT NULL CONSTRAINT UQ_Reservations_Code UNIQUE,   -- p. ej. NX-4QLI3-354
  UserId        INT NOT NULL CONSTRAINT FK_Res_Users REFERENCES dbo.Users(UserId),
  EventId       INT NOT NULL CONSTRAINT FK_Res_Events REFERENCES dbo.Events(EventId),
  Quantity      TINYINT NOT NULL CONSTRAINT CK_Res_Qty CHECK (Quantity BETWEEN 1 AND 4),
  UnitPrice     DECIMAL(10,2) NOT NULL,
  Subtotal      DECIMAL(10,2) NOT NULL,
  ServiceFee    DECIMAL(10,2) NOT NULL,   -- 5% preservación y curaduría
  Total         DECIMAL(10,2) NOT NULL,
  Status        NVARCHAR(20) NOT NULL CONSTRAINT DF_Res_Status DEFAULT N'confirmada',
  CreatedAt     DATETIME2 NOT NULL CONSTRAINT DF_Res_Created DEFAULT SYSUTCDATETIME(),
  CancelledAt   DATETIME2 NULL,
  CONSTRAINT CK_Res_Status CHECK (Status IN (N'confirmada', N'cancelada'))
);
CREATE INDEX IX_Res_User  ON dbo.Reservations(UserId, Status) INCLUDE (EventId, CreatedAt);
CREATE INDEX IX_Res_Event ON dbo.Reservations(EventId);
CREATE TABLE dbo.Payments (
  PaymentId     INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Payments PRIMARY KEY,
  ReservationId INT NOT NULL CONSTRAINT FK_Pay_Res REFERENCES dbo.Reservations(ReservationId),
  Method        NVARCHAR(30) NOT NULL CONSTRAINT CK_Pay_Method CHECK (Method IN (N'apple-pay', N'credit-card')),
  Amount        DECIMAL(10,2) NOT NULL,
  Status        NVARCHAR(20) NOT NULL CONSTRAINT DF_Pay_Status DEFAULT N'aprobado',
  ProviderRef   NVARCHAR(100) NULL,   -- id de la pasarela (Stripe, etc.)
  CreatedAt     DATETIME2 NOT NULL CONSTRAINT DF_Pay_Created DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_Pay_Status CHECK (Status IN (N'pendiente', N'aprobado', N'rechazado', N'reembolsado'))
);
CREATE INDEX IX_Pay_Res ON dbo.Payments(ReservationId);
CREATE TABLE dbo.Favorites (
  UserId    INT NOT NULL CONSTRAINT FK_Fav_Users  REFERENCES dbo.Users(UserId),
  EventId   INT NOT NULL CONSTRAINT FK_Fav_Events REFERENCES dbo.Events(EventId),
  CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Fav_Created DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_Favorites PRIMARY KEY (UserId, EventId)
);
CREATE TABLE dbo.Reviews (
  ReviewId      INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_Reviews PRIMARY KEY,
  ReservationId INT NOT NULL CONSTRAINT UQ_Reviews_Res UNIQUE,
  Rating        TINYINT NOT NULL CONSTRAINT CK_Rev_Rating CHECK (Rating BETWEEN 1 AND 5),
  Comment       NVARCHAR(1000) NULL,
  CreatedAt     DATETIME2 NOT NULL CONSTRAINT DF_Rev_Created DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Rev_Res FOREIGN KEY (ReservationId) REFERENCES dbo.Reservations(ReservationId)
);
END");

            migrationBuilder.Sql(@"CREATE OR ALTER PROCEDURE dbo.usp_CreateReservation
  @UserId INT, @EventId INT, @Quantity TINYINT, @PaymentMethod NVARCHAR(30)
AS
BEGIN
  SET NOCOUNT ON; SET XACT_ABORT ON;
  BEGIN TRAN;
  DECLARE @Price DECIMAL(10,2), @Cap INT, @Sold INT, @Status NVARCHAR(20), @Ext NVARCHAR(1000), @Starts DATETIME2;
  SELECT @Price = Price, @Cap = Capacity, @Sold = SoldCount, @Status = Status, @Ext = ExternalUrl, @Starts = StartsAt
    FROM dbo.Events WITH (UPDLOCK, ROWLOCK) WHERE EventId = @EventId;
  IF @Status IS NULL                THROW 50001, N'Evento no encontrado', 1;
  IF @Status <> N'publicado'        THROW 50002, N'Evento no disponible', 1;
  IF @Ext IS NOT NULL               THROW 50003, N'Este evento se reserva en el sitio del organizador', 1;
  IF @Starts < SYSDATETIME()        THROW 50004, N'El evento ya ocurrió', 1;
  IF @Quantity NOT BETWEEN 1 AND 4  THROW 50005, N'Entre 1 y 4 entradas', 1;
  IF @Cap - @Sold < @Quantity       THROW 50006, N'No hay cupos suficientes', 1;
  DECLARE @Sub DECIMAL(10,2) = @Price * @Quantity,
          @Fee DECIMAL(10,2) = ROUND(@Price * @Quantity * 0.05, 2),
          @Code NVARCHAR(20) = N'NX-' + LEFT(UPPER(REPLACE(CONVERT(VARCHAR(36), NEWID()), '-', '')), 5) + N'-' + RIGHT(CONVERT(VARCHAR(20), DATEDIFF_BIG(MILLISECOND, '1970-01-01', SYSUTCDATETIME())), 3);
  INSERT dbo.Reservations(Code, UserId, EventId, Quantity, UnitPrice, Subtotal, ServiceFee, Total)
    VALUES (@Code, @UserId, @EventId, @Quantity, @Price, @Sub, @Fee, @Sub + @Fee);
  DECLARE @ResId INT = SCOPE_IDENTITY();
  INSERT dbo.Payments(ReservationId, Method, Amount, Status) VALUES (@ResId, @PaymentMethod, @Sub + @Fee, N'aprobado');
  UPDATE dbo.Events SET SoldCount = SoldCount + @Quantity WHERE EventId = @EventId;
  COMMIT;
  SELECT @ResId AS ReservationId, @Code AS Code, @Sub + @Fee AS Total;
END;");

            migrationBuilder.Sql(@"/* Cancelación gratuita hasta 48 h antes del evento (promesa del diseño). */
CREATE OR ALTER PROCEDURE dbo.usp_CancelReservation
  @UserId INT, @Code NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON; SET XACT_ABORT ON;
  BEGIN TRAN;
  DECLARE @ResId INT, @EventId INT, @Qty TINYINT, @Status NVARCHAR(20), @Starts DATETIME2;
  SELECT @ResId = r.ReservationId, @EventId = r.EventId, @Qty = r.Quantity, @Status = r.Status, @Starts = e.StartsAt
    FROM dbo.Reservations r JOIN dbo.Events e ON e.EventId = r.EventId
    WHERE r.Code = @Code AND r.UserId = @UserId;
  IF @ResId IS NULL                 THROW 50011, N'Reserva no encontrada', 1;
  IF @Status = N'cancelada'         THROW 50012, N'Ya estaba cancelada', 1;
  IF DATEDIFF(HOUR, SYSDATETIME(), @Starts) < 48 THROW 50013, N'Solo se puede cancelar hasta 48 horas antes', 1;
  UPDATE dbo.Reservations SET Status = N'cancelada', CancelledAt = SYSUTCDATETIME() WHERE ReservationId = @ResId;
  UPDATE dbo.Payments     SET Status = N'reembolsado' WHERE ReservationId = @ResId;
  UPDATE dbo.Events WITH (UPDLOCK, ROWLOCK) SET SoldCount = SoldCount - @Qty WHERE EventId = @EventId;
  COMMIT;
END;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.usp_CreateReservation");
            migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.usp_CancelReservation");
            migrationBuilder.DropTable("Reviews");
            migrationBuilder.DropTable("Favorites");
            migrationBuilder.DropTable("Payments");
            migrationBuilder.DropTable("Reservations");
            migrationBuilder.DropTable("Events");
            migrationBuilder.DropTable("Organizers");
            migrationBuilder.DropTable("Venues");
            migrationBuilder.DropTable("Categories");
            migrationBuilder.DropTable("Users");
            migrationBuilder.DropTable("Roles");
        }
    }
}
