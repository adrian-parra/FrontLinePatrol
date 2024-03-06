using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using System.Text;
using Newtonsoft.Json;

using LinePatrol.Services;

namespace LinePatrol.Controllers;

public class TareaController : Controller
{
    private IServicio_API _servicioApi;

    public TareaController(IServicio_API servicioApi)
    {
        _servicioApi = servicioApi;
    }

    public async Task<IActionResult> Index()
    {
        List<Tarea> lista =  await _servicioApi.Lista();
        return View(lista);
    }


    public async Task<IActionResult> GuardarCambios(){
        return View();
    }

     [HttpPost]
        public async Task<IActionResult> GuardarCambios(Tarea ob_producto) {

            bool respuesta;

           
                respuesta = await _servicioApi.Guardar(ob_producto);
         
           

            Console.WriteLine("El valor de respuesta es: " + respuesta);

            if (respuesta)
                // return RedirectToAction("Index");
                return NoContent();
            else
                return NoContent();

        }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
