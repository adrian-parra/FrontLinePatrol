using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;
using System.Management;
using System;

namespace LinePatrol.Controllers;

 public class Actualizacion
    {
        public string HotFixID { get; set; }
        public string Description { get; set; }
        public string InstalledOn { get; set; }
        public string Caption { get; set; }
        public string CSName { get; set; }
        public string InstallDate { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string TiempoDesdeInstalacion { get; set; } 
    }

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

    private string CalcularTiempoDesde(DateTime fechaInstalacion)
        {
            TimeSpan tiempoTranscurrido = DateTime.Now - fechaInstalacion;

            if (tiempoTranscurrido.TotalMinutes < 1)
                return "hace menos de un minuto";
            if (tiempoTranscurrido.TotalHours < 1)
                return $"hace {tiempoTranscurrido.Minutes} minutos";
            if (tiempoTranscurrido.TotalDays < 1)
                return $"hace {tiempoTranscurrido.Hours} horas";

            return $"hace {tiempoTranscurrido.Days} días";
    }
    

    [HttpPost]
    public  async Task<IActionResult> ObtenerActualizacionesDeEquipoWmi(string ip)
    {
         List<Actualizacion> actualizaciones = new List<Actualizacion>();
        string computerName = ip;

        try
        {
            ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
            scope.Connect();
            ObjectQuery query = new ObjectQuery($"SELECT * FROM Win32_QuickFixEngineering");
            ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);
            foreach (ManagementObject update in searcher.Get())
            {
                DateTime? installedOnDate = null;
                if (DateTime.TryParse(update["InstalledOn"]?.ToString(), out DateTime parsedDate))
                {
                    installedOnDate = parsedDate;
                }

                 Actualizacion actualizacion = new Actualizacion
                {
                    HotFixID = update["HotFixID"]?.ToString() ?? "N/A",
                    Description = update["Description"]?.ToString() ?? "N/A",
                    InstalledOn = update["InstalledOn"]?.ToString() ?? "N/A",
                    Caption = update["Caption"]?.ToString() ?? "N/A",
                    CSName = update["CSName"]?.ToString() ?? "N/A",
                    InstallDate = update["InstallDate"]?.ToString() ?? "N/A",
                    Name = update["Name"]?.ToString() ?? "N/A",
                    Status = update["Status"]?.ToString() ?? "N/A",
                    TiempoDesdeInstalacion = installedOnDate.HasValue ? CalcularTiempoDesde(installedOnDate.Value) : "N/A"
                };

                actualizaciones.Add(actualizacion);
            }
        }
        catch (Exception ex)
        {
            return BadRequest($"Error al obtener actualizaciones: {ex.Message}");
        }

        return Json(actualizaciones);
    }
    [HttpPost]
    public ActionResult DesinstalarSoftwareDeEquipoWmi(string productName, string ip)
    {
        try
        {
            string computerName = ip;


            // Crea la consulta para encontrar el producto
            ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
            scope.Connect();

            ObjectQuery query = new ObjectQuery($"SELECT * FROM Win32_Product WHERE Name = '{productName.Trim()}'");
            ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

            // Recopila los productos a desinstalar
            ManagementObjectCollection products = searcher.Get();
            if (products.Count == 0)
            {
                return BadRequest("No se encontró ningún producto para desinstalar.");
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
                    return BadRequest();

                }
            }

            return Json(new { message = "Software desinstalado correctamente." });


        }
        catch (Exception ex)
        {
            return BadRequest();
        }
    }


    [HttpPost]
    public ActionResult ObtenerSoftwareDeEquipoWmi(string ip)
    {
        try
        {

            string computerName = ip;

            // Crear el alcance de la conexión WMI al equipo remoto

            ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
            scope.Connect();

            // Crear el objeto de búsqueda para obtener los productos instalados
            ObjectQuery query = new ObjectQuery("SELECT Name FROM Win32_Product");
            ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

            // Ejecutar la búsqueda y obtener los resultados
            ManagementObjectCollection queryCollection = searcher.Get();


            // Limpiar ComboBox
            // cb_listado_software.Items.Clear();

            List<string> softwareList = new List<string>();


            foreach (ManagementObject m in queryCollection)
            {
                if (m["Name"] != null)
                {

                    softwareList.Add(m["Name"].ToString());
                    //Console.WriteLine($"software: {m["Name"].ToString()}");
                }
            }




            return Json(new { softwareInstalado = softwareList });
        }
        catch (Exception ex)
        {
            return BadRequest();
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
