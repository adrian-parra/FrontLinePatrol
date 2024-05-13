namespace LinePatrol.Models;
public class LinePatrolListado {
   public string? id { get; set; }
    public string id_planta { get; set; }
    public string id_linea { get; set; }
    public string id_estacion { get; set; }
    public string? path_imagen { get; set; }
    public string? comentario { get; set; }
    public string? persona_libera { get; set; }
    public string? path_imagen_after { get; set; }
    public bool? estado {get; set;}
    public string? created_at {get; set;}
    public string? updated_at {get; set;}
}