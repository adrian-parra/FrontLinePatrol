import {
  $,
  showLoading,
  hideLoading,
  getEstadoClass,
  tiempoTranscurrido,
  diferenciaTiempo,
  showAlert,
  ApiService,
  IPUtils
}from "/js/utils.js";

export const obtenerEquiposComputo = async (dataForm) => {
  showLoading();

  const response = await fetch("/GestionPlantas/ObtenerEquiposComputo?idPlanta=" + dataForm.get("idPlanta") || "");
  const data = await response.json();

  // Usar template literals y reduce para construcción de tabla más eficiente
  const tableRows = data.reduce((html, equipo) => {
    const lineaData = equipo.lineas[0] || {};
    return html + `
            <tr>
                <td id="idEquipo" style="display:none;">${equipo.id || '<span class="text-danger">N/A</span>'}</td>
                <td>${lineaData.linea?.planta?.nombre || '<span class="text-danger">N/A</span>'}</td>
                <td>${lineaData.linea?.nombre || '<span class="text-danger">N/A</span>'}</td>
                <td>${lineaData.estacion?.nombre || '<span class="text-danger">N/A</span>'}</td>
                <td id="hostname" class="text-start">
                    <span class="badge bg-secondary text-white rounded-2 px-3 py-2 text-monospace cursor-pointer" 
                        data-tippy-content="Haz clic para copiar"
                        id="btnCopiarHostname">${equipo.hostname || '<span class="text-danger">N/A</span>'}</span>
                </td>
                <td>
                    <button class="btn btn-primary" id="btnAcciones" data-tippy-content="Acciones disponibles">
                        <i class="fas fa-tasks"></i> Acciones
                    </button>
                </td>
            </tr>
        `;
  }, '');

  $(".container-items").innerHTML = `
        <table id="equiposTable" class="table">
            <thead class="table-header">
                <tr>
                    <th style="display:none;">ID</th>
                    <th>Planta</th>
                    <th>Línea</th>
                    <th>Estación/Ubicación</th>
                    <th>Hostname</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody class="items-table">${tableRows}</tbody>
        </table>
    `;

  // Inicializar Tippy de manera más eficiente
  requestAnimationFrame(() => {
    tippy('[data-tippy-content]', {
      animation: 'scale',
      duration: [300, 200],
      placement: 'top',
      arrow: true,
      delay: [100, 50]
    });
  });

  hideLoading();
  return data;
};

export const registrarEquipoComputo = async (formData) => {
  try {

    const ip = formData.get("hostname");

    if(!IPUtils.isPrivateIP(ip)) {
      const hostname = await IPUtils.getHostnameFromIP(ip);
      if(!hostname) {
       // throw new Error('No se pudo obtener el hostname');
      }else{
        formData.set("hostname", hostname);
      }
    }

    const dataResponse = await ApiService.fetchData("/GestionPlantas/GuardarEquipoComputo", {
      method: 'POST',
      body: formData
    });

    return dataResponse.data;
  } catch (error) {
    throw error;
  } 
};

export const obtenerSoftware = async () => {
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
    showAlert("error", "Error al obtener software, " + (error.message || "desconocido"));
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }
}

export const asignarSoftwareEquipoComputo = async (formData) => {
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
    showAlert("success", data.message);
    return data;
  } catch (error) {
    console.log(error);
    showAlert("error", "Error al asignar software, " + (error.message || "desconocido"));
  } finally {
    hideLoading()
  }
}

export const asignarEstacionUbicacionEquipoComputo = async (formData) => {
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
    showAlert("success", data.message);
    return data;
  } catch (error) {
    console.log(error);
    showAlert("error", "Error al asignar estación, " + (error.message || "desconocido"));
  } finally {
    hideLoading()
  }
}

export const obtenerEstaciones = async () => {
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
    showAlert("error", "Error al obtener estaciones, " + (error.message || "desconocido"));
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }
}

export const obtenerLineas = async () => {
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
    showAlert("error", "Error al obtener lineas, " + (error.message || "desconocido"));
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }
}

export const registrarPlanta = async (formData) => {
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

    showAlert("success", dataResponse.message);

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar planta:", error);
    showAlert("error", "Error al registrar planta. Inténtalo de nuevo más tarde. " + error.message);
  } finally {
    hideLoading();
  }
}

export const registrarEstacion = async (formData) => {
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

    showAlert("success", dataResponse.message);

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar estación:", error);
    showAlert("error", "Error al registrar estación. Inténtalo de nuevo más tarde. " + error.message);
  } finally {
    hideLoading();
  }
}

export const registrarLinea = async (formData) => {
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

    showAlert("success", dataResponse.message);

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar linea:", error);
    showAlert("error", "Error al registrar linea. Inténtalo de nuevo más tarde. " + error.message);
  } finally {
    hideLoading();
  }
}

export const obtenerPlantas = async () => {
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
    showAlert("error", "Error al obtener plantas, " + (error.message || "desconocido"));
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }
}

export const registrarSoftware = async (formData) => {
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
    showAlert("error", "Error al registrar software. Inténtalo de nuevo más tarde. " + error.message);
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
    showAlert("error", "Por favor, selecciona una planta.");
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

    showAlert("success", dataResponse.message);

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar impresora:", error);
    showAlert("error", "Error al registrar impresora. Inténtalo de nuevo más tarde. " + error.message);
  } finally {
    hideLoading();
  }

}

export const obtenerImpresora = async () => {
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
    showAlert("error", "Error al obtener impresoras, " + (error.message || "desconocido"));
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }

}
export const asignarImpresoraEquipoComputo = async (formData) => {
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
    showAlert("success", data.message);
    return data;
  } catch (error) {
    console.log(error);
    showAlert("error", "Error al asignar impresora, " + (error.message || "desconocido"));
  } finally {
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

    showAlert("success", dataResponse.message);

    return dataResponse.data;
  } catch (error) {
    console.error("Error al registrar soporte:", error);
    showAlert("error", "Error al registrar soporte. Inténtalo de nuevo más tarde. " + error.message);
    return false;
  } finally {
    hideLoading();
  }

}

export const SoportesPorHostname = ({ soportes }) => {


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
                <td><span class="text-primary">${diferenciaTiempo(item.createdAt, item.updatedAt)}</span></td>


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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// En tu función de renderizado

const pintarSoportesTable = (datos) => {
  const containerSoportes = document.querySelector(".container-soportes")

  containerSoportes.innerHTML = ``

  // Crear una variable para almacenar el contenido de la tabla
  let tablaHTML = `
  <table  class="table table-hover table-bordered">
      <thead class="table-dark">
          <tr>
              <th style="min-width: 80px;" scope="col">Planta</th>
              <th scope="col">Linea</th>
              <th scope="col">Estación/Ubicación</th>
              <th style="min-width: 200px;" scope="col">Problema/Descripción</th>
              <th style="min-width: 200px;" scope="col">Solución/Acción</th>
               <th scope="col">Responsable</th>
               <th scope="col">Req. por</th>
              <th scope="col">Estado/Situación</th>
              <th scope="col">Cambio de Es.</th>
          </tr>
      </thead>
      <tbody>
  `;

  // Agregar los datos a la tabla
  if (datos.length === 0) {
    tablaHTML += `
      <tr>
          <td colspan="10" class="text-center text-muted py-3">
              No hay registros para mostrar
          </td>
      </tr>
      `;
  } else {
    datos.forEach(item => {

      tablaHTML += `
          
              <tr >
                  <td style="display:none;" class="id-soporte">${item.id}</td>

                  <td>
                      <span class="text-extra text-truncate text-uppercase px-1 fw-light">
                          ${item.equipoComputo.lineas[0].linea.planta.nombre}
                      </span>
                  </td>
                  <td>
                      <span class="text-extra text-truncate text-uppercase px-1 fw-light">
                          ${["NO APLICA MCH3", "NO APLICA MCH2", "NO APLICA MCH1"].includes(item.equipoComputo.lineas[0].linea.nombre) ? "N/A" : item.equipoComputo.lineas[0].linea.nombre}
                      </span>
                  </td>
                  <td>
                      <span class="text-extra text-truncate text-uppercase px-1 fw-light">
                          ${item.equipoComputo.lineas[0].estacion.nombre}
                      </span>
                  </td>
                 
                  <td>
                      <span class="text-extra fw-light text-wrap text-break">
                          ${item.descripcion ? capitalizeFirstLetter(item.descripcion) : 'N/A'}
                      </span>
                  </td>
                  <td>
                      <span class="text-extra fw-light text-wrap text-break">
                          ${item.solucion ? capitalizeFirstLetter(item.solucion) : 'N/A'}
                      </span>
                  </td>
                 <td><span class="text-extra text-primary bg-primary bg-opacity-10 px-1 rounded text-uppercase fw-light">${item.responsable ? item.responsable : 'N/A'}</span></td>

                 <td><span class="text-extra text-primary bg-primary bg-opacity-10 px-1 rounded text-uppercase fw-light">${item.requeridoPor ? item.requeridoPor : 'N/A'}</span></td>

                 <td>
                     <span class="${getEstadoClass(item.estado)} estado-soporte text-${getBootstrapColorForEstado(item.estado)} bg-${getBootstrapColorForEstado(item.estado)} bg-opacity-10 px-1 rounded text-uppercase fw-light">
                         ${item.estado}
                     </span>
                 </td>
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
  }

  // Cerrar las etiquetas de la tabla
  tablaHTML += `
      </tbody>
  </table>
  `;

  // Asignar el contenido de la tabla al contenedor
  containerSoportes.innerHTML = tablaHTML;
}

function getBootstrapColorForEstado(estado) {
  switch (estado) {
    case 'Pendiente': return 'warning';
    case 'En Proceso': return 'primary';
    case 'Resuelto': return 'success';
    case 'Cancelado': return 'danger';
    default: return 'secondary';
  }
}


export const obtenerSoportesHoy = async () => {

  try {
    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerSoportesHoy");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const datos = await response.json();

    pintarSoportesTable(datos)

    return datos;
  } catch (error) {
    console.log(error);
    showAlert("error", "Error al obtener soportes de hoy, " + (error.message || "desconocido"));
    return false;
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading()
  }

}

export const completarSoporte = async (formData) => {
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

    showAlert("success", dataResponse.message);
    return true;
  } catch (error) {

    showAlert("error", "Error al completar soporte. Inténtalo de nuevo más tarde. " + error.message);
    return false;
  } finally {
    hideLoading();
  }
}



// ESTADISTICAS DE SOPORTES USANDO CHART.JS

export const obtenerTopSoportes = async (formData) => {
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
    showAlert("error", "Error al obtener top soportes, " + (error.message || "desconocido"));
  } finally {
    hideLoading()
  }


}

export const obtenerSoportesSemana = async (formData) => {
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
    showAlert("error", "Error al obtener soportes de la semana, " + (error.message || "desconocido"));
  } finally {
    hideLoading()
  }

}

export const ObtenerSoportesPorFechas = async (formData) => {
  try {

    showLoading()
    const response = await fetch("/GestionPlantas/ObtenerSoportesPorFechas?fechaInicio=" + formData.get("fechaInicio") + "&fechaFin=" + formData.get("fechaFin") + "&plantas=" + formData.get("plantas"));

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    pintarSoportesTable(data)
    return data;
  } catch (error) {
    console.log(error);
    showAlert("error", "Error al obtener soportes por fechas, " + (error.message || "desconocido"));
  } finally {
    hideLoading()
  }

}
