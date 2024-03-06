using LinePatrol.Models;

namespace LinePatrol.Services
{
    public interface IServicio_API
    {
        Task<List<Tarea>> Lista();
        // Task<Tarea> Obtener(int idtarea);

        Task<bool> Guardar(Tarea objeto);

        // Task<bool> Editar(Tarea objeto);

        // Task<bool> Eliminar(int idtarea);
    }
}