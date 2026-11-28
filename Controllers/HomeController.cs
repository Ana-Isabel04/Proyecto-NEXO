using Microsoft.AspNetCore.Mvc;

namespace Nexo.Controllers;

// Marcador temporal: las pantallas públicas (RF-01 a RF-36) se integran aquí.
public class HomeController : Controller
{
    public IActionResult Index() => View();

    [IgnoreAntiforgeryToken]
    public IActionResult Error() => View();
}
