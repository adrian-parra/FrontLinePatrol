using LinePatrol.Models;

namespace LinePatrol.Services
{
    public interface IServicio_API
    {
        Task<List<LinePatrolListado>> Lista();
        // Task<Tarea> Obtener(int idtarea);
        Task<List<LinePatrolListado>> Filter();

        Task<bool> Guardar(LinePatrolRegister objeto);
        Task<bool> Liberar(LinePatrolLiberar objeto);

    }
}