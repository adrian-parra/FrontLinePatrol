using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using LinePatrol.Models;
using Newtonsoft.Json;
using System.Management;
using System;
using System.IO;

using System.Collections.Generic;
using System.Globalization;

namespace LinePatrol.Controllers;


public class SistemaOperativo {
    public string Caption { get; set; }
    public string Version { get; set; }
//     public string BuildNumber { get; set; }
//     public string RegisteredUser { get; set; }
//     public string SerialNumber { get; set; }
//     public string SystemType { get; set; }
//     public string InstallDate { get; set; }
//     public string LastBootUpTime { get; set; }
//     public string OperatingSystemSKU { get; set; }
//     public string ProductType { get; set; }
//     public string Status { get; set; }
//     public string Manufacturer { get; set; }
//     public string Model { get; set; }
//     public string SystemFamily { get; set; }
//     public string SystemDirectory { get; set; }
//     public string SystemDrive { get; set; }
//     public string TotalPhysicalMemory { get; set; }
//     public string Processor { get; set; }
//     public string ProcessorSpeed { get; set; }
//     public string ProcessorArchitecture { get; set; }
//     public string ProcessorManufacturer { get; set; }
//     public string ProcessorId { get; set; }
//     public string ProcessorCoreCount { get; set; }
//     public string ProcessorThreadCount { get; set; }
//     public string ProcessorL2CacheSize { get; set; }
//     public string ProcessorL3CacheSize { get; set; }
//     public string ProcessorMaxClockSpeed { get; set; }
//     public string ProcessorNumberOfCores { get; set; }
//     public string ProcessorNumberOfLogicalProcessors { get; set; }
//     public string ProcessorStatus { get; set; }
//     public string ProcessorUpgrade { get; set; }
//     public string ProcessorFamily { get; set; }
//     public string ProcessorLevel { get; set; }
//     public string ProcessorStepping { get; set; }
//     public string ProcessorRevision { get; set; }
//     public string ProcessorFeatureList { get; set; }
//     public string ProcessorVirtualization { get; set; }
//     public string ProcessorVirtualizationFirmwareEnabled { get; set; }
//     public string ProcessorVirtualizationSupported { get; set; }
//     public string ProcessorVirtualizationCapabilities { get; set; }
//     public string ProcessorVirtualizationFeatures { get; set; }
//     public
 }

 public class UserProfileDto
{
    public string LocalPath { get; set; }
    public string SID { get; set; }
    public string LastUserTime { get; set; }
    public string LastUserTimeFormated { get; set; }

    // public bool IsRoaming { get; set; }
    // public bool Special { get; set; }
}

public class ProcessInit{
    public string Name { get; set; }
}

public class PhysicalMemory{
    public string Manufacturer { get; set; }
    public string Capacity { get; set; }
    public string Speed { get; set; }
    public string MemoryType { get; set; }
    public string PartNumber { get; set; }
}

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

public class ServiceInfo
{
    public string Name { get; set; }
    public string DisplayName { get; set; }
    public string Status { get; set; }
}


public class DiskSpaceInfo
{
    public string DeviceID { get; set; }
    public string FreeSpace { get; set; }
    public string Size { get; set; }

    public string DriveType { get; set; }

     public double UsedPercentage { get; set; }
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

    //  [HttpPost]
    // public async Task<IActionResult> execCommandWmi(string ip,string programPath){
        

    //     try
    //     {
    //         string computerName = ip;

    //         // Crear la conexión a la máquina remota
    //         ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
    //         scope.Connect();

    //         // Crear el objeto para ejecutar el proceso
    //         var processClass = new ManagementClass(scope, new ManagementPath("Win32_Process"), null);
    //         var parameters = new object[] { programPath, null, null, 0, null, null, null, null };

    //         // Ejecutar el proceso
    //         var result = processClass.InvokeMethod("Create", parameters, null);

    //         // Verificar el resultado
    //         uint returnValue = (uint)result["returnValue"];
    //         if (returnValue == 0)
    //         {
    //             return Json(new { success = true, message = "Programa abierto con éxito." });
    //         }
    //         else
    //         {
    //             return Json(new { success = false, message = $"Error al abrir el programa. Código de error: {returnValue}" });
    //         }
    //     }
    //     catch (Exception ex)
    //     {
    //         return Json(new { success = false, message = $"Ocurrió un error: {ex.Message}" });
    //     }
    // }

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

    private string GetDriveType(uint driveType)
{
    switch (driveType)
    {
        case 0: return "Unknown";
        case 1: return "No Root Dir";
        case 2: return "Removable Disk";
        case 3: return "Local Disk";
        case 4: return "Network Drive";
        case 5: return "Compact Disc";
        case 6: return "RAM Disk";
        default: return "Unknown";
    }
}
    private string FormatBytes(ulong bytes)
    {
        string[] sizes = { "B", "KB", "MB", "GB", "TB" };
        double len = bytes;
        int order = 0;

        while (len >= 1024 && order < sizes.Length - 1)
        {
            order++;
            len /= 1024;
        }

        return $"{len:0.##} {sizes[order]}";
    }


[HttpPost]
public async Task<IActionResult> DeleteTemp(string ip, string user)
{
    try
    {
        var computerName = ip;
        // Ruta de la carpeta temporal en la máquina remota
        string tempFolderPath = $@"\\{computerName}\c$\Users\{user}\AppData\Local\Temp";

        // Verificar si la carpeta existe
        if (Directory.Exists(tempFolderPath))
        {
            // Calcular el tamaño total de la carpeta
            long totalSize = GetDirectorySize(tempFolderPath);
            // Convertir el tamaño total a un formato legible
            string formattedSize = FormatSize(totalSize);

            // Aquí puedes retornar el tamaño total al usuario
            // Por ejemplo, en bytes o convertir a MB
            double totalSizeInMB = totalSize / (1024.0 * 1024.0);

            // Obtener todos los archivos en la carpeta temporal
            var files = Directory.GetFiles(tempFolderPath);

            // Borrar cada archivo
            foreach (var file in files)
            {
                try
                {
                    System.IO.File.Delete(file);
                }
                catch (IOException)
                {
                    // Log or handle the exception if needed, but continue with the next file
                }
                catch (UnauthorizedAccessException)
                {
                    // Log or handle the exception if needed, but continue with the next file
                }
            }

            // También puedes eliminar subdirectorios si es necesario
            var directories = Directory.GetDirectories(tempFolderPath);
            foreach (var directory in directories)
            {
                try
                {
                    Directory.Delete(directory, true); // Eliminar directorios recursivamente
                }
                catch (IOException)
                {
                    // Log or handle the exception if needed, but continue with the next directory
                }
                catch (UnauthorizedAccessException)
                {
                    // Log or handle the exception if needed, but continue with the next directory
                }
            }

            return Json(new { message = "Archivos temporales eliminados con éxito.", totalSizeMB = formattedSize  });
        }
        else
        {
            return BadRequest(new { error = "La carpeta temporal no existe." }); // La carpeta no existe
        }
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message }); // Manejo de errores
    }
}

// Método para calcular el tamaño total de la carpeta
private long GetDirectorySize(string path)
{
    long size = 0;

    // Sumar tamaños de archivos
    var files = Directory.GetFiles(path, "*.*", SearchOption.AllDirectories);
    foreach (var file in files)
    {
        FileInfo fileInfo = new FileInfo(file);
        size += fileInfo.Length;
    }

    return size;
}

// Método para formatear el tamaño en un formato legible
private string FormatSize(long bytes)
{
    string[] sizes = { "Bytes", "KB", "MB", "GB", "TB" };
    double len = bytes;
    int order = 0;

    while (len >= 1024 && order < sizes.Length - 1)
    {
        order++;
        len /= 1024;
    }

    return $"{Math.Round(len, 2)} {sizes[order]}";
}
 [HttpPost]
public async Task<IActionResult> GetServiceInfo(string ip)
{
    try
    {
        string computerName = ip;
       // List<DiskSpaceInfo> diskSpaceList = new List<DiskSpaceInfo>();

         List<ServiceInfo> servicesList = new List<ServiceInfo>();

        // Crea la consulta para encontrar el producto
        ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
        scope.Connect();

        ObjectQuery query = new ObjectQuery($"SELECT * FROM Win32_Service");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);
        
        // Ejecutar la consulta y recorrer los resultados
        foreach (ManagementObject service in searcher.Get())
        {

            ServiceInfo servicesInfo = new ServiceInfo
            {
                Name = service["Name"].ToString(),
                DisplayName = service["DisplayName"].ToString(),
                Status = service["State"].ToString()

            };


           
             
            servicesList.Add(servicesInfo);
        }

          var orderedServices = servicesList.OrderByDescending(s => s.Status == "Running").ToList();


        return Json(orderedServices);
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}


 private string FormatLastUseTime(string lastUseTime)
    {
        if (string.IsNullOrEmpty(lastUseTime))
        {
            return "Nunca usado"; // O algún valor que indique que nunca se usó
        }

        try
        {

            string dateTimeString = lastUseTime;
            string year = dateTimeString.Substring(0, 4); // "2024"
            string month = dateTimeString.Substring(4, 2); // "10"
            string day = dateTimeString.Substring(6, 2); // "26"
            string hour = dateTimeString.Substring(8, 2); // "07"
            string minute = dateTimeString.Substring(10, 2); // "49"
            string second = dateTimeString.Substring(12, 2); // "48"
            string milliseconds = dateTimeString.Substring(15, 6); // "663000"
        
            // Formatear la fecha
            string formattedDate = $"{day} de {GetMonthName(month)} de {year}, {hour}:{minute}:{second}.{milliseconds} UTC";
            
            return formattedDate;
        }
        catch (Exception ex)
        {
            // Loguear cualquier otro error
            Console.WriteLine($"Error inesperado: {ex.Message}");
            return "Error al formatear la fecha"; // Manejo de errores generales
        }
    }

    private static string GetMonthName(string month)
    {
        switch (month)
        {
            case "01": return "enero";
            case "02": return "febrero";
            case "03": return "marzo";
            case "04": return "abril";
            case "05": return "mayo";
            case "06": return "junio";
            case "07": return "julio";
            case "08": return "agosto";
            case "09": return "septiembre";
            case "10": return "octubre";
            case "11": return "noviembre";
            case "12": return "diciembre";
            default: return "mes desconocido";
        }
    }

    private string FormatTimeStamp(string dateTimeString){

        if (string.IsNullOrEmpty(dateTimeString))
        {
            return "Nunca usado"; // O algún valor que indique que nunca se usó
        }
        
        // Extraer partes de la cadena
        string year = dateTimeString.Substring(0, 4); // "2024"
        string month = dateTimeString.Substring(4, 2); // "10"
        string day = dateTimeString.Substring(6, 2); // "26"
        string hour = dateTimeString.Substring(8, 2); // "07"
        string minute = dateTimeString.Substring(10, 2); // "49"
        string second = dateTimeString.Substring(12, 2); // "48"
        
        // Crear un objeto DateTime a partir de las partes extraídas
        DateTime userDateTime = new DateTime(int.Parse(year), int.Parse(month), int.Parse(day), 
                                              int.Parse(hour), int.Parse(minute), int.Parse(second));

        // Calcular la diferencia con la fecha actual
        TimeSpan timeDifference = DateTime.UtcNow - userDateTime;

        // Obtener el mensaje de tiempo transcurrido
        string timeAgoMessage = GetTimeAgoMessage(timeDifference);
        return timeAgoMessage;
    }

    private string GetTimeAgoMessage(TimeSpan timeDifference)
    {
        if (timeDifference.Days > 0)
        {
            return $"Hace {timeDifference.Days} día{(timeDifference.Days > 1 ? "s" : "")}";
        }
        else if (timeDifference.Hours > 0)
        {
            return $"Hace {timeDifference.Hours} hora{(timeDifference.Hours > 1 ? "s" : "")}";
        }
        else if (timeDifference.Minutes > 0)
        {
            return $"Hace {timeDifference.Minutes} minuto{(timeDifference.Minutes > 1 ? "s" : "")}";
        }
        else
        {
            return "Hace unos momentos";
        }
    }

[HttpPost]
public async Task<IActionResult> GetUsersInfo(string ip){
   
 try
            {
                var computerName = ip;
                // Conectar al espacio de nombres WMI
                ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
                scope.Connect(); // Intenta conectarse

                // Realizar la consulta WMI
                ObjectQuery query = new ObjectQuery("SELECT * FROM Win32_UserProfile WHERE Special = false");
                ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

                //var userList = new List<string>();

                var userProfileList = new List<UserProfileDto>();
                string formattedDateTime;
                foreach (ManagementObject user in searcher.Get())
                {
                    // Verificar si 'LocalPath' no es null antes de agregar
                    if (user["LocalPath"] != null)
                    {

                     

 
                        // Crear un DTO para cada perfil de usuario
                    var userProfile = new UserProfileDto
                    {
                        LocalPath = user["LocalPath"]?.ToString(),
                        SID = user["SID"]?.ToString(),
                        LastUserTime = FormatLastUseTime(user["LastUseTime"]?.ToString()),
                        LastUserTimeFormated = FormatTimeStamp(user["LastUseTime"]?.ToString())

                        // LastUseTime = ManagementDateTimeConverter.ToDateTime(user["LastUseTime"]?.ToString() ?? "0"),
                    

                        // IsRoaming = (bool)(user["Roaming"] ?? false),
                        // Special = (bool)(user["Special"] ?? false)
                    };

                    userProfileList.Add(userProfile);
                    }
                }

                // Devolver la lista de usuarios
                return Json(userProfileList);
            }
            catch (ManagementException mEx)
            {
                return StatusCode(500, $"Error de gestión WMI: {mEx.Message}");
            }
            catch (UnauthorizedAccessException uaEx)
            {
                return StatusCode(403, $"Acceso denegado: {uaEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener usuarios: {ex.Message}");
            }

                
                 
}

 [HttpPost]
public async Task<IActionResult> GetProccessInfo(string ip)
{
   try
{
    string computerName = ip;
    //var applications = new List<string>();

     List<ProcessInit> applications = new List<ProcessInit>();

    // Lista de procesos comúnmente en segundo plano
    var backgroundProcesses = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "csrss.exe",
        "winlogon.exe",
        "svchost.exe",
        "taskhostw.exe",
        "services.exe",
        "explorer.exe", // Puede ser GUI, pero es esencial del sistema
        "lsass.exe",
        "sihost.exe",
        "fontdrvhost.exe",
        "dwm.exe",
        "conhost.exe",
        "unsecapp.exe",
        "dllhost.exe",
        "RuntimeBroker.exe",
        "dotnet.exe",
        "cloudcode_cli.exe",
        "StartMenuExperienceHost.exe",
        "SecurityHealthSystray.exe"

        // Agrega más procesos conocidos aquí
    };

    // Crea la consulta para encontrar el producto
    ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
    scope.Connect();

    ObjectQuery query = new ObjectQuery("SELECT * FROM Win32_Process");
    ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);
    
    // Ejecutar la consulta y recorrer los resultados
    foreach (ManagementObject process in searcher.Get())
    {
        var processName = process["Name"].ToString();
        
        // Filtrar procesos con interfaz gráfica (SessionId != 0) y que no están en la lista de exclusión
        if (process["SessionId"] != null && Convert.ToInt32(process["SessionId"]) != 0 &&
            !string.IsNullOrEmpty(processName) && 
            !processName.StartsWith("@") && 
            !backgroundProcesses.Contains(processName))
        {

             ProcessInit processInit = new ProcessInit
            {
                Name = process["Name"].ToString(),
            };
            applications.Add(processInit);
        }
    }

    applications = applications
    .GroupBy(app => app.Name) // Cambia 'ProcessName' por la propiedad que deseas usar
    .Select(group => group.First()) // Selecciona el primer elemento de cada grupo
    .ToList();

    return Json(applications);
}
catch (Exception ex)
{
    return BadRequest(new { error = ex.Message });
}
}

    [HttpPost]
public async Task<IActionResult> InfoSistemaOperativo(string ip)
{
    try
    {
        string computerName = ip;
        List<SistemaOperativo> sistemaOperativo = new List<SistemaOperativo>();

        // Crea la consulta para encontrar el producto
        ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
        scope.Connect();

        ObjectQuery query = new ObjectQuery($"SELECT Version, Caption FROM Win32_OperatingSystem");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);
        
        // Ejecutar la consulta y recorrer los resultados
        foreach (ManagementObject os in searcher.Get())
        {
            
            SistemaOperativo sistemas = new SistemaOperativo
            {
                Caption = os["Caption"].ToString(),
                Version = os["Version"].ToString()
            };

            sistemaOperativo.Add(sistemas);
        }

        return Json(sistemaOperativo);
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}

 [HttpPost]
public async Task<IActionResult> DiskSpace(string ip)
{
    try
    {
        string computerName = ip;
        List<DiskSpaceInfo> diskSpaceList = new List<DiskSpaceInfo>();

        // Crea la consulta para encontrar el producto
        ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
        scope.Connect();

        ObjectQuery query = new ObjectQuery($"SELECT DeviceID, FreeSpace, Size, DriveType FROM Win32_LogicalDisk");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);
        
        // Ejecutar la consulta y recorrer los resultados
        foreach (ManagementObject disk in searcher.Get())
        {
            // Usar Convert.ToUInt64 para evitar problemas de casting
            ulong freeSpace = Convert.ToUInt64(disk["FreeSpace"]);
            ulong size = Convert.ToUInt64(disk["Size"]);
            uint driveType = Convert.ToUInt32(disk["DriveType"]);

            double usedPercentage = 0;
            if (size > 0)
            {
                usedPercentage = ((double)(size - freeSpace) / size) * 100;
            }

            DiskSpaceInfo diskInfo = new DiskSpaceInfo
            {
                DeviceID = disk["DeviceID"].ToString(),
                FreeSpace = FormatBytes(freeSpace), // Formatear espacio libre
                Size = FormatBytes(size), // Formatear tamaño total
                DriveType = GetDriveType(driveType),
                UsedPercentage = Math.Round(usedPercentage, 2)
            };

            diskSpaceList.Add(diskInfo);
        }

        return Json(diskSpaceList);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
        return BadRequest(new { error = ex.Message });
    }
}

private string FormatCreationTime(string creationTimeRaw)
{
    // Parse the raw creation time string to a DateTime object
    DateTime creationTime = DateTime.ParseExact(creationTimeRaw.Substring(0, 14), "yyyyMMddHHmmss", System.Globalization.CultureInfo.InvariantCulture);

    // Format the DateTime object to the desired format "MM/dd/yyyy"
    return creationTime.ToString("MM/dd/yyyy");
}

[HttpPost]
public async Task<IActionResult> PuntoRestauracion(string ip)
{
    try
    {
        string computerName = ip;
        List<object> restorePoints = new List<object>();

        ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\default");
        scope.Connect();

        ObjectQuery query = new ObjectQuery("SELECT * FROM SystemRestore");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

        foreach (ManagementObject restorePoint in searcher.Get())
        {

             string creationTimeRaw = restorePoint["CreationTime"].ToString();
            string formattedCreationTime = FormatCreationTime(creationTimeRaw);

             DateTime? creationTime = null;
             
                if (DateTime.TryParse(formattedCreationTime, out DateTime parsedDate))
                {
                    creationTime = parsedDate;
                }

            var restorePointData = new
            {
                Description = restorePoint["Description"],
                CreationTime = formattedCreationTime,
                CreationTimeFormatted = creationTime.HasValue ? CalcularTiempoDesde(creationTime.Value) : "N/A",
                SequenceNumber = restorePoint["SequenceNumber"],
                RestorePointType = restorePoint["RestorePointType"]
            };

            restorePoints.Add(restorePointData);
        }

        return Json(restorePoints);
    }
    catch (ManagementException mex)
    {
        return BadRequest(new { error = "WMI Error: " + mex.Message });
    }
    catch (UnauthorizedAccessException uae)
    {
        return BadRequest(new { error = "Access Denied: " + uae.Message });
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}


public string ObtenerTipoDeMemoria(uint memoryType)
{
    switch (memoryType)
    {
        case 0:
            return "Desconocido";
        case 1:
            return "Otros";
        case 2:
            return "RAM";
        case 3:
            return "DRAM";
        case 4:
            return "SRAM";
        case 5:
            return "EDO DRAM";
        case 6:
            return "Pseudo Static DRAM";
        case 7:
            return "FBD DIMM";
        case 8:
            return "DDR SDRAM";
        case 9:
            return "DDR2 SDRAM";
        case 10:
            return "DDR2 SDRAM FB-DIMM";
        case 11:
            return "DDR3 SDRAM";
        case 12:
            return "DDR4 SDRAM";
        case 13:
            return "DDR5 SDRAM";
        case 14:
            return "LPDDR";
        case 15:
            return "LPDDR2";
        case 16:
            return "LPDDR3";
        case 17:
            return "LPDDR4";
        case 18:
            return "LPDDR5";
        default:
            return "Tipo de memoria desconocido";
    }
}


[HttpPost]
public async Task<IActionResult> PhysicalMemory(string ip)
{
    try
    {
        string computerName = ip;
        // List<string> physicalMemoryList = new List<string>();
         List<PhysicalMemory> physicalMemoryList = new List<PhysicalMemory>();


           ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
        scope.Connect();

        ObjectQuery query = new ObjectQuery($"SELECT * FROM Win32_PhysicalMemory");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);
        
        // Ejecutar la consulta y recorrer los resultados
        foreach (ManagementObject memory in searcher.Get())
        {
            
                ulong capacity = Convert.ToUInt64(memory["Capacity"]);

                uint memoryType = Convert.ToUInt32(memory["MemoryType"]);

            PhysicalMemory physicalMemory = new PhysicalMemory
            {
                Manufacturer = memory["Manufacturer"].ToString(),
                Capacity = FormatBytes(capacity),
                Speed = memory["Speed"].ToString() + " MHz (megahercios).",
                MemoryType = ObtenerTipoDeMemoria(memoryType),
                PartNumber = memory["PartNumber"].ToString() 
            };

            physicalMemoryList.Add(physicalMemory);
        }

        return Json(physicalMemoryList);


    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}

    [HttpPost]
    public async Task<IActionResult> ObtenerActualizacionesDeEquipoWmi(string ip)
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


public class ComputerSystem
{
    public int AdminPasswordStatus { get; set; }
    public bool AutomaticManagedPagefile { get; set; }
    public bool AutomaticResetBootOption { get; set; }
    public bool AutomaticResetCapability { get; set; }
    public object BootOptionOnLimit { get; set; }
    public object BootOptionOnWatchDog { get; set; }
    public bool BootROMSupported { get; set; }
    public int[] BootStatus { get; set; }
    public string BootupState { get; set; }
    public string Caption { get; set; }
    public int ChassisBootupState { get; set; }
    public string ChassisSKUNumber { get; set; }
    public string CreationClassName { get; set; }
    public int CurrentTimeZone { get; set; }
    public object DaylightInEffect { get; set; }
    public string Description { get; set; }
    public string DNSHostName { get; set; }
    public string Domain { get; set; }
    public int DomainRole { get; set; }
    public bool EnableDaylightSavingsTime { get; set; }
    public int FrontPanelResetStatus { get; set; }
    public bool HypervisorPresent { get; set; }
    public bool InfraredSupported { get; set; }
    public object InitialLoadInfo { get; set; }
    public object InstallDate { get; set; }
    public int KeyboardPasswordStatus { get; set; }
    public object LastLoadInfo { get; set; }
    public string Manufacturer { get; set; }
    public string Model { get; set; }
    public string Name { get; set; }
    public object NameFormat { get; set; }
    public bool NetworkServerModeEnabled { get; set; }
    public int NumberOfLogicalProcessors { get; set; }
    public int NumberOfProcessors { get; set; }
    public object OEMLogoBitmap { get; set; }
    public string[] OEMStringArray { get; set; }
    public bool PartOfDomain { get; set; }
    public int PauseAfterReset { get; set; }
    public int PCSystemType { get; set; }
    public int PCSystemTypeEx { get; set; }
    public object PowerManagementCapabilities { get; set; }
    public object PowerManagementSupported { get; set; }
    public int PowerOnPasswordStatus { get; set; }
    public int PowerState { get; set; }
    public int PowerSupplyState { get; set; }
    public object PrimaryOwnerContact { get; set; }
    public string PrimaryOwnerName { get; set; }
    public int ResetCapability { get; set; }
    public int ResetCount { get; set; }
    public int ResetLimit { get; set; }
    public string[] Roles { get; set; }
    public string Status { get; set; }
    public object SupportContactDescription { get; set; }
    public string SystemFamily { get; set; }
    public string SystemSKUNumber { get; set; }
    public object SystemStartupDelay { get; set; }
    public object SystemStartupOptions { get; set; }
    public object SystemStartupSetting { get; set; }
    public string SystemType { get; set; }
    public int ThermalState { get; set; }
    public long TotalPhysicalMemory { get; set; }
    public string UserName { get; set; }
    public int WakeUpType { get; set; }
    public object Workgroup { get; set; }
}

[HttpPost]
public async Task<IActionResult> GetStatusUpdateAutomatic(string ip){
    {
        try
        {
            string computerName = ip;
            string automaticUpdatesStatus = "";

            ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
            scope.Connect();

            //ObjectQuery query = new ObjectQuery("SELECT AutomaticUpdatesEnabled FROM Win32_OperatingSystem");
            ObjectQuery query = new ObjectQuery("SELECT Name, State, StartMode FROM Win32_Service WHERE Name='wuauserv'");

            ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

            foreach (ManagementObject service in searcher.Get())
            {
                //automaticUpdatesStatus = obj["AutomaticUpdatesEnabled"]?.ToString();

                //break; // Assuming only one OS entry
                string name = service["Name"]?.ToString();
                    string state = service["State"]?.ToString();
                    string startMode = service["StartMode"]?.ToString();

                    return Ok(new
                    {
                        ServiceName = name,
                        State = state,
                        StartMode = startMode
                    });
            }

            //return Json(new { automaticUpdatesStatus = automaticUpdatesStatus });
            // Si no se encuentra el servicio
            return NotFound("El servicio 'wuauserv' no se encontró en el equipo remoto.");
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

}

[HttpPost]
public async Task<IActionResult> GetBiosSerialNumber(string ip)
    {
        try
        {
            string computerName = ip;
            string serialNumber = "";

            ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
            scope.Connect();

            ObjectQuery query = new ObjectQuery("SELECT SerialNumber FROM Win32_BIOS");
            ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

            foreach (ManagementObject obj in searcher.Get())
            {
                serialNumber = obj["SerialNumber"]?.ToString();
                break; // Assuming only one BIOS entry
            }

            return Json(new { serialNumber = serialNumber });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> GetStatusCpuAndMemory(string ip)
    {
        try
        {
            string computerName = ip;
            string cpuName = "";
            string cpuSpeed = "";
            string cpuCores = "";
            string cpuThreads = "";
            string cpuManufacturer = "";
            string memoryCapacity = "";
            string memorySpeed = "";

            ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
            scope.Connect();

            ObjectQuery query = new ObjectQuery("SELECT Name, MaxClockSpeed, NumberOfCores, NumberOfLogicalProcessors, Manufacturer FROM Win32_Processor");
            ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);

            foreach (ManagementObject obj in searcher.Get())
            {
                cpuName = obj["Name"]?.ToString();
                cpuSpeed = obj["MaxClockSpeed"]?.ToString();
                cpuCores = obj["NumberOfCores"]?.ToString();
                cpuThreads = obj["NumberOfLogicalProcessors"]?.ToString();
                cpuManufacturer = obj["Manufacturer"]?.ToString();
                break; // Assuming only one CPU entry
            }

            ObjectQuery memoryQuery = new ObjectQuery("SELECT Capacity, Speed FROM Win32_PhysicalMemory");
            ManagementObjectSearcher memorySearcher = new ManagementObjectSearcher(scope, memoryQuery);

            foreach (ManagementObject memoryObj in memorySearcher.Get())
            {
                memoryCapacity = memoryObj["Capacity"]?.ToString();
                memorySpeed = memoryObj["Speed"]?.ToString();
                break; // Assuming only one memory entry
            }

            // CPU Usage
            double cpuUsage = 0;
            var searcherCpuUsage = new ManagementObjectSearcher(scope,
                new ObjectQuery("SELECT PercentProcessorTime FROM Win32_PerfFormattedData_PerfOS_Processor WHERE Name='_Total'"));
            foreach (ManagementObject obj in searcherCpuUsage.Get())
            {
                cpuUsage = Convert.ToDouble(obj["PercentProcessorTime"]?.ToString() ?? "0");
                break;
            }

            // Memory Usage
            double memoryUsage = 0;
            double availableMemoryGB = 0;
            double totalMemoryGB = 0;
            var searcher2 = new ManagementObjectSearcher(scope,
                new ObjectQuery("SELECT FreePhysicalMemory, TotalVisibleMemorySize FROM Win32_OperatingSystem"));
            foreach (ManagementObject obj in searcher2.Get())
            {
                double freeMemoryKB = Convert.ToDouble(obj["FreePhysicalMemory"]?.ToString() ?? "0");
                double totalMemoryKB = Convert.ToDouble(obj["TotalVisibleMemorySize"]?.ToString() ?? "0");
                double usedMemoryKB = totalMemoryKB - freeMemoryKB;
                memoryUsage = Math.Round((usedMemoryKB / totalMemoryKB) * 100, 2);
                availableMemoryGB = Math.Round(freeMemoryKB / (1024 * 1024), 2);
                totalMemoryGB = Math.Round(totalMemoryKB / (1024 * 1024), 2);
                break;
            }

            return Json(new
            {
                cpuName = cpuName,
                cpuSpeed = cpuSpeed,
                cpuCores = cpuCores,
                cpuThreads = cpuThreads,
                cpuManufacturer = cpuManufacturer,
                memoryCapacity = memoryCapacity,
                memorySpeed = memorySpeed,
                cpuUsagePercentage = $"{Math.Round(cpuUsage, 2):F2}%",
                cpuUsage = cpuUsage,
                memoryUsagePercentage = $"{memoryUsage:F2}%",
                memoryUsage = memoryUsage,
                availableMemoryGB = $"{availableMemoryGB:F2} GB",
                totalMemoryGB = $"{Math.Round(Convert.ToDouble(memoryCapacity) / (1024 * 1024 * 1024), 2):F2} GB"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> ObtenerInfoDeviceWmi(string ip)
    {


         //var computerSystemDetails = new Dictionary<string, object>();

        try
        {

            string computerName = ip;
        List<ComputerSystem> ComputerSystemList = new List<ComputerSystem>();
         //List<PhysicalMemory> physicalMemoryList = new List<PhysicalMemory>();


        ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2");
        scope.Connect();

        ObjectQuery query = new ObjectQuery($"SELECT * FROM Win32_ComputerSystem");
        ManagementObjectSearcher searcher = new ManagementObjectSearcher(scope, query);
            // Crear un objeto ManagementObjectSearcher para consultar la clase Win32_ComputerSystem

            foreach (ManagementObject computerSystem in searcher.Get())
            {

                ComputerSystem ComputerSystem = new ComputerSystem
{
    AdminPasswordStatus = Convert.ToInt32(computerSystem["AdminPasswordStatus"]),
    AutomaticManagedPagefile = Convert.ToBoolean(computerSystem["AutomaticManagedPagefile"]),
    AutomaticResetBootOption = Convert.ToBoolean(computerSystem["AutomaticResetBootOption"]),
    AutomaticResetCapability = Convert.ToBoolean(computerSystem["AutomaticResetCapability"]),
    BootOptionOnLimit = computerSystem["BootOptionOnLimit"],
    BootOptionOnWatchDog = computerSystem["BootOptionOnWatchDog"],
    BootROMSupported = Convert.ToBoolean(computerSystem["BootROMSupported"]),
    BootStatus = Array.ConvertAll((UInt16[])computerSystem["BootStatus"], item => (int)item),
    BootupState = Convert.ToString(computerSystem["BootupState"]),
    Caption = Convert.ToString(computerSystem["Caption"]),
    ChassisBootupState = Convert.ToInt32(computerSystem["ChassisBootupState"]),
    ChassisSKUNumber = Convert.ToString(computerSystem["ChassisSKUNumber"]),
    CreationClassName = Convert.ToString(computerSystem["CreationClassName"]),
    CurrentTimeZone = Convert.ToInt32(computerSystem["CurrentTimeZone"]),
    DaylightInEffect = computerSystem["DaylightInEffect"],
    Description = Convert.ToString(computerSystem["Description"]),
    DNSHostName = Convert.ToString(computerSystem["DNSHostName"]),
    Domain = Convert.ToString(computerSystem["Domain"]),
    DomainRole = Convert.ToInt32(computerSystem["DomainRole"]),
    EnableDaylightSavingsTime = Convert.ToBoolean(computerSystem["EnableDaylightSavingsTime"]),
    FrontPanelResetStatus = Convert.ToInt32(computerSystem["FrontPanelResetStatus"]),
    HypervisorPresent = Convert.ToBoolean(computerSystem["HypervisorPresent"]),
    InfraredSupported = Convert.ToBoolean(computerSystem["InfraredSupported"]),
    InitialLoadInfo = computerSystem["InitialLoadInfo"],
    InstallDate = computerSystem["InstallDate"],
    KeyboardPasswordStatus = Convert.ToInt32(computerSystem["KeyboardPasswordStatus"]),
    LastLoadInfo = computerSystem["LastLoadInfo"],
    Manufacturer = Convert.ToString(computerSystem["Manufacturer"]),
    Model = Convert.ToString(computerSystem["Model"]),
    Name = Convert.ToString(computerSystem["Name"]),
    NameFormat = computerSystem["NameFormat"],
    NetworkServerModeEnabled = Convert.ToBoolean(computerSystem["NetworkServerModeEnabled"]),
    NumberOfLogicalProcessors = Convert.ToInt32(computerSystem["NumberOfLogicalProcessors"]),
    NumberOfProcessors = Convert.ToInt32(computerSystem["NumberOfProcessors"]),
    OEMLogoBitmap = computerSystem["OEMLogoBitmap"],
    OEMStringArray = (string[])computerSystem["OEMStringArray"],
    PartOfDomain = Convert.ToBoolean(computerSystem["PartOfDomain"]),
    PauseAfterReset = Convert.ToInt32(computerSystem["PauseAfterReset"]),
    PCSystemType = Convert.ToInt32(computerSystem["PCSystemType"]),
    PCSystemTypeEx = Convert.ToInt32(computerSystem["PCSystemTypeEx"]),
    PowerManagementCapabilities = computerSystem["PowerManagementCapabilities"],
    PowerManagementSupported = computerSystem["PowerManagementSupported"],
    PowerOnPasswordStatus = Convert.ToInt32(computerSystem["PowerOnPasswordStatus"]),
    PowerState = Convert.ToInt32(computerSystem["PowerState"]),
    PowerSupplyState = Convert.ToInt32(computerSystem["PowerSupplyState"]),
    PrimaryOwnerContact = computerSystem["PrimaryOwnerContact"],
    PrimaryOwnerName = Convert.ToString(computerSystem["PrimaryOwnerName"]),
    ResetCapability = Convert.ToInt32(computerSystem["ResetCapability"]),
    ResetCount = Convert.ToInt32(computerSystem["ResetCount"]),
    ResetLimit = Convert.ToInt32(computerSystem["ResetLimit"]),
    Roles = (string[])computerSystem["Roles"],
    Status = Convert.ToString(computerSystem["Status"]),
    SupportContactDescription = computerSystem["SupportContactDescription"],
    SystemFamily = Convert.ToString(computerSystem["SystemFamily"]),
    SystemSKUNumber = Convert.ToString(computerSystem["SystemSKUNumber"]),
    SystemStartupDelay = computerSystem["SystemStartupDelay"],
    SystemStartupOptions = computerSystem["SystemStartupOptions"],
    SystemStartupSetting = computerSystem["SystemStartupSetting"],
    SystemType = Convert.ToString(computerSystem["SystemType"]),
    ThermalState = Convert.ToInt32(computerSystem["ThermalState"]),
    TotalPhysicalMemory = Convert.ToInt64(computerSystem["TotalPhysicalMemory"]),
    UserName = Convert.ToString(computerSystem["UserName"]),
    WakeUpType = Convert.ToInt32(computerSystem["WakeUpType"]),
    Workgroup = computerSystem["Workgroup"]
};

   

  ComputerSystemList.Add(ComputerSystem);
            }

        return Json(ComputerSystemList);
                 
        }
        catch (Exception ex)
        {
            return Json(new { error = ex.Message });
        }

         

      
        // Imprimir la IP recibida en la consola
        // Console.WriteLine($"IP recibida: {ip}");
        // var hostname = new
        // {
        //     ip = ip // Asignar la IP recibida como parámetro
        // };
        // var cliente = new HttpClient();
        // // cliente.BaseAddress = new Uri(_baseUrl);

        // string json = JsonConvert.SerializeObject(hostname);

        // // Define el contenido de la solicitud HTTP
        // var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        // Console.WriteLine("El valor de respuesta es: " + content);


        // var response = await cliente.PostAsync("http://localhost:3000/api/cmd/wmi/info/", content);



        // if (response.IsSuccessStatusCode)
        // {


        //     var respuesta = await response.Content.ReadAsStringAsync();

        //     return Content(respuesta);



        // }

        // return BadRequest();
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
