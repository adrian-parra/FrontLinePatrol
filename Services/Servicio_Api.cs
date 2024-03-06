using LinePatrol.Models;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace LinePatrol.Services;
public class Servicio_API : IServicio_API
{

    public async Task<List<Tarea>> Lista()
    {
        List<Tarea> lista = new List<Tarea>();



        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri("https://jsonplaceholder.typicode.com/todos");
        var response = await cliente.GetAsync("https://jsonplaceholder.typicode.com/posts");

        if (response.IsSuccessStatusCode)
        {

            var json_respuesta = await response.Content.ReadAsStringAsync();
            var resultado = JsonConvert.DeserializeObject<List<LinePatrol.Models.Tarea>>(json_respuesta);

            if (resultado != null)
            {
                return resultado;
            }
            else
            {
                // Manejar el escenario donde resultado es nulo, por ejemplo, lanzar una excepción o devolver una lista vacía
                // Aquí un ejemplo de devolución de una lista vacía
                return new List<LinePatrol.Models.Tarea>();
            }
        }else{
            return new List<LinePatrol.Models.Tarea>();
        }


    }

    public async Task<bool> Guardar(Tarea objeto)
        {
            bool respuesta = false;

          


            var cliente = new HttpClient();
            // cliente.BaseAddress = new Uri(_baseUrl);

            var content = new StringContent(JsonConvert.SerializeObject(objeto), Encoding.UTF8, "application/json");

            var response = await cliente.PostAsync("https://jsonplaceholder.typicode.com/posts", content);

            if (response.IsSuccessStatusCode)
            {
                respuesta = true;
            }

            return respuesta;
        }



}
