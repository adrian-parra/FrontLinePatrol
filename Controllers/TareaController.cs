using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using System.Text;
using Newtonsoft.Json;
using LinePatrol.Services;

using Microsoft.AspNetCore.Http;
using System.IO;

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
            var rutaCarpeta = Path.Combine(Directory.GetCurrentDirectory(), RUTA_IMAGENES);

            // Generar un nombre de archivo único utilizando un UUID
            var nombreArchivo = $"{Guid.NewGuid()}{Path.GetExtension(linePatrolM.imagen.FileName)}";

            var rutaImagen = Path.Combine(rutaCarpeta, nombreArchivo);

            linePatrolM.path_imagen = RUTA_IMAGENES + nombreArchivo;


            // Guardar la imagen en el sistema de archivos
            using (var fileStream = new FileStream(rutaImagen, FileMode.Create))
            {
                linePatrolM.imagen.CopyTo(fileStream);
            }

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
