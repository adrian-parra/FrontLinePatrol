using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using System.Text;
using Newtonsoft.Json;
using LinePatrol.Services.Interfaces;

using Microsoft.AspNetCore.Http;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using System.Net;

namespace LinePatrol.Controllers;

public class LinePatrolController : Controller
{
     private readonly ILinePatrol linePatrol;
    private const string RUTA_IMAGENES = "images/linePatrol/";

    public LinePatrolController(ILinePatrol linePatrol)
    {
        this.linePatrol = linePatrol;
    }

    public async Task<IActionResult> Index()
    {
        List<LinePatrolListado> lista = await linePatrol.Lista();
        return View(lista);
        //return Json(lista);
    }

    [HttpPost]
    public async Task<IActionResult> Filter(LinePatrolFilter linePatrolFilter)
    {
        List<LinePatrolListado> listaFilter = await linePatrol.Filter(linePatrolFilter);
        var registrosOrdenados = listaFilter.OrderByDescending(r => r.id).ToList();
          var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        string hostName = string.Empty;

        if (!string.IsNullOrEmpty(ipAddress))
        {
            Logger logger = new Logger();
            try
            {
                var hostEntry = Dns.GetHostEntry(ipAddress);
                hostName = hostEntry.HostName;
                Console.WriteLine($"IP: {ipAddress}, Hostname: {hostName}");
                logger.Log($"IP: {ipAddress}, Hostname: {hostName}");

     
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener el hostname: {ex.Message} :IP: {ipAddress}");
                logger.Log($"IP: {ipAddress}, Error al obtener el hostname: {ex.Message}");
            }
        }

        
        return PartialView("filter", registrosOrdenados);
    }


   [HttpPatch]
    public async Task<IActionResult> CorregirHallazgo(LinePatrolLiberar linePatrolLiberar)
{
    try
    {
        // Validar si se seleccionó una imagen
        if (linePatrolLiberar.imagen_after == null || linePatrolLiberar.imagen_after.Length == 0)
        {
            return BadRequest("No se ha seleccionado ninguna imagen.");
        }

        // Validar la extensión del archivo de imagen
        var extensionesValidas = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(linePatrolLiberar.imagen_after.FileName).ToLowerInvariant();
        if (!extensionesValidas.Contains(extension))
        {
            return BadRequest("La extensión del archivo de imagen no es válida.");
        }

        // Generar un nombre de archivo único utilizando un UUID
        var nombreArchivo = $"{Guid.NewGuid()}{extension}";

        // Construir la ruta completa de la imagen
        var rutaImagen = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", RUTA_IMAGENES, nombreArchivo);

        // Guardar la ruta relativa de la imagen en el modelo
        linePatrolLiberar.path_imagen_after = Path.Combine(RUTA_IMAGENES, nombreArchivo);

        // Comprimir y guardar la imagen utilizando ImageSharp
        using (var inputStream = linePatrolLiberar.imagen_after.OpenReadStream())
        using (var image = Image.Load(inputStream))
        {
            // Redimensionar la imagen si es necesario
            image.Mutate(x => x.Resize(image.Width, image.Height));

            // Guardar la imagen comprimida en formato JPEG con una calidad del 70%
            image.Save(rutaImagen, new JpegEncoder { Quality = 70 });
        }

        // Intentar liberar el hallazgo
        bool respuesta = await linePatrol.Liberar(linePatrolLiberar);

        if (!respuesta)
        {
            // Manejar el error al liberar el hallazgo, por ejemplo, registrar el error
            // _logger.LogError("Error al liberar el hallazgo.", linePatrolLiberar);
            return StatusCode(500, "Error al liberar el hallazgo.");
        }

        return NoContent();
    }
    catch (Exception ex)
    {
        // Registrar la excepción
        // _logger.LogError(ex, "Se produjo una excepción al corregir el hallazgo.");

        // Devolver un error genérico al usuario
        return StatusCode(500, "Se produjo un error al procesar la solicitud.");
    }
}


    [HttpPatch]
    public async Task<IActionResult> Liberar(LinePatrolLiberar linePatrolLiberar){

        bool respuesta;

        linePatrolLiberar.estado = false;

        respuesta = await linePatrol.Liberar(linePatrolLiberar);
        

        if (respuesta)
            return NoContent();
        else
            return NoContent();
        

    }
    


    public async Task<IActionResult> GuardarCambios()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> GuardarCambios(LinePatrolRegister linePatrolRegister)
    {
        if (linePatrolRegister.imagen != null && linePatrolRegister.imagen.Length > 0)
        {

            // Lista de extensiones de archivo válidas (en minúsculas)
            var extensionesValidas = new List<string> { ".jpg", ".jpeg", ".png", ".gif" };
            // Obtener la extensión de archivo de la imagen cargada
            var extension = Path.GetExtension(linePatrolRegister.imagen.FileName).ToLower();
            // Verificar si la extensión es válida
            if (!(extensionesValidas.Contains(extension))) { return BadRequest("La extensión del archivo de imagen no es válida."); }
            var rutaCarpeta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/" + RUTA_IMAGENES);

            // Generar un nombre de archivo único utilizando un UUID
            var nombreArchivo = $"{Guid.NewGuid()}{Path.GetExtension(linePatrolRegister.imagen.FileName)}";

            var rutaImagen = Path.Combine(rutaCarpeta, nombreArchivo);

            linePatrolRegister.path_imagen = RUTA_IMAGENES + nombreArchivo;



            // Comprimir la imagen antes de guardarla
            using (var inputStream = linePatrolRegister.imagen.OpenReadStream())
            {
                using (var outputStream = new FileStream(rutaImagen, FileMode.Create))
                {
                    // Cargar la imagen utilizando ImageSharp
                    using (var image = Image.Load(inputStream))
                    {
                        // Aplicar la compresión a la imagen
                        image.Mutate(x => x
                            .Resize(image.Width, image.Height)); // Ajustar el tamaño si es necesario

                        // Configurar la calidad de compresión
                        var encoder = new JpegEncoder
                        {
                            Quality = 70 // Ajustar la calidad de compresión según sea necesario
                        };

                        // Guardar la imagen comprimida en el sistema de archivos
                        image.Save(outputStream, encoder);
                    }
                }
            }
            // Guardar la imagen en el sistema de archivos
            // using (var fileStream = new FileStream(rutaImagen, FileMode.Create))
            // {
            //     linePatrolRegister.imagen.CopyTo(fileStream);
            // }

            // ! Obtener la ruta completa donde se guardó la imagen
            //var rutaCompletaImagen = Path.GetFullPath(rutaImagen);

        }
        else
        {
            return BadRequest("No se ha seleccionado ninguna imagen.");
        }
        bool respuesta;


        respuesta = await linePatrol.Guardar(linePatrolRegister);


        if (respuesta)
            return NoContent();
        else
            return BadRequest("Error al guardar los datos.");

    }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
