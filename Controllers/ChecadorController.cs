using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;
using System.Text;
using System.IO;
using System.Net;

namespace LinePatrol.Controllers;

public class ChecadorController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public ChecadorController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    // [HttpGet]
    // public IActionResult RegistrarEntrada()
    // {
    //     Logger logger = new Logger();

          
    //             var hostEntry = Dns.GetHostEntry(ipAddress);
    //             hostName = hostEntry.HostName;
    //             Console.WriteLine($"IP: {ipAddress}, Hostname: {hostName}");
    //             logger.Log($"IP: {ipAddress}, Hostname: {hostName}, Interfaz: voceo");

    //             return Ok(new { status = "ok", message = "Entrada registrada con exito" });
    // }

    
   

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
