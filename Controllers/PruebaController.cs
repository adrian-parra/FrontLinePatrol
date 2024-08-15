using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;

namespace LinePatrol.Controllers;

public class PruebaController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public PruebaController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> ConsultarImagen(CodigoBarras codigoBarras)
    {

        var nameImagen = codigoBarras.valor;

         Console.WriteLine(nameImagen);
        // Verifica que la ruta no sea nula o vacía
        if (string.IsNullOrEmpty(nameImagen))
        {
            return BadRequest("La ruta de la imagen no puede estar vacía.");
        }

        // Asegúrate de que la ruta sea válida
        var rutaCompleta = Path.Combine(@"\\c7share\Sistemas\Adrian-Parra\", nameImagen);

        // Verifica si el archivo existe
        if (!System.IO.File.Exists(rutaCompleta))
        {
            return NotFound("La imagen no se encontró en la ruta especificada.");
        }

        // Lee el archivo de imagen
        var imagenBytes = await System.IO.File.ReadAllBytesAsync(rutaCompleta);

        // Devuelve la imagen como un archivo
        return File(imagenBytes, "image/jpeg"); // Cambia el tipo MIME según el formato de la imagen
    }
   

   

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
