using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using System.Net.Http.Headers;

using Newtonsoft.Json;

using Microsoft.AspNetCore.Http;
using System.IO;
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

        var cliente = new HttpClient();

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

            var cliente = new HttpClient();

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



    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}


