using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using System.Text;
using Newtonsoft.Json;
using LinePatrol.Services;

using Microsoft.AspNetCore.Http;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace LinePatrol.Controllers;

public class TareaController : Controller
{
    private IServicio_API _servicioApi;
    private const string RUTA_IMAGENES = "uploads/";

    public TareaController(IServicio_API servicioApi)
    {
        _servicioApi = servicioApi;
    }

    public async Task<IActionResult> Index()
    {
        List<LinePatrolM> lista = await _servicioApi.Lista();
        return View(lista);
        //return Json(lista);
    }


    public async Task<IActionResult> GuardarCambios()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> GuardarCambios(LinePatrolM linePatrolM)
    {
        if (linePatrolM.imagen != null && linePatrolM.imagen.Length > 0)
        {

            // Lista de extensiones de archivo válidas (en minúsculas)
            var extensionesValidas = new List<string> { ".jpg", ".jpeg", ".png", ".gif" };
            // Obtener la extensión de archivo de la imagen cargada
            var extension = Path.GetExtension(linePatrolM.imagen.FileName).ToLower();
            // Verificar si la extensión es válida
            if (!(extensionesValidas.Contains(extension))) { return BadRequest("La extensión del archivo de imagen no es válida."); }
            var rutaCarpeta = Path.Combine(Directory.GetCurrentDirectory(), RUTA_IMAGENES);

            // Generar un nombre de archivo único utilizando un UUID
            var nombreArchivo = $"{Guid.NewGuid()}{Path.GetExtension(linePatrolM.imagen.FileName)}";

            var rutaImagen = Path.Combine(rutaCarpeta, nombreArchivo);

            linePatrolM.path_imagen = RUTA_IMAGENES + nombreArchivo;



            // Comprimir la imagen antes de guardarla
            using (var inputStream = linePatrolM.imagen.OpenReadStream())
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
            //     linePatrolM.imagen.CopyTo(fileStream);
            // }

            // ! Obtener la ruta completa donde se guardó la imagen
            //var rutaCompletaImagen = Path.GetFullPath(rutaImagen);

        }
        else
        {
            return Content("No se ha seleccionado ninguna imagen.");
        }
        bool respuesta;


        respuesta = await _servicioApi.Guardar(linePatrolM);


        if (respuesta)
            return NoContent();
        else
            return NoContent();

    }


    [HttpPost]
    public async Task<IActionResult> GuardarImagen(string descripcion, string planta, IFormFile imagen)
    {
        if (imagen != null && imagen.Length > 0)
        {
            var rutaCarpeta = Path.Combine(Directory.GetCurrentDirectory(), RUTA_IMAGENES);
            var nombreArchivo = Path.GetFileName(imagen.FileName);
            var rutaImagen = Path.Combine(rutaCarpeta, nombreArchivo);

            using (var fileStream = new FileStream(rutaImagen, FileMode.Create))
            {
                imagen.CopyTo(fileStream);
            }
            Console.WriteLine("El valor de respuesta es: " + descripcion);
            // Aquí puedes manejar la descripción y la planta como desees
            // Por ejemplo, guardarlos en la base de datos junto con la ruta de la imagen
            return Content("Datos y imagen guardados correctamente.");
            //  return NoContent();
        }
        else
        {
            return Content("No se ha seleccionado ninguna imagen.");
            //  return NoContent();
        }
    }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
