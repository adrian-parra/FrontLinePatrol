using System.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Mvc;

namespace LinePatrol.Controllers;

public class EmployeeController : Controller
{
    private string connectionString = "Server=172.30.184.136;Database=CheckerIA_DB;User Id=lanpoint;Password=syslanpoint;";

    [HttpGet]
    public IActionResult GetEmployeeInfo(int employeeId)
    {
        try 
        {
            Console.WriteLine($"Iniciando búsqueda de empleado. ID: {employeeId}");
            Console.WriteLine($"Cadena de conexión: {connectionString}");
    
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try 
                {
                    connection.Open();
                    Console.WriteLine("Conexión a la base de datos establecida exitosamente.");
                }
                catch (Exception openEx)
                {
                    Console.WriteLine($"Error al abrir la conexión: {openEx.Message}");
                    return StatusCode(500, $"Error de conexión: {openEx.Message}");
                }
                
                using (SqlCommand cmd = new SqlCommand("SP_INSERT_CheckInOut", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    
                    cmd.Parameters.Add("@EmployeeID", SqlDbType.Int).Value = employeeId;
                    
                    try 
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            Console.WriteLine("Ejecutando Stored Procedure...");
    
                            // Verificar si hay resultados
                            if (!reader.HasRows)
                            {
                                Console.WriteLine($"No se encontraron resultados para el empleado {employeeId}");
                                return NotFound($"Empleado {employeeId} no encontrado");
                            }
    
                            // Procesar resultados
                            while (reader.Read())
                            {
                                // Logging de cada campo
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    Console.WriteLine($"Campo {reader.GetName(i)}: {reader[i]}");
                                }
    
                                // Mapear datos a un modelo
                                var resultado = new 
                                {
                                    // Usa los nombres exactos de las columnas que viste en el log
                                    EmpleadoId = reader[0], // Primer campo (256553)
                                    NombreCompleto = reader["CompleteName"], // Nombre completo
                                    Fecha = reader[2].ToString(), // Fecha
                                    Cumpleaños = reader["Cumple"], // Cumple
                                    Antigüedad = reader["Antiw"] // Antiw
                                };
                                
                                return Ok(resultado);
                            }
                        }
                    }
                    catch (SqlException sqlEx)
                    {
                        Console.WriteLine($"Error de SQL: {sqlEx.Message}");
                        Console.WriteLine($"Código de error: {sqlEx.Number}");
                        return StatusCode(500, $"Error de base de datos: {sqlEx.Message}");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error general: {ex.Message}");
            Console.WriteLine($"Traza de pila: {ex.StackTrace}");
            return StatusCode(500, ex.Message);
        }
        
        Console.WriteLine("Fin del método sin resultados");
        return NotFound();
    }
}