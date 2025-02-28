using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;
using System.Text;
using System.IO;
using System.Net;
using System.Net.Http.Headers;
using System.IO.Compression;

namespace LinePatrol.Controllers;

public class PdfController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

            [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile pdfFile)
        {
            if (pdfFile == null || pdfFile.Length == 0)
            {
                return BadRequest("No se ha proporcionado ningún archivo.");
            }

            using var memoryStream = new MemoryStream();
            await pdfFile.CopyToAsync(memoryStream);
            byte[] fileBytes = memoryStream.ToArray();
            
            using var compressedStream = new MemoryStream();
            using (var gzipStream = new GZipStream(compressedStream, CompressionMode.Compress))
            {
                await gzipStream.WriteAsync(fileBytes, 0, fileBytes.Length);
            }

            byte[] compressedBytes = compressedStream.ToArray();
            var content = new ByteArrayContent(compressedBytes);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/gzip");

            var cliente = new HttpClient();
            var response = await cliente.PostAsync("http://localhost:3000/api/uploadPdf", content);
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("Index");
            }
            else
            {
                return StatusCode((int)response.StatusCode, "Error al subir el archivo");
            }

            // Convertir bytes a Base64
//string base64Content = Convert.ToBase64String(fileBytes);

// Convertir Base64 de vuelta a bytes
//byte[] originalBytes = Convert.FromBase64String(base64Content);
        }
}