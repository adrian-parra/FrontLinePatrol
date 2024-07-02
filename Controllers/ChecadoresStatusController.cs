using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;

namespace LinePatrol.Controllers;

public class ChecadoresStatusController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public ChecadoresStatusController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> ConsultarEstadoChecadores()
    {
        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        // string json = JsonConvert.SerializeObject(cmd);

        // Define el contenido de la solicitud HTTP
        // var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        // Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PostAsync("http://localhost:3000/api/cmd/ping", null);



        if (response.IsSuccessStatusCode)
        {

           
                var respuesta = await response.Content.ReadAsStringAsync();
                
                return Content(respuesta);
            
           

        }

        return BadRequest();
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
