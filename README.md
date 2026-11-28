**Nombre del proyecto:** NEXO

**Integrantes:**
- Juan David Rojas Villegas 
- Ana Isabel Patiño Carvajal

**Enlace a la definición:**
[Ver definición del proyecto](docs/definicion.md)

---

## Proyecto unificado (MVC + cliente React)

Una sola aplicación .NET 8 (`Nexo.csproj`): EF Core + SQL Server, **una sola sesión por cookie** para todo.

| Parte | Ruta | Dónde vive |
|---|---|---|
| Visitante / asistente (React) | `/app/…` (`/` redirige aquí) | `client/` → build en `wwwroot/app` |
| Perfil, organizador, curador, admin (Razor) | `/Perfil`, `/Organizador`, `/Admin` | `Views/`, `Controllers/` |
| API del visitante | `/api/auth/*`, `/api/events`, `/api/reservations/*`, `/api/csrf` | `Controllers/Api/Visitante/` |
| API del organizador | `/api/eventos`, `/api/reservas` | `Controllers/Api/` |

**Arranque**
1. `appsettings.json` (copia de `appsettings.example.json`): cadena `NexoDb`; `Seed:DemoUsers` / `Seed:DemoEvents` = `true` para datos demo.
2. `cd client && npm install && npm run build` (genera `wwwroot/app`).
3. `dotnet run` → http://localhost:5080 (aplica migraciones y seeds solo).

Desarrollo del cliente con recarga: `dotnet run` + `cd client && npm run dev` → http://localhost:5173/app/ (proxy `/api` → :5080).

Demo: `asistente@nexo.com` / `1234` (también `organizador@`, `curador@`, `admin@nexo.com`). El login del cliente redirige a las pantallas MVC según el rol.

`legacy/`: API Node anterior, conversores HTML→JSX y el script SQL original (Envigado). Solo referencia; no se compila.
