using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;

namespace LinePatrol.Controllers;

public class GestionPlantasController : Controller
{
   

    public GestionPlantasController()
    {
       
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerEquiposComputo(string idPlanta)
    {
        var cliente = new HttpClient();
       
        var response = await cliente.GetAsync($"http://localhost:3000/api/gestion/planta/equipoComputo?idPlanta={idPlanta}");

        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }

        return BadRequest();
    }



    [HttpPost]
    public async Task<bool> GuardarEquipoComputo(GestionPlantasEquipoComputo gestionPlantasEquipoComputo)
    {
        var cliente = new HttpClient();

        string json = JsonConvert.SerializeObject(gestionPlantasEquipoComputo);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        var response = await cliente.PostAsync("http://localhost:3000/api/gestion/planta/equipoComputo/", content);



        if (response.IsSuccessStatusCode)
        {
            return false;
        }

        return true;
    }


    [HttpPost]
public async Task<IActionResult> AsignarSoftwareEquipoComputo(string idEquipoComputo, string idSoftware)
{
    using var cliente = new HttpClient();

    var data = new
    {
        idEquipoComputo = idEquipoComputo,
        idSoftware = idSoftware
    };

    string json = JsonConvert.SerializeObject(data);

    var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

    try
    {
        var response = await cliente.PostAsync("http://localhost:3000/api/gestion/planta/equipoComputo/add/software", content);

        if (response.IsSuccessStatusCode)
        {
            // Retorna un JSON indicando éxito
            return Ok(new
            {
                success = true,
                message = "Software asignado correctamente al equipo de cómputo.",
                data = new { idEquipoComputo, idSoftware }
            });
        }
        else
        {
            // Retorna un JSON en caso de error en la solicitud
            return StatusCode((int)response.StatusCode, new
            {
                success = false,
                message = "Error al asignar software al equipo de cómputo.",
                statusCode = response.StatusCode
            });
        }
    }
    catch (Exception ex)
    {
        // Retorna un JSON en caso de excepción
        return StatusCode(500, new
        {
            success = false,
            message = "Ocurrió un error en el servidor.",
            error = ex.Message
        });
    }
}




    [HttpGet]
    public async Task<IActionResult> ObtenerSoftware()
    {
        var cliente = new HttpClient();
       
        var response = await cliente.GetAsync($"http://localhost:3000/api/gestion/planta/software");

        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }

        return BadRequest();
    }
    public IActionResult Index()
    {
        return View();
    }

    

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}