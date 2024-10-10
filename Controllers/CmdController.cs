using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;
using System.Management;

namespace LinePatrol.Controllers;

public class CmdController : Controller
{

    //private static ManagementScope scope;
    private readonly ILogger<HomeController> _logger;

    public CmdController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public ActionResult EliminarProducto(string productName ,string ip)
    {
        try
        {

             Console.WriteLine($"IP recibida:.{ip}., Producto: .{productName}.");
            // Crear el alcance de la conexión WMI al equipo remoto

            ManagementScope scope = new ManagementScope($"\\\\{ip}\\root\\cimv2");
            scope.Connect();
            // Crea la consulta para encontrar el producto
            ObjectQuery query = new ObjectQuery($"SELECT * FROM Win32_Product WHERE Name = '{productName}'");
            ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);


            // Recopila los productos a desinstalar
            ManagementObjectCollection products = searcher.Get();
            Console.WriteLine($"Producto: {products}");
            if (products.Count == 0)
            {
                return Json(new { success = false, message = "No se encontró ningún producto para desinstalar." });
            }

            // Desinstala los productos
            foreach (ManagementObject product in products)
            {
                try
                {
                    product.InvokeMethod("Uninstall", null);
                }
                catch (Exception ex)
                {
                    // Registra o maneja errores individuales de desinstalación de productos
                    return Json(new { success = false, message = $"Error al desinstalar {productName}: {ex.Message}" });
                }
            }

            return Json(new { success = true, message = "El producto ha sido desinstalado." });
        }
        catch (Exception ex)
        {
            return Json(new { success = false, message = $"Error: {ex.Message}" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Ejecutar(Cmd cmd)
    {
        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(cmd);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PostAsync("http://localhost:3000/api/cmd/", content);



        if (response.IsSuccessStatusCode)
        {


            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);



        }

        return BadRequest();
    }

    [HttpPost]
    public async Task<IActionResult> ObtenerInfoDeviceWmi(string ip)
    {
        // Imprimir la IP recibida en la consola
        Console.WriteLine($"IP recibida: {ip}");
        var hostname = new
        {
            ip = ip // Asignar la IP recibida como parámetro
        };
        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(hostname);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PostAsync("http://localhost:3000/api/cmd/wmi/info/", content);



        if (response.IsSuccessStatusCode)
        {


            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);



        }

        return BadRequest();
    }


     [HttpPost]
    public async Task<IActionResult> TestConection(string ip)
    {
        // Imprimir la IP recibida en la consola
        Console.WriteLine($"IP recibida: {ip}");
        var hostname = new
        {
            ip = ip // Asignar la IP recibida como parámetro
        };
        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(hostname);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PostAsync("http://localhost:3000/api/cmd/testConection/", content);



        if (response.IsSuccessStatusCode)
        {

            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);

        }

        return BadRequest();
    }



    [HttpPost]
    public async Task<IActionResult> CloseAppWmi(string ip, string app)
    {
        // Imprimir la IP recibida en la consola
        Console.WriteLine($"IP recibida: {ip}");
        Console.WriteLine($"IP recibida: {app}");

        var pc = new
        {
            ip = ip, // Asignar la IP recibida como parámetro
            app = app
        };
        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(pc);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);

        var response = await cliente.PostAsync("http://localhost:3000/api/cmd/wmi/apps/close/", content);
        if (response.IsSuccessStatusCode)
        {
            var respuesta = await response.Content.ReadAsStringAsync();
            return Content(respuesta);
        }

        return BadRequest();
    }


    [HttpPost]
    public async Task<IActionResult> RestartDeviceWmi(string ip)
    {
        // Imprimir la IP recibida en la consola
        Console.WriteLine($"IP recibida: {ip}");
        var hostname = new
        {
            ip = ip // Asignar la IP recibida como parámetro
        };
        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(hostname);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PostAsync("http://localhost:3000/api/cmd/wmi/restart/device/", content);



        if (response.IsSuccessStatusCode)
        {


            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);



        }

        return BadRequest();
    }


 [HttpPost]
    public async Task<IActionResult> ApagarDeviceWmi(string ip)
    {
        // Imprimir la IP recibida en la consola
        Console.WriteLine($"IP recibida: {ip}");
        var hostname = new
        {
            ip = ip // Asignar la IP recibida como parámetro
        };
        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(hostname);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PostAsync("http://localhost:3000/api/cmd/wmi/ShutdownDevice", content);



        if (response.IsSuccessStatusCode)
        {


            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);



        }

        return BadRequest();
    }


[HttpPost]
    public async Task<IActionResult> UptimeDeviceWmi(string ip)
    {
        // Imprimir la IP recibida en la consola
        Console.WriteLine($"IP recibida: {ip}");
        var hostname = new
        {
            ip = ip // Asignar la IP recibida como parámetro
        };
        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(hostname);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PostAsync("http://localhost:3000/api/cmd/wmi/uptime", content);



        if (response.IsSuccessStatusCode)
        {


            var respuesta = await response.Content.ReadAsStringAsync();

            return Content(respuesta);



        }

        return BadRequest();
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
