using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Nexo.Data;
using Nexo.Models.Entities;

namespace Nexo.Controllers.Api.Visitante;

public record CrearReservaReq(int EventId, int Qty, string? Payment);

// Reservas del asistente. Las reglas (cupos, máx. 4, cancelar hasta 48 h antes) viven en
// usp_CreateReservation / usp_CancelReservation; aquí solo se traducen sus errores (50001…50013) a HTTP.
[Route("api/reservations"), Authorize(Roles = Roles.Asistente)]
public class ReservasVisitanteApiController(NexoDbContext db) : VisitanteApiBase
{
    [HttpPost]
    public async Task<IActionResult> Crear(CrearReservaReq r)
    {
        if (r.Qty is < 1 or > 4) return Err(400, "Entre 1 y 4 entradas");
        var pago = r.Payment is "apple-pay" or "credit-card" ? r.Payment : "apple-pay";
        try
        {
            var code = await EjecutarAsync("dbo.usp_CreateReservation",
                ("@UserId", UserId), ("@EventId", r.EventId), ("@Quantity", (byte)r.Qty), ("@PaymentMethod", pago));
            var res = await ConsultaReservas().FirstAsync(x => x.Code == code);
            return StatusCode(201, ReservaDto.De(res));
        }
        catch (SqlException ex) when (ex.Number is >= 50001 and <= 50013) { return Err(HttpPara(ex.Number), ex.Message); }
    }

    [HttpGet("mine")]
    public async Task<IActionResult> Mias()
    {
        var uid = UserId;
        var lista = await ConsultaReservas().Where(x => x.UserId == uid).OrderByDescending(x => x.CreatedAt).ToListAsync();
        return Ok(lista.Select(ReservaDto.De));
    }

    [HttpGet("{code}")]
    public async Task<IActionResult> Detalle(string code)
    {
        var uid = UserId;
        var res = await ConsultaReservas().FirstOrDefaultAsync(x => x.Code == code && x.UserId == uid);
        return res is null ? Err(404, "Reserva no encontrada") : Ok(ReservaDto.De(res));
    }

    [HttpPost("{code}/cancel")]
    public async Task<IActionResult> Cancelar(string code)
    {
        try
        {
            await EjecutarAsync("dbo.usp_CancelReservation", ("@UserId", UserId), ("@Code", code));
            var res = await ConsultaReservas().FirstAsync(x => x.Code == code);
            return Ok(ReservaDto.De(res));
        }
        catch (SqlException ex) when (ex.Number is >= 50001 and <= 50013) { return Err(HttpPara(ex.Number), ex.Message); }
    }

    private IQueryable<Reservation> ConsultaReservas() => db.Reservations.AsNoTracking()
        .Include(r => r.Payments)
        .Include(r => r.Event).ThenInclude(e => e.Category)
        .Include(r => r.Event).ThenInclude(e => e.Venue);

    private static int HttpPara(int errorSql) => errorSql switch { 50001 or 50011 => 404, 50006 => 409, _ => 400 };

    // Ejecuta el procedimiento y devuelve la columna Code si el procedimiento la devuelve.
    private async Task<string?> EjecutarAsync(string procedimiento, params (string Nombre, object Valor)[] parametros)
    {
        await db.Database.OpenConnectionAsync();
        try
        {
            await using var cmd = db.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = procedimiento;
            cmd.CommandType = CommandType.StoredProcedure;
            foreach (var (nombre, valor) in parametros)
            {
                var p = cmd.CreateParameter();
                p.ParameterName = nombre;
                p.Value = valor;
                cmd.Parameters.Add(p);
            }
            await using var rd = await cmd.ExecuteReaderAsync();
            return await rd.ReadAsync() ? rd.GetString(rd.GetOrdinal("Code")) : null;
        }
        finally { await db.Database.CloseConnectionAsync(); }
    }
}
