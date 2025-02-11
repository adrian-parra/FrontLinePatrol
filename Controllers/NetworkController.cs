using System.Net;
using System.Net.Sockets;
using Microsoft.AspNetCore.Mvc;

namespace LinePatrol.Controllers;

public class NetworkController : Controller
{

    public NetworkController()
    {
        
    }
    [HttpGet]
    public async Task<IActionResult> ResolveHostname(string ip)
    {
        try
        {
            // Validar IP
            if (!IPAddress.TryParse(ip, out IPAddress address))
            {
                return BadRequest(new { 
                    message = "IP inválida", 
                    success = false 
                });
            }

            // Intentar resolver hostname
            string hostname;
            try 
            {
                hostname = Dns.GetHostEntry(address).HostName;
            }
            catch 
            {
                // Si falla la resolución DNS, intentar otra estrategia
                hostname = address.ToString();
            }

            return Ok(new { 
                hostname = hostname, 
                success = true 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                message = "Error interno al resolver hostname", 
                success = false 
            });
        }
    }

    // Método adicional para obtener información de red
    [HttpGet]
    public async Task<IActionResult> GetNetworkInfo(string ip)
    {
        try
        {
            if (!IPAddress.TryParse(ip, out IPAddress address))
            {
                return BadRequest(new { 
                    message = "IP inválida", 
                    success = false 
                });
            }

            // Obtener información de red
            var hostEntry = Dns.GetHostEntry(address);

            return Ok(new 
            { 
                hostname = hostEntry.HostName,
                aliases = hostEntry.Aliases,
                addressList = hostEntry.AddressList.Select(a => a.ToString()),
                success = true
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                message = "Error interno obteniendo información de red", 
                success = false 
            });
        }
    }
}