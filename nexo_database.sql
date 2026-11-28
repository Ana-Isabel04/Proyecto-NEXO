/* =====================================================================
   NEXO · Base de datos (SQL Server 2019+ / Azure SQL)
   Cubre la experiencia del visitante (Persona 1) y deja listas las tablas
   para organizador, curaduría y administración.

   MODELO
     Roles 1─* Users 1─* Reservations *─1 Events *─1 Venues
                 │             │             │ *─1 Categories
                 │             └─1..* Payments  └ *─1 Organizers ─1 Users (dueño)
                 ├─* Favorites *─1 Events
                 └─* (Reviews 1─1 Reservations)

   NOTAS
     - StartsAt = hora local del recinto (DATETIME2, sin zona horaria).
     - Events.SoldCount solo se modifica con usp_CreateReservation /
       usp_CancelReservation (bloqueo transaccional: evita sobreventa).
     - PasswordHash = bcrypt (compatible con BCrypt.Net-Next).
     - Usuarios demo: asistente@ / organizador@ / curador@ / admin@nexo.com
       · contraseña: 1234
   ===================================================================== */
IF DB_ID(N'NexoDb') IS NULL CREATE DATABASE NexoDb;
GO
USE NexoDb;
GO
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
GO
/* ---------- DATOS INICIALES ---------- */
INSERT dbo.Roles(RoleId, Name) VALUES (1,N'asistente'),(2,N'organizador'),(3,N'curador'),(4,N'admin');

INSERT dbo.Users(FullName, Email, PasswordHash, RoleId, City) VALUES
(N'Camila Arismendi', N'asistente@nexo.com', N'$2b$10$lqxN7xvxVCKQq3GAMTIH.uoM/iuCKTmM4u0OhaLJDbUg1pkF.9YO.', 1, N'Madrid'),
(N'Organizador Demo', N'organizador@nexo.com', N'$2b$10$lqxN7xvxVCKQq3GAMTIH.uoM/iuCKTmM4u0OhaLJDbUg1pkF.9YO.', 2, N'Madrid'),
(N'Curaduría NEXO', N'curador@nexo.com', N'$2b$10$lqxN7xvxVCKQq3GAMTIH.uoM/iuCKTmM4u0OhaLJDbUg1pkF.9YO.', 3, N'Madrid'),
(N'Administrador NEXO', N'admin@nexo.com', N'$2b$10$lqxN7xvxVCKQq3GAMTIH.uoM/iuCKTmM4u0OhaLJDbUg1pkF.9YO.', 4, N'Madrid');

INSERT dbo.Categories(Name, ColorHex) VALUES
(N'Música', '#E11D48'),
(N'Tecnología', '#2563EB'),
(N'Deportivo', '#059669'),
(N'Gastronomía', '#EA580C'),
(N'Educativo', '#6366F1'),
(N'Arte', '#DC2626'),
(N'Entretenimiento', '#CA8A04');

INSERT dbo.Venues(Name, City, Latitude, Longitude, IsAccessible) VALUES
(N'Recinto Jardín Botánico, Madrid', N'Madrid', 40.411, -3.691, 1),
(N'Capilla de los Jesuitas, Madrid Centro', N'Madrid', 40.415, -3.707, 1),
(N'Monasterio de las Descalzas, Madrid', N'Madrid', 40.418, -3.708, 1),
(N'Aljibe Subterráneo del Retiro', N'Madrid', 40.409, -3.703, 1),
(N'Claustro San Jerónimo, Madrid', N'Madrid', 40.414, -3.693, 1),
(N'Cripta Románica Nuestra Señora', N'Madrid', 40.42, -3.7, 1),
(N'Espacio Flora', N'Madrid', 40.407, -3.71, 1),
(N'Nave Creativa 16', N'Madrid', 40.39, -3.69, 1),
(N'Galería Alabastro', N'Madrid', 40.43, -3.71, 1);

INSERT dbo.Organizers(OwnerUserId, Name, Description, IsVerified)
SELECT UserId, N'Colectivo NEXO Demo', N'Organizador de ejemplo', 1 FROM dbo.Users WHERE Email = N'organizador@nexo.com';

INSERT dbo.Events(Title, Description, Tag, ImageUrl, CategoryId, VenueId, OrganizerId, StartsAt, Price, Capacity, SoldCount, ExternalUrl) VALUES
(N'Sinfonía Nocturna al Aire Libre', N'Interpretación de la Serenade para cuerdas de Dvořák y piezas del romanticismo temprano entre cipreses y esculturas históricas.', N'Casi completo', N'https://lh3.googleusercontent.com/aida-public/AB6AXuDvDQQA03Z_GnxBc2ya-pPgZux3bLj4-PlMLKX-ByzO7XETPUtbl3ZNuwPUAT9Yk7IRAXswj5z4OVUUKIesI2Ki13R7-RRRpr_9JB73U3xHonMMiygvg209RRgV-WvWSTqVDNUDTqD-66g4fNyQM0Pd1aTVBbuaYBUL94sLxJeA7tH8Prf58_OeH7Z8SbRjbVlxYPYISrsoLs78MMswP-EQq-miJZ94V0MoBUMgbgEMQw7kAcGl4jE', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Música'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Recinto Jardín Botánico, Madrid'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 1230, DATEADD(DAY, 5, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 45, 200, 184, NULL),
(N'Ensamble Barroco & Velada de Velas', N'Sonatas para clavecín y viola da gamba iluminadas exclusivamente por cera virgen. Acústica reverberante protegida.', N'Acústica Única', N'https://lh3.googleusercontent.com/aida-public/AB6AXuDUEyBw44HvUVJ2DYTxFr8TbD9wcUm5ERTL2uqjsNztgYTWHg7eLEwTe2_g-eBPrOJ7H4S3BWT3gYevKbP7RCFmlIk5TkWXD0YiUIUxD160_A85m4_Nu0CiBUDezROOSMfvU1bCCT8oPW2qHSy707ORxMhX796rq9zfWe5sl-owgExRBrH68elH1QtclizZoEA-v1XmXERkUmrZWne6ai7aSnzc4Ucs4H_VfECKixx4-kSIqPgHL9c', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Música'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Capilla de los Jesuitas, Madrid Centro'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 1230, DATEADD(DAY, 9, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 38, 120, 82, NULL),
(N'Polifonías en el Monasterio: Ecos del Siglo XVII', N'Obras de Tomás Luis de Victoria interpretadas por octeto vocal especializado en manuscritos de la corte hispana.', N'Coro de Cámara', N'https://lh3.googleusercontent.com/aida-public/AB6AXuAfId5u3Ime4Y_BudQS2PT5doH4Vq5iZLHqXEwxsTF8ACN0DiOG7QtkjT1uTnV8r_ZO1CgNqbs1SU8grMdjqESApj6GBrwXn6VY-9PLNVE6n7p-fgX8Gbo_CGx-3cTKYwlqgDuuuGtoaiYTkjLPo8qRbkDeuJ0GnNaEZXOpAHK-dK-dRnwdkBzFYLSSVJczuMM8jqrbkrRcggBB8HsqufNA5DutTxKG2rYfeZE6Lc9Zr3yNRtKRqgs', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Música'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Monasterio de las Descalzas, Madrid'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 1200, DATEADD(DAY, 18, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 38, 85, 38, N'https://example.com/entradas'),
(N'Resonancias de Agua: Minimalismo en el Aljibe', N'Texturas sonoras continuas y eco natural de 4 segundos sobre espejos de agua estancada. Experiencia inmersiva única.', N'Vanguardia', N'https://lh3.googleusercontent.com/aida-public/AB6AXuBUwDngw2JWkIO5DKMPfNf3D01hfDqszjf_DDhXaW3vvvCfpQ_-2MLKEnKSqutE9SDx1wB4JvUrYK1eKLFQloJfuP5EDncWstafF6wveeRLOuyR_N456xC4ZUgY_RyjxAPzTMZXlCrQaYPg7TGt6p1dHiTba9oZBUoJogxlnKQ1sp1whvPFLtVRjU5ZPK-RY6PJG2tK4rY6Ff2ZMOWFhT5dKsuBupx6O1AuupE8-pxdJOuprD1kZno', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Música'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Aljibe Subterráneo del Retiro'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 1260, DATEADD(DAY, 32, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 40, 60, 33, NULL),
(N'Jazz & Poesía en Claustro', N'Lectura de versos místicos entrelazados con improvisaciones modales de contrabajo y corneta bajo los soportales renacentistas.', N'Coloquio', N'https://lh3.googleusercontent.com/aida-public/AB6AXuAm4oy6VXdavRVQTUGxd1hQOYdQ9iLyCrhnImLmlKMa8CoS5GdQ0qmurmYhJ3hr8NjhZq9lPTo6330NCJvhD3me8fSrEK7PJPc8DM1eTt0ywibzXLK6EI2sHHpKPGNxim-QwwCRC-R1XX7KM4tq9_zEhLahVy1WeIzFHi5fuze_cAzuXoZkpv1QlrHKlXi0BTQirr4i4HeKsjPdtKdvw3yQNmZrsO4vTvFvQt7p5dR9G21sX8Xz-_c', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Música'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Claustro San Jerónimo, Madrid'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 1170, DATEADD(DAY, 6, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 35, 110, 82, NULL),
(N'Noche de Cello y Arpa Antigua', N'Piezas medievales del Códice Calixtino y suites de Bach adaptadas a instrumentos de época por maestros concertistas.', N'Patrimonio', N'https://lh3.googleusercontent.com/aida-public/AB6AXuC4QxCthAuVnxrRwO6mRARz3_OFsmurlE9ObMtD6s754hQS1I2hAzJoQU8gWIbAuzAq2C3OECL40haK7uQPBn9DbOMNn8jm1nwvOhZQFLEmCf_gP2C7v4rlV1fa27pKd287rYkNEgzFkBaa4TtkB2ygDSkuyesmH5WRFy3mSw6UclsJXNK41lwRQiH553859suL5h3P_Z1DdbK6TVLENC6Ra6ZTj5A1TW0mfj_gE4bxrHXYuDlqDRI', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Música'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Cripta Románica Nuestra Señora'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 1200, DATEADD(DAY, 23, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 30, 90, 34, NULL),
(N'Cata Sensorial & Maridaje', N'', N'Gastronomía', N'', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Gastronomía'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Espacio Flora'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 1140, DATEADD(DAY, 3, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 38, 30, 24, NULL),
(N'Hackathon Creativo', N'', N'Tecnología', N'', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Tecnología'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Nave Creativa 16'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 600, DATEADD(DAY, 4, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 0, 80, 40, NULL),
(N'Muestra Textil', N'', N'Arte', N'', (SELECT CategoryId FROM dbo.Categories WHERE Name = N'Arte'), (SELECT VenueId FROM dbo.Venues WHERE Name = N'Galería Alabastro'), (SELECT TOP 1 OrganizerId FROM dbo.Organizers), DATEADD(MINUTE, 1050, DATEADD(DAY, 5, CAST(CAST(SYSDATETIME() AS DATE) AS DATETIME2))), 12, 60, 10, NULL);
GO

/* ---------- PROCEDIMIENTOS (reglas de negocio atómicas) ---------- */
CREATE OR ALTER PROCEDURE dbo.usp_CreateReservation
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
END;
GO
/* Cancelación gratuita hasta 48 h antes del evento (promesa del diseño). */
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
END;
GO
