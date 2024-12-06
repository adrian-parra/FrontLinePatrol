
import { 
  $, 
  showLoading, 
  hideLoading, 
  getEstadoClass, 
  tiempoTranscurrido, 
  diferenciaTiempo } 
from "/js/utils.js";


export const obtenerEquiposComputo = async (dataForm) =>{

    showLoading()

    const response = await fetch("/GestionPlantas/ObtenerEquiposComputo?idPlanta=" + dataForm.get("idPlanta") || "")

    const data = await response.json()



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
       <td  style="display:none;">
         <p id="idEquipo" data-tippy-content="${equipo.id || 'Sin información'}">${equipo.id || '<span class="text-danger">N/A</span>'}</p>
       </td>
       <td>
         <p data-tippy-content="${lineaData?.linea?.planta?.nombre || 'Sin información'}">${lineaData?.linea?.planta?.nombre ? lineaData.linea.planta.nombre : '<span class="text-danger">N/A</span>'}</p>
       </td>
       <td>
         <p data-tippy-content="${lineaData?.linea?.nombre || 'Sin información'}">${lineaData?.linea?.nombre ? lineaData.linea.nombre : '<span class="text-danger">N/A</span>'}</p>
       </td>
       <td>
         <p data-tippy-content="${lineaData?.estacion?.nombre || 'Sin información'}">${lineaData?.estacion?.nombre ? lineaData.estacion.nombre : '<span class="text-danger">N/A</span>'}</p>
       </td>
       <td>
         <p id="hostname" data-tippy-content="${equipo.hostname || 'Sin información'}">${equipo.hostname ? equipo.hostname : '<span class="text-danger">N/A</span>'}</p>
       </td>
       <td>
         <p data-tippy-content="${softwareNames || 'Sin información'}">${softwareNames ? softwareNames : '<span class="text-danger">N/A</span>'}</p>
       </td>  
       <td>
         <button class="btn btn-primary" id="btnAcciones" data-tippy-content="Acciones disponibles"> <i class="fas fa-tasks"></i> Acciones</button>
       </td>
     </tr>
     `;

// Iniciar Tippy en los elementos que tengan data-tippy-content
tippy('[data-tippy-content]', {
  // theme: 'custom', // Aplica el tema personalizado
  animation: 'scale', // Animación de escalado
  duration: [300, 200], // Duración de la animación (entrada, salida)
  placement: 'top', // Posición del tooltip
  arrow: true, // Mostrar la flecha del tooltip
  delay: [100, 50], // Retraso al mostrar (entrada, salida)
  //maxWidth: 200, // Ancho máximo del tooltip
});

    })

    hideLoading()
    return data



}

export const registrarEquipoComputo = async (formData) => {
  showLoading();

  try {
    const respuesta = await fetch("/GestionPlantas/GuardarEquipoComputo", {
      method: 'POST',
      body: formData,
    });

    // Verifica si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const dataResponse = await respuesta.json();

    Swal.fire({
      icon: "success",
      text: dataResponse.data.message,
    });

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar el equipo:", error);
    Swal.fire({
      icon: "error",
      text: "Error al registrar el equipo. Inténtalo de nuevo más tarde.",
    });
  } finally {
    hideLoading();
  }
};


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

export const asignarEstacionUbicacionEquipoComputo = async (formData)=>{
  try {
    showLoading()
    const response = await fetch("/GestionPlantas/AsignarEstacionUbicacionEquipoComputo", {
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
      text: "Error al asignar estación, " + (error.message || "desconocido")
    });
  }finally{
    hideLoading()
  }
}

export const obtenerEstaciones = async ()=>{
  try {

    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerEstacionesUbicacion");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener estaciones, " + (error.message || "desconocido")
    });
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }
}

export const obtenerLineas = async ()=>{
  try {

    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerLineas");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener lineas, " + (error.message || "desconocido")
    });
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }
}

export const registrarPlanta = async (formData)=>{
  showLoading();

  try {
    const respuesta = await fetch("/GestionPlantas/RegistrarPlanta", {
      method: 'POST',
      body: formData,
    });

    // Verifica si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const dataResponse = await respuesta.json();

    Swal.fire({
      icon: "success",
      text: dataResponse.message,
    });

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar planta:", error);
    Swal.fire({
      icon: "error",
      text: "Error al registrar planta. Inténtalo de nuevo más tarde. "+error.message,
    });
  } finally {
    hideLoading();
  }
}

export const registrarEstacion = async (formData)=>{
  showLoading();

  try {
    const respuesta = await fetch("/GestionPlantas/RegistrarEstacion", {
      method: 'POST',
      body: formData,
    });

    // Verifica si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const dataResponse = await respuesta.json();

    Swal.fire({
      icon: "success",
      text: dataResponse.message,
    });

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar estación:", error);
    Swal.fire({
      icon: "error",
      text: "Error al registrar estación. Inténtalo de nuevo más tarde. "+error.message,
    });
  } finally {
    hideLoading();
  }
}

export const registrarLinea = async (formData)=>{
  showLoading();

  try {
    const respuesta = await fetch("/GestionPlantas/RegistrarLinea", {
      method: 'POST',
      body: formData,
    });

    // Verifica si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const dataResponse = await respuesta.json();

    Swal.fire({
      icon: "success",
      text: dataResponse.message,
    });

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar linea:", error);
    Swal.fire({
      icon: "error",
      text: "Error al registrar linea. Inténtalo de nuevo más tarde. "+error.message,
    });
  } finally {
    hideLoading();
  }
}

export const obtenerPlantas = async ()=>{
  try {

    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerPlantas");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener plantas, " + (error.message || "desconocido")
    });
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }
}

export const registrarSoftware = async (formData)=>{
  showLoading();

  try {
    const respuesta = await fetch("/GestionPlantas/RegistrarSoftware", {
      method: 'POST',
      body: formData,
    });

    // Verifica si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const dataResponse = await respuesta.json();

    return dataResponse;
  } catch (error) {
    console.error("Error al registrar software:", error);
    Swal.fire({
      icon: "error",
      text: "Error al registrar software. Inténtalo de nuevo más tarde. "+error.message,
    });
  } finally {
    hideLoading();
  }
}

export const confirmarPlantaRecorrido = async (formData) => {
  const plantaSeleccionada = $("#selectPlanta").value;

  if (plantaSeleccionada) {
    // ALMACENAR LA PLANTA SELECCIONADA EN LOCALSTORAGE
    localStorage.setItem("plantaSeleccionadaG", plantaSeleccionada);

    // ACTUALIZAR EL TEXTO DEL BOTÓN FLOTANTE CON LA PLANTA SELECCIONADA
    $(
      ".loal-button-flotante-planta"
    ).innerHTML = `<i class="fas fa-building"></i> Planta ${plantaSeleccionada}`;

    // MANTENER LA SELECCIÓN EN EL SELECTOR
    $("#selectPlanta").value = plantaSeleccionada;


    // LLAMADA A LA FUNCIÓN PARA OBTENER LOS RECORRIDOS POR PLANTA
    await obtenerEquiposComputo(formData);

    // CERRAR EL MODAL
    $("#exampleModalPlantaRecorrido .btn-close").click();
  } else {
    // MOSTRAR UN MENSAJE DE ERROR SI NO SE SELECCIONA NINGUNA PLANTA
    Swal.fire({
      icon: "error",
      text: "Por favor, selecciona una planta.",
    });
  }
};

export const registrarImpresora = async (formData) => {
  showLoading();

  try {
    const respuesta = await fetch("/GestionPlantas/GuardarImpresora", {
      method: 'POST',
      body: formData,
    });

    // Verifica si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const dataResponse = await respuesta.json();

    Swal.fire({
      icon: "success",
      text: dataResponse.message,
    });

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar impresora:", error);
    Swal.fire({
      icon: "error",
      text: "Error al registrar impresora. Inténtalo de nuevo más tarde. " + error.message,
    });
  } finally {
    hideLoading();
  }

}

export const obtenerImpresora = async ()=>{
  try {
    console.log("Obtenidbdo impresora")
    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerImpresora");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener impresoras, " + (error.message || "desconocido")
    });
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }

}
export const asignarImpresoraEquipoComputo = async (formData)=>{
  try {
    showLoading()
    const response = await fetch("/GestionPlantas/AsignarImpresoraEquipoComputo", {
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
      text: "Error al asignar impresora, " + (error.message || "desconocido")
    });
  }finally{
    hideLoading()
  }


}

export const registrarSoporte = async (formData) => {
  showLoading();

  try {
    const respuesta = await fetch("/GestionPlantas/RegistrarSoporte", {
      method: 'POST',
      body: formData,
    });

    // Verifica si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const dataResponse = await respuesta.json();

    Swal.fire({
      icon: "success",
      text: dataResponse.message,
    });


    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar soporte:", error);
    Swal.fire({
      icon: "error",
      text: "Error al registrar soporte. Inténtalo de nuevo más tarde. " + error.message,
    });
    return false;
  } finally {
    hideLoading();
  }

}

export const SoportesPorHostname = ({soportes})=>{


  const containerSoportes = document.querySelector(".container-soportes-por-hostname")
  
    containerSoportes.innerHTML = ``
  
    // Crear una variable para almacenar el contenido de la tabla
    let tablaHTML = `
    <table class="table">
        <thead>
            <tr>
                <th>Problema/Descripción</th>
                <th>Responsable</th>
                <th>Solución/Acción</th>
                <th>Estado/Situación</th>
                <th>Tiempo transcurrido</th>
                <th>Actualización</th>
                <th>Diferencia</th>


            </tr>
        </thead>
        <tbody>
    `;
  
    // Agregar los datos a la tabla
    soportes.forEach(item => {
        
        tablaHTML += `
            <tr >
                <td><span class="text-primary">${item.descripcion}</span></td>
                <td><span class="text-primary">${item.responsable}</span></td>
                <td><span class="text-primary">${item.solucion}</span></td>
                <td><span class="${getEstadoClass(item.estado)} estado-soporte">${item.estado}</span></td>
                <td><span class="text-primary">${tiempoTranscurrido(item.createdAt)}</span></td>
                <td><span class="text-primary">${tiempoTranscurrido(item.updatedAt)}</span></td>
                <td><span class="text-primary">${diferenciaTiempo(item.createdAt,item.updatedAt)}</span></td>


            </tr>
        `;
    });
  
    // Cerrar las etiquetas de la tabla
    tablaHTML += `
        </tbody>
    </table>
    `;
  
    // Asignar el contenido de la tabla al contenedor
    containerSoportes.innerHTML = tablaHTML;
}

export const obtenerSoportesHoy =  async ()=>{

  try {
    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerSoportesHoy");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const datos = await response.json();


    const containerSoportes = document.querySelector(".container-soportes")
  
    containerSoportes.innerHTML = ``
  
    // Crear una variable para almacenar el contenido de la tabla
    let tablaHTML = `
    <table  class="table table-hover table-bordered">
        <thead class="table-dark">
            <tr>
                <th scope="col">Linea</th>
                <th scope="col">Estación/Ubicación</th>
                <th scope="col">Problema/Descripción</th>
                <th scope="col">Solución/Acción</th>
                 <th scope="col">Responsable</th>
                <th scope="col">Estado/Situación</th>
                <th scope="col">Cambio de Es.</th>
            </tr>
        </thead>
        <tbody>
    `;
  
    // Agregar los datos a la tabla
    datos.forEach(item => {
        
        tablaHTML += `
            <tr >
                <td style="display:none;" class="id-soporte">${item.id}</td>
                <td><span class="text-extra">${item.equipoComputo.lineas[0].linea.nombre === "NO APLICA MCH3" ? "N/A" : item.equipoComputo.lineas[0].linea.nombre}</span></td>
                <td><span class="text-extra estacion-ubicacion-soporte">${item.equipoComputo.lineas[0].estacion.nombre}</span></td>
                <td><span class="text-extra">${item.descripcion}</span></td>
                <td><span class="text-extra">${item.solucion}</span></td>
                <td><span class="text-extra">${item.responsable}</span></td>
                <td><span class="${getEstadoClass(item.estado)} estado-soporte">${item.estado}</span></td>
                <td>
                    <button style="${item.estado === 'Resuelto' ? 'display:none;' : ''} width:110px;" 
        class="btn btn-sm ${item.estado === 'Pendiente' ? 'btn-warning' : item.estado === 'En proceso' ? 'btn-success' : 'btn-secondary'}">
    <i class="${item.estado === 'Pendiente' ? 'fas fa-clock' : item.estado === 'En proceso' ? 'fas fa-spinner' : 'fas fa-check'}"></i>
    ${item.estado === 'Pendiente' ? 'En proceso' : item.estado === 'En proceso' ? 'Realizar' : 'Pendiente'}
</button>
                </td>
            </tr>
        `;
    });
  
    // Cerrar las etiquetas de la tabla
    tablaHTML += `
        </tbody>
    </table>
    `;
  
    // Asignar el contenido de la tabla al contenedor
    containerSoportes.innerHTML = tablaHTML;
    return datos;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener soportes de hoy, " + (error.message || "desconocido")
    });
    return false;
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }

}

export const completarSoporte = async (formData)=>{
  showLoading();

  try {
    const respuesta = await fetch("/GestionPlantas/SoporteAccion", {
      method: 'PATCH',
      body: formData,
    });

    // Verifica si la respuesta es exitosa
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const dataResponse = await respuesta.json();

    Swal.fire({
      icon: "success",
      text: dataResponse.message,
    });
    return true;
  } catch (error) {

    Swal.fire({
      icon: "error",
      text: "Error al completar soporte. Inténtalo de nuevo más tarde. " + error.message,
    });
    return false;
  } finally {
    hideLoading();
  }
}

// ESTADISTICAS DE SOPORTES USANDO CHART.JS

export const obtenerTopSoportes = async (formData)=>{
  try {
    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerTopSoportes?mes=" + formData.get("mes") || "");

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener top soportes, " + (error.message || "desconocido")
    });
  }finally{
    hideLoading()
  }


}

export const obtenerSoportesSemana = async (formData)=>{
  try {
    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerSoportesSeamanas?mes=" + formData.get("mes") || "");

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener soportes de la semana, " + (error.message || "desconocido")
    });
  }finally{
    hideLoading()
  }

}
