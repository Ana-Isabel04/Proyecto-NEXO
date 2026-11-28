using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Nexo.Data;
using Nexo.Services;

var builder = WebApplication.CreateBuilder(args);

// Protege contra CSRF todos los POST/PUT/DELETE (MVC y API). fetch() envía la cabecera X-CSRF-TOKEN.
builder.Services.AddControllersWithViews(o => o.Filters.Add(new AutoValidateAntiforgeryTokenAttribute()));
builder.Services.AddAntiforgery(o => o.HeaderName = "X-CSRF-TOKEN");

builder.Services.AddDbContext<NexoDbContext>(o => o.UseSqlServer(
    builder.Configuration.GetConnectionString("NexoDb")
    ?? throw new InvalidOperationException("Falta ConnectionStrings:NexoDb (ver appsettings.example.json).")));

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ValoracionService>();
builder.Services.AddScoped<PerfilService>();
builder.Services.AddScoped<EventoService>();
builder.Services.AddScoped<ReservaService>();
builder.Services.AddScoped<AdminService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o =>
    {
        o.LoginPath = "/Auth/Login";
        o.LogoutPath = "/Auth/Logout";
        o.AccessDeniedPath = "/Auth/AccesoDenegado";
        o.ExpireTimeSpan = TimeSpan.FromHours(8);
        o.SlidingExpiration = true;
        // La API responde 401/403 en lugar de redirigir a HTML.
        o.Events.OnRedirectToLogin = ctx => Redirect(ctx, StatusCodes.Status401Unauthorized);
        o.Events.OnRedirectToAccessDenied = ctx => Redirect(ctx, StatusCodes.Status403Forbidden);
        // Una cuenta desactivada pierde la sesión de inmediato (RF-62).
        o.Events.OnValidatePrincipal = async ctx =>
        {
            var db = ctx.HttpContext.RequestServices.GetRequiredService<NexoDbContext>();
            if (!int.TryParse(ctx.Principal?.FindFirstValue(ClaimTypes.NameIdentifier), out var id)
                || !await db.Users.AnyAsync(u => u.UserId == id && u.IsActive))
            {
                ctx.RejectPrincipal();
                await ctx.HttpContext.SignOutAsync();
            }
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o =>
{
    o.SwaggerDoc("v1", new OpenApiInfo { Title = "NEXO API", Version = "v1" });
    o.DocInclusionPredicate((_, api) => api.RelativePath?.StartsWith("api/") == true);
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<NexoDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db, app.Configuration);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");

// Cliente React del visitante (build de client/ en wwwroot/app). Las rutas del SPA caen en su index.html.
app.MapFallbackToFile("/app/{*path:nonfile}", "app/index.html");

app.Run();

static Task Redirect(RedirectContext<CookieAuthenticationOptions> ctx, int apiStatus)
{
    if (ctx.Request.Path.StartsWithSegments("/api")) ctx.Response.StatusCode = apiStatus;
    else ctx.Response.Redirect(ctx.RedirectUri);
    return Task.CompletedTask;
}
