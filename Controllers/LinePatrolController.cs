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
        return PartialView("filter", registrosOrdenados);
    }

    [HttpPatch]
    public async Task<IActionResult> Liberar(LinePatrolLiberar linePatrolLiberar){



         if (linePatrolLiberar.imagen_after != null && linePatrolLiberar.imagen_after.Length > 0)
        {
            // Lista de extensiones de archivo válidas (en minúsculas)
            var extensionesValidas = new List<string> { ".jpg", ".jpeg", ".png", ".gif" };
            // Obtener la extensión de archivo de la imagen cargada
            var extension = Path.GetExtension(linePatrolLiberar.imagen_after.FileName).ToLower();
            // Verificar si la extensión es válida
            if (!(extensionesValidas.Contains(extension))) { return BadRequest("La extensión del archivo de imagen no es válida."); }
            var rutaCarpeta = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/" + RUTA_IMAGENES);

            // Generar un nombre de archivo único utilizando un UUID
            var nombreArchivo = $"{Guid.NewGuid()}{Path.GetExtension(linePatrolLiberar.imagen_after.FileName)}";

            var rutaImagen = Path.Combine(rutaCarpeta, nombreArchivo);

            linePatrolLiberar.path_imagen_after = RUTA_IMAGENES + nombreArchivo;
            
            // Comprimir la imagen antes de guardarla
            using (var inputStream = linePatrolLiberar.imagen_after.OpenReadStream())
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

        }else{
            return BadRequest("No se ha seleccionado ninguna imagen.");
        }

        bool respuesta;


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
