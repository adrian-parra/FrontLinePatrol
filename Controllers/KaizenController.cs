using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using System.Text;
using System.IO;
using System.Net;
namespace LinePatrol.Controllers;

public class KaizenController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public KaizenController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }
        [HttpPost]
    public async Task<IActionResult> Filter(Kaizen kaizen)
    {
   

        // Aquí puedes configurar la URL de la API externa
    string apiUrl = "http://c7share.sewsus.com.mx:9001/Kaizen/MostrarKaizen.php";

    using (var client = new HttpClient())
    {
      // Crea un objeto FormUrlEncodedContent con los datos del formulario
            var formData = new FormUrlEncodedContent(new[]
            {


                new KeyValuePair<string, string>("Fecha1", kaizen.Fecha1),
                new KeyValuePair<string, string>("Fecha2", kaizen.Fecha2),
                new KeyValuePair<string, string>("Planta", kaizen.Planta),
                new KeyValuePair<string, string>("Perfil", kaizen.Perfil),
                new KeyValuePair<string, string>("Reloj", kaizen.Reloj),

            });

            // Envía la solicitud POST con el contenido del formulario
            var response = await client.PostAsync(apiUrl, formData);

        if (response.IsSuccessStatusCode)
        {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        string hostName = string.Empty;

        if (!string.IsNullOrEmpty(ipAddress))
        {
            Logger logger = new Logger();
            try
            {
                var hostEntry = Dns.GetHostEntry(ipAddress);
                hostName = hostEntry.HostName;
                Console.WriteLine($"IP: {ipAddress}, Hostname: {hostName}");
                logger.Log($"IP: {ipAddress}, Hostname: {hostName}, Interfaz: Kaizen");

     
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener el hostname: {ex.Message} :IP: {ipAddress}");
                logger.Log($"IP: {ipAddress}, Error al obtener el hostname: {ex.Message}");
            }
        }
            var htmlTable = await response.Content.ReadAsStringAsync();
            return Content(htmlTable, "text/html");
        }
        else
        {
            // Maneja el error en caso de que la solicitud a la API falle
            return StatusCode((int)response.StatusCode, "Error al obtener datos de la API");
        }
    }

       
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
