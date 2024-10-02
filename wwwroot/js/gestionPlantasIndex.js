
import { $ } from "/js/utils.js";
import { showLoading,hideLoading } from "/js/utils.js";



export const obtenerEquiposComputo = async () =>{

    showLoading()

    const response = await fetch("/GestionPlantas/ObtenerEquiposComputo")

    const data = await response.json()

    console.log(data)

    $(".container-items").innerHTML = `
    <table id="equiposTable" class="table">
    <thead class="table-header">
      <tr>
        <th style="display:none;">ID</th>
        <th>Planta</th>
        <th>Línea</th>
        <th>Estación/Ubicación</th>
         <th>Hostname</th>
        <th>Software</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody class="items-table">
    </tbody>
  </table>
    `;

    data.forEach(equipo => {
        const softwareNames = equipo.equiposComputoSoftware.map(s => s.software.nombre).join(', ');
        const lineaData = equipo.lineas[0];

        $(".items-table").innerHTML += `
        <tr>
          <td id="idEquipo" style="display:none;">${equipo.id || 'N/A'}</td>
          <td>${lineaData?.linea?.planta?.nombre || 'N/A'}</td>
          <td>${lineaData?.linea?.nombre || 'N/A'}</td>
          <td>${lineaData?.estacion?.nombre || 'N/A'}</td>
          <td id="hostname">${equipo.hostname || 'N/A'}</td>
          <td>${softwareNames || 'N/A'}</td>  
          <td>
            <button class="btn btn-primary" id="btnAcciones">Acciones</button>
          </td >
        </tr>
        `
    })

    hideLoading()
    return data



}

export const registrarEquipoComputo = async (formData)=>{
  showLoading()

  const respuesta = await fetch("/GestionPlantas/GuardarEquipoComputo",{
    method: 'POST',
    body: formData,
  })
  const data = await respuesta.json()
  
  hideLoading()

  Swal.fire({
    icon:"success",
    text:"Equipo registrado"
  })

}

export const obtenerSoftware = async ()=>{
  try {

    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerSoftware");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener software, " + (error.message || "desconocido")
    });
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }
}

export const asignarSoftwareEquipoComputo = async (formData)=>{
  try {
    showLoading()
    const response = await fetch("/GestionPlantas/AsignarSoftwareEquipoComputo", {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    Swal.fire({
      icon: "success",
      text: data.message
    });
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al asignar software, " + (error.message || "desconocido")
    });
  }finally{
    hideLoading()
  }

}