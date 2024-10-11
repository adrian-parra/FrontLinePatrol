
import { $ } from "/js/utils.js";
import { showLoading,hideLoading } from "/js/utils.js";



export const obtenerEquiposComputo = async (dataForm) =>{

    showLoading()

    const response = await fetch("/GestionPlantas/ObtenerEquiposComputo?idPlanta=" + dataForm.get("idPlanta") || "")

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
         <button class="btn btn-primary" id="btnAcciones" data-tippy-content="Acciones disponibles">Acciones</button>
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
    ).textContent = `Planta ${plantaSeleccionada}`;

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

