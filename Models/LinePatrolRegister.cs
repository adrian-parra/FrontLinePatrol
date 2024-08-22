namespace LinePatrol.Models;

public class LinePatrolRegister {
    public string id_planta { get; set; }
    public string id_linea { get; set; }
    public string id_estacion { get; set; }
    public IFormFile imagen {get;set;}
    public string? path_imagen { get; set; }
    public string? comentario { get; set; }

    public string? responsable { get; set; }
}