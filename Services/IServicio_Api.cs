using LinePatrol.Models;

namespace LinePatrol.Services
{
    public interface IServicio_API
    {
        Task<List<LinePatrolM>> Lista();
        // Task<Tarea> Obtener(int idtarea);

        Task<bool> Guardar(LinePatrolM objeto);

        // Task<bool> Editar(Tarea objeto);

        // Task<bool> Eliminar(int idtarea);
    }
}