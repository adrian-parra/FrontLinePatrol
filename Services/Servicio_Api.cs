using LinePatrol.Models;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace LinePatrol.Services;
public class Servicio_API : IServicio_API
{

    public async Task<List<LinePatrolM>> Lista()
    {
        List<LinePatrolM> lista = new List<LinePatrolM>();



        var cliente = new HttpClient();
        // cliente.BaseAddress = new Uri("https://jsonplaceholder.typicode.com/todos");
        // var response = await cliente.GetAsync("https://jsonplaceholder.typicode.com/posts");
        var response = await cliente.GetAsync("http://localhost:3000");


        if (response.IsSuccessStatusCode)
        {

            var json_respuesta = await response.Content.ReadAsStringAsync();
            var resultado = JsonConvert.DeserializeObject<List<LinePatrol.Models.LinePatrolM>>(json_respuesta);

            if (resultado != null)
            {
                return resultado;
            }
            else
            {
                // Manejar el escenario donde resultado es nulo, por ejemplo, lanzar una excepción o devolver una lista vacía
                // Aquí un ejemplo de devolución de una lista vacía
                return new List<LinePatrol.Models.LinePatrolM>();
            }
        }else{
            return new List<LinePatrol.Models.LinePatrolM>();
        }


    }

    public async Task<bool> Guardar(LinePatrolM objeto)
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


            var response = await cliente.PostAsync("http://localhost:3000/guardar", content);

            

            if (response.IsSuccessStatusCode)
            {
                respuesta = true;
            }

            return respuesta;
        }



}
