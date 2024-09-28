using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;

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