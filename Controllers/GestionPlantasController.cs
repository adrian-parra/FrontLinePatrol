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