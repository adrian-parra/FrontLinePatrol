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


    [HttpGet]
    public async Task<IActionResult> ObtenerReportesGenerador()
    {
        try
        {
             var cliente = new HttpClient();

        var response = await cliente.GetAsync($"http://localhost:3000/api/reporteGenerador");

        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }
            return BadRequest();
        } catch(Exception ex)
        {
            return BadRequest();
        }
    }

    [HttpPost]
    public async Task<IActionResult> Index(ReporteGeneradorIndex reporteGenerador)
    {

        var extensionesPermitidas = new[] { ".jpg", ".jpeg", ".png" };
        var extensionArchivoHt = Path.GetExtension(reporteGenerador.imagen_horas_trabajadas.FileName).ToLower();
        var extencionArchivoBateria = Path.GetExtension(reporteGenerador.imagen_status_bateria.FileName).ToLower();
        var extencionArchivoAnticongelante = Path.GetExtension(reporteGenerador.imagen_nivel_anticongelante.FileName).ToLower();
        var extencionArchivoDiesel = Path.GetExtension(reporteGenerador.imagen_nivel_diesel.FileName).ToLower();
        var extencionArchivoAceite = Path.GetExtension(reporteGenerador.imagen_nivel_aceite.FileName).ToLower();

        if (!extensionesPermitidas.Contains(extensionArchivoHt) ||
        !extensionesPermitidas.Contains(extencionArchivoBateria) ||
        !extensionesPermitidas.Contains(extencionArchivoAnticongelante) ||
        !extensionesPermitidas.Contains(extencionArchivoDiesel) ||
        !extensionesPermitidas.Contains(extencionArchivoAceite)
        )
        {
            // Retornar un error o ignorar el archivo no válido
            return BadRequest("Solo se permiten archivos de imagen (.jpg, .jpeg, .png)");
        }


        try
        {
            // Diccionario para almacenar las rutas de las imágenes y sus campos correspondientes
            var imagenesGuardadas = new Dictionary<string, string>();

            // Lista de campos de imagen en tu modelo
            var camposImagen = new List<string> { "imagen_horas_trabajadas", "imagen_status_bateria", "imagen_nivel_anticongelante", "imagen_nivel_diesel", "imagen_nivel_aceite" };

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
                    imagenesGuardadas["path_"+campoImagen] = RUTA_IMAGENES + nombreArchivo;

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

            imagenesGuardadas.Add("responsable", reporteGenerador.responsable);
            imagenesGuardadas.Add("comentario", reporteGenerador.comentario);
            imagenesGuardadas.Add("idPlanta", reporteGenerador.idPlanta);


            var cliente = new HttpClient();

            string json = JsonConvert.SerializeObject(imagenesGuardadas);

            // Define el contenido de la solicitud HTTP
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await cliente.PostAsync("http://localhost:3000/api/reporteGenerador", content);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new
                {
                    success = true,
                    message = "Reporte de generador registrado",
                });
            }

            return StatusCode((int)response.StatusCode, new
            {
                success = false,
                message = "Error al registrar el reporte de; generador.",
                statusCode = response.StatusCode
            });
            return Ok();

        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al guardar la imagen: {ex.Message}");
            return StatusCode(500, "Ocurrió un error al guardar la imagen");
        }




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
