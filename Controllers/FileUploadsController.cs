using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using System.Net.Http.Headers;

using Newtonsoft.Json;

using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using System.Net;
namespace LinePatrol.Controllers;


public class FileUploadsController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly HttpClient _httpClient = new HttpClient { BaseAddress = new Uri("http://localhost:3000/api") };


    public FileUploadsController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public async Task<IActionResult> Index()
    {
        // var response = await _httpClient.GetAsync("/files");
        var cliente = new HttpClient();

        var response = await cliente.GetAsync($"http://localhost:3000/api/files");


        // Asegúrate de que la respuesta fue exitosa
        if (!response.IsSuccessStatusCode)
        {
            // Muestra el error o registra un log
            var errorContent = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Error al llamar a la API: {response.StatusCode} - {errorContent}");
            return View(new List<FileModel>()); // Devuelve una vista vacía
        }

        var files = await response.Content.ReadAsStringAsync();

        // Solo deserializa si el contenido es JSON válido
        try
        {
            var fileList = JsonConvert.DeserializeObject<List<FileModel>>(files);
            return View(fileList);
        }
        catch (JsonReaderException ex)
        {
            Console.WriteLine($"Error de JSON: {ex.Message} - Contenido: {files}");
            return View(new List<FileModel>());
        }
    }


    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null) return RedirectToAction("Index");

        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        // Generar un nombre de archivo único utilizando un UUID
        var nombreArchivo = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";

        var filePath = Path.Combine("uploads", nombreArchivo);

        // Guarda el archivo en el servidor ASP.NET
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }




        // Registra la información en Express
        var payload = new
        {
            fileName,
            filePath = $"uploads/{nombreArchivo}"
        };

        // OBTENER HOSTNAME E IP
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            string hostName = string.Empty;

            if (!string.IsNullOrEmpty(ipAddress))
            {
                try
                {
                    var hostEntry = Dns.GetHostEntry(ipAddress);
                    hostName = hostEntry.HostName;
                }
                catch (Exception ex)
                {
                    hostName = "NOT DEFINED";
                }
            }

        var cliente = new HttpClient();

          string headerValue = ipAddress + ":" + hostName;


            // Agregar el encabezado personalizado
            cliente.DefaultRequestHeaders.Add("X-Custom-Host", headerValue);



        await cliente.PostAsJsonAsync("http://localhost:3000/api/files", payload);


        return RedirectToAction("Index");
    }


    public IActionResult Download(string filePath)
    {
        try
        {
            // Construir la ruta absoluta
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), filePath);

            // Verificar si el archivo existe
            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound("El archivo no fue encontrado.");
            }

            // Devolver el archivo
            return PhysicalFile(fullPath, "application/octet-stream", Path.GetFileName(filePath));
        }
        catch (Exception ex)
        {
            // Manejo genérico de errores
            return StatusCode(500, $"Ocurrió un error al descargar el archivo: {ex.Message}");
        }
    }


    [HttpPost]
    public async Task<IActionResult> DeleteFile(string filePath)
    {
        try
        {
            var payload = new
            {
                filePath = filePath
            };

            // OBTENER HOSTNAME E IP
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            string hostName = string.Empty;

            if (!string.IsNullOrEmpty(ipAddress))
            {
                try
                {
                    var hostEntry = Dns.GetHostEntry(ipAddress);
                    hostName = hostEntry.HostName;
                }
                catch (Exception ex)
                {
                    hostName = "NOT DEFINED";
                }
            }


            var cliente = new HttpClient();

            string headerValue = ipAddress + ":" + hostName;


            // Agregar el encabezado personalizado
            cliente.DefaultRequestHeaders.Add("X-Custom-Host", headerValue);

            var response = await cliente.PutAsJsonAsync($"http://localhost:3000/api/files", payload);


            // Asegúrate de que la respuesta fue exitosa
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode(403, "Este archivo está protegido y no se puede eliminar.");
            }

            // Construir la ruta absoluta
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), filePath);

            // Verificar si el archivo existe
            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound("El archivo no fue encontrado.");
            }

            // Eliminar el archivo
            System.IO.File.Delete(fullPath);

            // Confirmar que se eliminó correctamente
            return Ok("El archivo fue eliminado correctamente.");
        }
        catch (Exception ex)
        {
            // Manejo genérico de errores
            return StatusCode(500, $"Ocurrió un error al eliminar el archivo: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> SaveImage(IFormFile image)
    {
        if (image == null || image.Length == 0)
            return BadRequest("No se proporcionó imagen");
    
        try 
        {
            // Ruta absoluta directa
            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "soportes");
            Directory.CreateDirectory(uploadFolder);
    
            // Nombre de archivo único
            var fileName = $"soporte_{DateTime.Now:yyyyMMddHHmmss}.png";
            var filePath = Path.Combine(uploadFolder, fileName);
    
            // Guardar archivo
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
    
             // Devuelve un objeto JSON sin redirigir
        return Json(new { 
            success = true,
            message = "Imagen guardada exitosamente", 
            path = $"/images/soportes/{fileName}" 
        });
        }
        catch (Exception ex)
        {
           // Devuelve un objeto JSON de error
        return Json(new { 
            success = false,
            message = $"Error interno: {ex.Message}" 
        });
        }
    }



    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }

    
}


