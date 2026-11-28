using Microsoft.AspNetCore.Mvc;

namespace Nexo.Controllers;

// La experiencia pública (RF-01 a RF-36) vive en el cliente React servido en /app.
public class HomeController : Controller
{
    public IActionResult Index() => Redirect("/app/");

    [IgnoreAntiforgeryToken]
    public IActionResult Error() => View();
}
