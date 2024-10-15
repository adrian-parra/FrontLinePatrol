namespace LinePatrol.Models;
public class ReporteGeneradorIndex
{
    public string idPlanta { get; set; }
    public string responsable { get; set; }
    public IFormFile imagen_horas_trabajadas { get; set; }
    public IFormFile imagen_status_bateria { get; set; }
    public IFormFile imagen_nivel_anticongelante { get; set; }
    public IFormFile imagen_nivel_diesel { get; set; }
    public IFormFile imagen_nivel_aceite { get; set; }
    public string comentario { get; set; }
}