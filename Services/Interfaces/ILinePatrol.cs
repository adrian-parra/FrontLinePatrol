using LinePatrol.Models;

namespace LinePatrol.Services.Interfaces
{
    public interface ILinePatrol
    {
        Task<List<LinePatrolListado>> Lista();
        // Task<Tarea> Obtener(int idtarea);
        Task<List<LinePatrolListado>> Filter(LinePatrolFilter objeto);

        Task<bool> Guardar(LinePatrolRegister objeto);
        Task<bool> Liberar(LinePatrolLiberar objeto);

    }
}