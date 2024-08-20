using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;

namespace LinePatrol.Controllers;

public class SignatureController : Controller
{

    private const string RUTA_IMAGENES_FIRMAS = "images/firmas/";

    private readonly ILogger<HomeController> _logger;

    public SignatureController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }


    [HttpPost]
    public async Task<IActionResult> SubirImagen(IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest("No se ha recibido ninguna imagen.");
        }

        var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/" + RUTA_IMAGENES_FIRMAS);

         // Generar un nombre de archivo único utilizando un UUID
        var nombreArchivo = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";

         var rutaImagen = Path.Combine(path, nombreArchivo);

        using (var stream = new FileStream(rutaImagen, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        return Ok(new { mensaje = "Imagen guardada exitosamente." });
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
