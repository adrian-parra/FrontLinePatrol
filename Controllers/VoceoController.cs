using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;

namespace LinePatrol.Controllers;

public class VoceoController : Controller
{
     public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Filter(Voceo voceo)
    {

        // Aquí puedes configurar la URL de la API externa
    string apiUrl = "http://localhost:3000/api/voseo";

    using (var client = new HttpClient())
    {
        // Configura el contenido de la solicitud POST
        var content = new StringContent(JsonConvert.SerializeObject(voceo), System.Text.Encoding.UTF8, "application/json");

        var response = await client.PostAsync(apiUrl, content);

        if (response.IsSuccessStatusCode)
        {
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
}