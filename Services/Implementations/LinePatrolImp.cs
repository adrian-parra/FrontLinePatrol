using LinePatrol.Models;
using LinePatrol.Services.Interfaces;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;



namespace LinePatrol.Services.Implementations;
public class LinePatrolImp : ILinePatrol
{

    public async Task<List<LinePatrolListado>> Filter(LinePatrolFilter linePatrolFilter)
    {
        List<LinePatrolListado> lista = new List<LinePatrolListado>();



        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri("https://jsonplaceholder.typicode.com/todos");
        // var response = await cliente.GetAsync("https://jsonplaceholder.typicode.com/posts");
        string url = $"http://localhost:3000/api/linePatrol?" +
                     $"id_planta={linePatrolFilter.id_planta}&" +
                     $"id_linea={linePatrolFilter.id_linea}&" +
                     $"id_estacion={linePatrolFilter.id_estacion}&" +
                     $"estado={linePatrolFilter.estado}&" +
                     $"fecha_inicio={linePatrolFilter.fecha_inicio}&" +
                     $"fecha_fin={linePatrolFilter.fecha_fin}";
        var response = await cliente.GetAsync(url);


        if (response.IsSuccessStatusCode)
        {

            var json_respuesta = await response.Content.ReadAsStringAsync();
            var resultado = JsonConvert.DeserializeObject<List<LinePatrol.Models.LinePatrolListado>>(json_respuesta);

            if (resultado != null)
            {
                return resultado;
            }
            else
            {
                // Manejar el escenario donde resultado es nulo, por ejemplo, lanzar una excepción o devolver una lista vacía
                // Aquí un ejemplo de devolución de una lista vacía
                return new List<LinePatrol.Models.LinePatrolListado>();
            }
        }
        else
        {
            return new List<LinePatrol.Models.LinePatrolListado>();
        }
    }

    public async Task<List<LinePatrolListado>> Lista()
    {
        List<LinePatrolListado> lista = new List<LinePatrolListado>();



        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri("https://jsonplaceholder.typicode.com/todos");
        // var response = await cliente.GetAsync("https://jsonplaceholder.typicode.com/posts");
        var response = await cliente.GetAsync("http://localhost:3000/api/linePatrol");


        if (response.IsSuccessStatusCode)
        {

            var json_respuesta = await response.Content.ReadAsStringAsync();
            var resultado = JsonConvert.DeserializeObject<List<LinePatrol.Models.LinePatrolListado>>(json_respuesta);

            if (resultado != null)
            {
                return resultado;
            }
            else
            {
                // Manejar el escenario donde resultado es nulo, por ejemplo, lanzar una excepción o devolver una lista vacía
                // Aquí un ejemplo de devolución de una lista vacía
                return new List<LinePatrol.Models.LinePatrolListado>();
            }
        }
        else
        {
            return new List<LinePatrol.Models.LinePatrolListado>();
        }


    }

    // public async Task<bool> Liberar(IFormFile imagenAfter ,string personaLibera , string contra){
    //     Console.WriteLine("valor " + personaLibera);
    //     Console.WriteLine("valor " + contra);

    // }

    public async Task<bool> Liberar(LinePatrolLiberar objeto)
    {
        bool respuesta = false;
        objeto.imagen_after = null;

        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(objeto);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PatchAsync("http://localhost:3000/api/linePatrol/" + objeto.id, content);



        if (response.IsSuccessStatusCode)
        {
            respuesta = true;
        }

        return respuesta;
    }

    public async Task<bool> Guardar(LinePatrolRegister objeto)
    {
        bool respuesta = false;
        objeto.imagen = null;


        Console.WriteLine("service data : " + objeto.comentario);


        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri(_baseUrl);

        string json = JsonConvert.SerializeObject(objeto);

        // Define el contenido de la solicitud HTTP
        var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");


        // var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

        Console.WriteLine("El valor de respuesta es: " + content);


        var response = await cliente.PostAsync("http://localhost:3000/api/linePatrol", content);



        if (response.IsSuccessStatusCode)
        {
            respuesta = true;
        }

        return respuesta;
    }



}
