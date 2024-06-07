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
    string apiUrl = "http://172.30.73.72:9001/intranet/regresaVoceosCTS.php";

    using (var client = new HttpClient())
    {
      // Crea un objeto FormUrlEncodedContent con los datos del formulario
            var formData = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("fecha1", voceo.fecha1),
                new KeyValuePair<string, string>("fecha2", voceo.fecha2),
                new KeyValuePair<string, string>("Planta", voceo.Planta),
                new KeyValuePair<string, string>("Departamento", voceo.Departamento),
            });

            // Envía la solicitud POST con el contenido del formulario
            var response = await client.PostAsync(apiUrl, formData);

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