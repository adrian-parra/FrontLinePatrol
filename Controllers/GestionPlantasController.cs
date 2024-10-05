using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;

namespace LinePatrol.Controllers;

public class GestionPlantasController : Controller
{


    public GestionPlantasController()
    {

    }

    [HttpGet]
    public async Task<IActionResult> ObtenerEquiposComputo(string idPlanta)
    {
        var cliente = new HttpClient();

        var response = await cliente.GetAsync($"http://localhost:3000/api/gestion/planta/equipoComputo?idPlanta={idPlanta}");

        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }

        return BadRequest();
    }



    [HttpPost]
    public async Task<IActionResult> GuardarEquipoComputo(GestionPlantasEquipoComputo gestionPlantasEquipoComputo)
    {
        try
        {
            var cliente = new HttpClient();

            string json = JsonConvert.SerializeObject(gestionPlantasEquipoComputo);

            // Define el contenido de la solicitud HTTP
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await cliente.PostAsync("http://localhost:3000/api/gestion/planta/equipoComputo/", content);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new
                {
                    success = true,
                    message = "Equipo registrado",
                    data = gestionPlantasEquipoComputo
                });
            }

            return StatusCode((int)response.StatusCode, new
            {
                success = false,
                message = "Error al registrar equipo de cómputo.",
                statusCode = response.StatusCode
            });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Error en la comunicación con el servicio externo.",
                error = ex.Message
            });
        }

    }


    [HttpPost]
    public async Task<IActionResult> AsignarSoftwareEquipoComputo(string idEquipoComputo, string idSoftware)
    {
        using var cliente = new HttpClient();

        var data = new
        {
            idEquipoComputo = idEquipoComputo,
            idSoftware = idSoftware
        };

        string json = JsonConvert.SerializeObject(data);

        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

        try
        {
            var response = await cliente.PostAsync("http://localhost:3000/api/gestion/planta/equipoComputo/add/software", content);

            if (response.IsSuccessStatusCode)
            {
                // Retorna un JSON indicando éxito
                return Ok(new
                {
                    success = true,
                    message = "Software asignado correctamente al equipo de cómputo.",
                    data = new { idEquipoComputo, idSoftware }
                });
            }
            else
            {
                // Retorna un JSON en caso de error en la solicitud
                return StatusCode((int)response.StatusCode, new
                {
                    success = false,
                    message = "Error al asignar software al equipo de cómputo.",
                    statusCode = response.StatusCode
                });
            }
        }
        catch (Exception ex)
        {
            // Retorna un JSON en caso de excepción
            return StatusCode(500, new
            {
                success = false,
                message = "Ocurrió un error en el servidor.",
                error = ex.Message
            });
        }
    }

    [HttpPost]
    public async Task<IActionResult> AsignarEstacionUbicacionEquipoComputo(string idLinea, string idEstacion, string idEquipo)
    {
        // Validar parámetros
        if (string.IsNullOrWhiteSpace(idLinea) || string.IsNullOrWhiteSpace(idEstacion) || string.IsNullOrWhiteSpace(idEquipo))
        {
            return BadRequest(new
            {
                success = false,
                message = "Los parámetros 'idLinea', 'idEstacion' y 'idEquipo' son requeridos."
            });
        }

        var data = new
        {
            idLinea,
            idEstacion,
            idEquipo
        };

        string json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

        try
        {
            var cliente = new HttpClient();
            var response = await cliente.PostAsync("http://localhost:3000/api/gestion/planta/equipoComputo/add/estacionUbicacion", content);

            if (response.IsSuccessStatusCode)
            {
                return Ok(new
                {
                    success = true,
                    message = "Estación/Ubicación asignada correctamente al equipo de cómputo.",
                    data
                });
            }
            else
            {
                return StatusCode((int)response.StatusCode, new
                {
                    success = false,
                    message = "Error al asignar estación al equipo de cómputo.",
                    statusCode = response.StatusCode
                });
            }
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Error de comunicación con el servicio externo.",
                error = ex.Message
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                success = false,
                message = "Ocurrió un error en el servidor.",
                error = ex.Message
            });
        }
    }


    [HttpGet]
    public async Task<IActionResult> ObtenerSoftware()
    {
        var cliente = new HttpClient();

        var response = await cliente.GetAsync($"http://localhost:3000/api/gestion/planta/software");

        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }

        return BadRequest();
    }



  [HttpGet]
    public async Task<IActionResult> ObtenerPlantas()
    {
        var cliente = new HttpClient();

        var response = await cliente.GetAsync($"http://localhost:3000/api/gestion/planta/equipoComputo/plantas");

        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }

        return BadRequest();
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerEstacionesUbicacion()
    {
        var cliente = new HttpClient();

        var response = await cliente.GetAsync($"http://localhost:3000/api/gestion/planta/equipoComputo/estaciones");

        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }

        return BadRequest();
    }


    [HttpGet]
    public async Task<IActionResult> ObtenerLineas()
    {
        var cliente = new HttpClient();

        var response = await cliente.GetAsync($"http://localhost:3000/api/gestion/planta/equipoComputo/lineas");

        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }

        return BadRequest();
    }

    // Endpoint para registrar una nueva Planta
    [HttpPost]
    public async Task<IActionResult> RegistrarPlanta(PlantaDto plantaDto)
    {
        if (string.IsNullOrWhiteSpace(plantaDto.Nombre))
        {
            return BadRequest(new { success = false, message = "El nombre de la planta es requerido." });
        }

        var data = new { nombre = plantaDto.Nombre, estado = plantaDto.Estado };

        string json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

         var cliente = new HttpClient();

        var response = await cliente.PostAsync("http://localhost:3000/api/gestion/planta/equipoComputo/plantas", content);

        if (response.IsSuccessStatusCode)
        {
            return Ok(new { success = true, message = "Planta registrada correctamente." });
        }

        return StatusCode((int)response.StatusCode, new { success = false, message = "Error al registrar la planta." });
    }

    // Endpoint para registrar una nueva Linea
    [HttpPost]
    public async Task<IActionResult> RegistrarLinea(LineaDto lineaDto)
    {
        if (string.IsNullOrWhiteSpace(lineaDto.Nombre) || lineaDto.IdPlanta <= 0)
        {
            return BadRequest(new { success = false, message = "El nombre de la línea y el ID de la planta son requeridos." });
        }

        var data = new { nombre = lineaDto.Nombre, idPlanta = lineaDto.IdPlanta, estado = lineaDto.Estado };

        string json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
         var cliente = new HttpClient();
        var response = await cliente.PostAsync("http://localhost:3000/api/linea", content);

        if (response.IsSuccessStatusCode)
        {
            return Ok(new { success = true, message = "Línea registrada correctamente." });
        }

        return StatusCode((int)response.StatusCode, new { success = false, message = "Error al registrar la línea." });
    }

    // Endpoint para registrar una nueva Estacion
    [HttpPost]
    public async Task<IActionResult> RegistrarEstacion(EstacionDto estacionDto)
    {
        if (string.IsNullOrWhiteSpace(estacionDto.Nombre))
        {
            return BadRequest(new { success = false, message = "El nombre de la estación es requerido." });
        }

        var data = new { nombre = estacionDto.Nombre, estado = estacionDto.Estado };

        string json = JsonConvert.SerializeObject(data);
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
        var cliente = new HttpClient();
        var response = await cliente.PostAsync("http://localhost:3000/api/gestion/planta/equipoComputo/estaciones", content);

        if (response.IsSuccessStatusCode)
        {
            return Ok(new { success = true, message = "Estación registrada correctamente." });
        }

        return StatusCode((int)response.StatusCode, new { success = false, message = "Error al registrar la estación." });
    }

    // DTOs para las solicitudes
    public class PlantaDto
    {
        public string Nombre { get; set; }
        public bool Estado { get; set; } = true; // Valor por defecto
    }

    public class LineaDto
    {
        public string Nombre { get; set; }
        public int IdPlanta { get; set; }
        public bool Estado { get; set; } = true; // Valor por defecto
    }

    public class EstacionDto
    {
        public string Nombre { get; set; }
        public bool Estado { get; set; } = true; // Valor por defecto
    }
    public IActionResult Index()
    {
        return View();
    }



    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}