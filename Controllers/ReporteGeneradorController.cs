using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;

using System.Text;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Http;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace LinePatrol.Controllers;

public class ReporteGeneradorController : Controller
{
    private readonly ILogger<HomeController> _logger;
     private const string RUTA_IMAGENES = "images/reporteGenerador/";

    public ReporteGeneradorController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

     [HttpPost]
    public async Task<IActionResult> Index(ReporteGeneradorIndex reporteGenerador)
    {
       // Accede a los valores del formulario a través del objeto 'reporteGenerador'
    string reloj = reporteGenerador.reloj;
    IFormFile imagenHorasTrabajadas = reporteGenerador.imagen_horas_trabajadas;
    IFormFile imagenStatusBateria = reporteGenerador.imagen_status_bateria;
    // ... accede a otros campos de manera similar ...

    // Imprime los valores en la consola
    Console.WriteLine($"Reloj: {reloj}");
    Console.WriteLine($"Nombre de archivo de imagen_horas_trabajadas: {imagenHorasTrabajadas?.FileName ?? "No se seleccionó ninguna imagen"}");
    Console.WriteLine($"Nombre de archivo de imagen_status_bateria: {imagenStatusBateria?.FileName ?? "No se seleccionó ninguna imagen"}");
    // ... imprime otros valores de manera similar ...

    // Resto de la lógica de tu controlador...

     // Diccionario para almacenar las rutas de las imágenes y sus campos correspondientes
    var imagenesGuardadas = new Dictionary<string, string>();

    // Lista de campos de imagen en tu modelo
    var camposImagen = new List<string> { "imagen_horas_trabajadas", "imagen_status_bateria", "image_nivel_anticongelante", "imagen_nivel_diesel", "imagen_nivel_aceite" };

    // Iterar sobre los campos de imagen
    foreach (var campoImagen in camposImagen)
    {
        // Obtener la imagen del formulario usando reflection
        var propiedadImagen = typeof(ReporteGeneradorIndex).GetProperty(campoImagen);
        var imagen = (IFormFile)propiedadImagen.GetValue(reporteGenerador);

        if (imagen != null && imagen.Length > 0)
        {
            // ... (código para validar la extensión de la imagen) ...

            var rutaCarpeta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/" + RUTA_IMAGENES);
            var nombreArchivo = $"{Guid.NewGuid()}{Path.GetExtension(imagen.FileName)}";
            var rutaImagen = Path.Combine(rutaCarpeta, nombreArchivo);

            // Guardar la ruta de la imagen en el diccionario junto con el nombre del campo
            imagenesGuardadas[campoImagen] = RUTA_IMAGENES + nombreArchivo;

            // Comprimir y guardar la imagen
            using (var inputStream = imagen.OpenReadStream())
            {
                using (var outputStream = new FileStream(rutaImagen, FileMode.Create))
                {
                    using (var image = Image.Load(inputStream))
                    {
                        image.Mutate(x => x.Resize(image.Width, image.Height));
                        var encoder = new JpegEncoder { Quality = 70 };
                        image.Save(outputStream, encoder);
                    }
                }
            }
        }
    }

    return Ok();
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
