namespace LinePatrol.Models;

public class LinePatrolFilter{
    public string? id_planta { get; set; }
    public string? id_linea { get; set; }
    public string? id_estacion { get; set; }
    public bool? estado {get; set;}

    public string? fecha_inicio { get;set;}
    public string? fecha_fin { get; set; }
}