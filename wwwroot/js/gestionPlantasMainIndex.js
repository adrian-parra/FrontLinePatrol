// Importaciones agrupadas por módulo
import * as gestionPlantas from "./gestionPlantasIndex.js";
import * as comandosWmi from "./cmdIndex.js";
import { hideLoading, showLoading, showModal,convertiFechaAUTC } from "./utils.js";

let myChart;
let chartSemanasSoportes;

// Estado global de la aplicación
const state = {
  hostname: null,
  idEquipoComputo: null,
  data: null,
  estadoSoporte: null,
  idSoporte: null
};

const DOM = {
  containers: {
    items: document.querySelector(".container-items"),
    buttonFlotantePlanta: document.querySelector(".loal-container-button-flotante-planta")
  },
  buttons: {
    registrarOpciones: document.querySelector("#btnRegistrarOpciones"),
    registrarEquipoComputo: document.querySelector("#btnRegistrarEquipoComputo"),
    cerrarApp: document.querySelector("#btnCerrarApp"),
    reiniciarEquipo: document.querySelector("#btnReiniciarEquipo"),
    agregarSoftware: document.querySelector("#btnAgregarSoftware"),
    estacionUbicacion: document.querySelector("#btnAgregarEstacionUbicacion"),
    registrarPlanta: document.querySelector("#btnRegistrarPlanta"),
    registrarEstacion: document.querySelector("#btnRegistrarEstacion"),
    registrarLinea: document.querySelector("#btnRegistrarLinea"),
    apagarEquipoComputo: document.querySelector("#btnApagarEquipoComputo"),
    informacionEquipoComputo: document.querySelector("#btnInformacionEquipoComputo"),
    uptimeEquipoComputo: document.querySelector("#btnUptimeEquipoComputo"),
    registrarSoftwareEquipoComputo: document.querySelector("#btnRegistrarSoftwareEquipoComputo"),
    desinstalarSoftwareInstaladoEquipoComputo: document.querySelector("#btnDesinstalarSoftwareInstaladoEquipoComputo"),
    confirmarPlanta: document.querySelector("#BtnconfirmarPlanta"),
    historialActualizacionEquipoComputo: document.querySelector("#btnHistorialActualizacionEquipoComputo"),
    almacenamientoEquipoComputo: document.querySelector("#btnAlmacenamientoEquipoComputo"),
    memoriaFisicaEquipoComputo: document.querySelector("#btnMemoriaFisicaEquipoComputo"),
    sistemaOperativoEquipoComputo: document.querySelector("#btnSistemaOperativoEquipoComputo"),
    getServicesEquipoComputo: document.querySelector("#btnGetServicesEquipoComputo"),
    deleteTempEquipoComputo: document.querySelector("#btnDeleteTempEquipoComputo"),
    getProcessEquipoComputo: document.querySelector("#btnGetProcessEquipoComputo"),
    getUsuariosEquipoComputo: document.querySelector("#btnGetUsuariosEquipoComputo"),
    registrarImpresoraEquipoComputo: document.querySelector("#btnRegistrarImpresoraEquipoComputo"),
    asignarImpresoraEquipoComputo: document.querySelector("#btnAsignarImpresoraEquipoComputo"),
    registrarSoporteEquipoComputo: document.querySelector("#btnRegistrarSoporteEquipoComputo"),
    soportesHoy: document.querySelector("#btnSoportesHoy"),
    obtenerSoporteEquipoComputo: document.querySelector("#btnObtenerSoporteEquipoComputo"),
    obtenerPuntoRestauracionEquipoComputo: document.querySelector("#btnObtenerPuntoRestauracionEquipoComputo"),
    accionesGenerales: document.querySelector("#btnAccionesGenerales"),
    estadisticasSoportes: document.querySelector("#btnEstadisticasSoportes"),
    accionesDispositivoTemporal: document.querySelector("#btnAccionesDispositivoTemporal"),
    buscarSoporteHoy: document.querySelector("#btnBuscarSoporteHoy"),
  },
  modals: {
    registrarOpciones: document.querySelector("#exampleModalOpcionesRegistro"),
    registrarEquipoComputo: document.querySelector("#exampleModalRegistrarEquipoComputo"),
    accionesRegistro: document.querySelector("#exampleModalAccionesRegistro"),
    registrarPlanta: document.querySelector("#exampleModalRegistrarPlanta"),
    registrarEstacion: document.querySelector("#exampleModalRegistrarEstacion"),
    registrarLinea: document.querySelector("#exampleModalRegistrarLinea"),
    registrarSoftwareEquipoComputo: document.querySelector("#exampleModalRegistrarSoftwareEquipoComputo"),
    desinstalarSoftwareInstaladoEquipoComputo: document.querySelector("#exampleModalDesinstalarSoftwareInstaladoEquipoComputo"),
    plantaRecorrido: document.querySelector("#exampleModalPlantaRecorrido"),
    registrarImpresoraEquipoComputo: document.querySelector("#exampleModalRegistrarImpresoraEquipoComputo"),
    asignarImpresoraEquipoComputo: document.querySelector("#exampleModalAsignarImpresoraEquipoComputo"),
    registrarSoporteEquipoComputo: document.querySelector("#exampleModalRegistrarSoporteEquipoComputo"),
    soportesHoy: document.querySelector("#exampleModalSoportesHoy"),
    obtenerSoporteEquipoComputo: document.querySelector("#exampleModalObtenerSoporteEquipoComputo"),
    obtenerPuntoRestauracionEquipoComputo: document.querySelector("#exampleModalObtenerPuntoRestauracionEquipoComputo"),
    accionesGenerales: document.querySelector("#exampleModalAccionesGenerales"),
    estadisticasSoportes: document.querySelector("#exampleModalEstadisticasSoportes"),
    accionesDispositivoTemporal: document.querySelector("#exampleModalAccionesDispositivoTemporal")
  },
  forms: {
    registrarEquipoComputo: document.querySelector("#formRegistrarEquipoComputo"),
    cerrarSoftware: document.querySelector("#formCerrarSoftware"),
    agregarSoftwareEquipoComputo: document.querySelector("#formAgregarSoftwareEquipoComputo"),
    agregarEstacionEquipoComputo: document.querySelector("#formAgregarEstacionEquipoComputo"),
    registrarPlanta: document.querySelector("#formRegistrarPlanta"),
    registrarEstacion: document.querySelector("#formRegistrarEstacion"),
    registrarLinea: document.querySelector("#formRegistrarLinea"),
    registrarSoftwareEquipoComputo: document.querySelector("#formRegistrarSoftwareEquipoComputo"),
    desinstalarSoftwareInstaladoEquipoComputo: document.querySelector("#formDesinstalarSoftwareEquipoComputo"),
    registrarImpresoraEquipoComputo: document.querySelector("#formRegistrarImpresoraEquipoComputo"),
    asignarImpresoraEquipoComputo: document.querySelector("#formAsignarImpresoraEquipoComputo"),
    registrarSoporteEquipoComputo: document.querySelector("#formRegistrarSoporteEquipoComputo"),
    completarSoporte: document.querySelector("#formCompletarSoporte"),
    dispositivoTemporal: document.querySelector("#formDispositivoTemporal")
  }
};

// ! INICIO ONLOAD
document.addEventListener("DOMContentLoaded", async () => {

  const plantaGuardada = localStorage.getItem("plantaSeleccionadaG");

  if (plantaGuardada) {
    document.querySelector(".loal-button-flotante-planta").innerHTML = `<i class="fas fa-building"></i> Planta ${plantaGuardada}`;
    document.querySelector("#selectPlanta").value = plantaGuardada;

    const formData = new FormData()
    formData.append("idPlanta", plantaGuardada)

    state.data = await gestionPlantas.obtenerEquiposComputo(formData);
  } else {
    showModal(DOM.modals.plantaRecorrido);

  }

  function initDataTable() {
      return $("#equiposTable").DataTable({
          language: {
              url: "../lib/datatables/traslate/es/es-ES.json",
          },
          columnDefs: [{
              targets: 0,
              visible: true,
          }],
          dom: "Bfrtip",
          buttons: [
              {
                  extend: "excelHtml5",
                  text: "Exportar Excel",
                  filename: "Reporte Empleados",
                  exportOptions: { columns: [1, 2, 3, 4] },
                  className: "btn-exportar-excel",
              },
              {
                  extend: "pdfHtml5",
                  text: "Exportar PDF",
                  filename: "Reporte de equipo de",
                  exportOptions: { columns: [1, 2, 3, 4] },
                  className: "btn-exportar-pdf",
              },
              {
                  extend: "print",
                  exportOptions: { columns: [1, 2, 3, 4] },
                  className: "btn-exportar-print",
              },
              "pageLength",
          ],
          // Desactivar algunas características para mejorar rendimiento
          processing: false,
          deferRender: true,
          scrollX: true,
          pageLength: 10
      });
  }
  
  

  DOM.buttons.buscarSoporteHoy.addEventListener("click", async () => {
    const fechaInicio = document.querySelector("#fechaInicio").value;
    const horaInicio = document.querySelector("#horaInicio").value;
    const fechaFin = document.querySelector("#fechaFin").value;
    const horaFin = document.querySelector("#horaFin").value;

    const fechaInicioUTC = convertiFechaAUTC(fechaInicio, horaInicio);
    const fechaFinUTC = convertiFechaAUTC(fechaFin, horaFin);

    const formData = new FormData();
    formData.append("fechaInicio", fechaInicioUTC);
    formData.append("fechaFin", fechaFinUTC);
   
    await gestionPlantas.ObtenerSoportesPorFechas(formData);

    //await gestionPlantas.getSoportes(formData);
  });

  DOM.buttons.confirmarPlanta.addEventListener("click", async () => {
    const formData = new FormData()
    formData.append("idPlanta", document.querySelector("#selectPlanta").value)

    await gestionPlantas.confirmarPlantaRecorrido(formData)

    await updateInterfaz()
  });

  DOM.containers.buttonFlotantePlanta.addEventListener("click", () => showModal(DOM.modals.plantaRecorrido));

  DOM.containers.items.addEventListener("click", async (e) => {
    const target = e.target;
    console.log(target);
    if (target.id === "btnAcciones") {

      initAccionesEquipoSoftware(target)
    }

    if (target.tagName === 'TD') {
      // initAccionesEquipoSoftware(target)
    }

  });

  DOM.buttons.registrarEquipoComputo.addEventListener("click", () => {
    showModal(DOM.modals.registrarEquipoComputo);
  });

  DOM.buttons.registrarOpciones.addEventListener("click", () => {
    showModal(DOM.modals.registrarOpciones);
  });

  DOM.forms.registrarEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = await gestionPlantas.registrarEquipoComputo(formData);

    e.target.reset();
    updateInterfaz()
  });

  DOM.buttons.cerrarApp.addEventListener("click", async () => {
    const dataForm = new FormData();
    dataForm.append("ip", state.hostname);

    const software = gestionPlantas.obtenerSoftwarePorHostname(state.hostname);

    if (software == "") {
      Swal.fire({
        icon: "error",
        text: "No se encontraron software",
      });
      return;
    }

    document.querySelector("#selectedOption").innerHTML = `
     Selecciona una opción
    <i class="fas fa-check-circle" style="display: none;color:var(--ColorSuccess)"></i>
    <i class="fas fa-chevron-down"></i>
    <i class="fas fa-chevron-up" style="display: none;"></i>
    `;

    document.querySelector(".options").innerHTML = ``
    software.forEach((item) => {
      document.querySelector(".options").innerHTML += `
        <div class="card option" data-value="${item}.exe">
       <p style="margin:0;"> ${item} <i class="fas fa-hand-pointer"></i></p>
            </div>
      `
    });

    showModal("#exampleModalCerrarSoftware");
  });

  DOM.buttons.reiniciarEquipo.addEventListener("click", async () => {
    const dataForm = new FormData();
    dataForm.append("ip", state.hostname);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres reiniciar el equipo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        showLoading();
        comandosWmi.restartDeviceWmi(dataForm);
        hideLoading();
      }
    });
  });

  DOM.buttons.agregarSoftware.addEventListener("click", async () => {
    const software = await gestionPlantas.obtenerSoftware();

    document.querySelector("#selectSoftwareEquipoComputo").innerHTML = ``;
    software.forEach((item) => {
      document.querySelector("#selectSoftwareEquipoComputo").innerHTML += `
      <option value="${item.id}">${item.nombre}</option>`;
    });

    showModal("#exampleModalAgregarSoftwareEquipoComputo");
  });

  DOM.forms.cerrarSoftware.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);

    if (dataForm.get("app") == "") {
      Swal.fire({
        icon: "error",
        text: "Selecciona una opción",
      })
      return;
    }
    dataForm.append("ip", state.hostname);
    showLoading();
    await comandosWmi.cerrarAppWmi(dataForm);
    hideLoading();
  });

  DOM.forms.agregarSoftwareEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dataForm = new FormData(e.target);
    dataForm.append("idEquipoComputo", state.idEquipoComputo);

    const data = await gestionPlantas.asignarSoftwareEquipoComputo(dataForm);

    updateInterfaz()

  });

  DOM.buttons.estacionUbicacion.addEventListener("click", async () => {
    const estaciones = await gestionPlantas.obtenerEstaciones();

    document.querySelector("#selectEstacionEquipoComputo").innerHTML = ``;

    estaciones.forEach((estacion) => {
      document.querySelector("#selectEstacionEquipoComputo").innerHTML += `
      <option value="${estacion.id}">${estacion.nombre}</option>`;
    })
    const lineas = await gestionPlantas.obtenerLineas();

    document.querySelector("#selectLineaEquipoComputo").innerHTML = ``;

    lineas.forEach((linea) => {
      document.querySelector("#selectLineaEquipoComputo").innerHTML += `
      <option value="${linea.id}">${linea.nombre}</option>`;
    })


    showModal("#exampleModalAgregarEstacionEquipoComputo")
  });

  DOM.forms.agregarEstacionEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    dataForm.append("idEquipo", state.idEquipoComputo)

    await gestionPlantas.asignarEstacionUbicacionEquipoComputo(dataForm)

    updateInterfaz()
  });

  DOM.buttons.registrarPlanta.addEventListener("click", () => {
    showModal(DOM.modals.registrarPlanta)
  });

  DOM.forms.registrarPlanta.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    await gestionPlantas.registrarPlanta(dataForm)
    e.target.reset()

    updateInterfaz()
  });

  DOM.buttons.registrarEstacion.addEventListener("click", () => {
    showModal(DOM.modals.registrarEstacion)
  });

  DOM.forms.registrarEstacion.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    await gestionPlantas.registrarEstacion(dataForm)
    e.target.reset()

    updateInterfaz()
  });

  DOM.buttons.registrarLinea.addEventListener("click", async () => {

    const plantas = await gestionPlantas.obtenerPlantas();

    document.querySelector("#selectPlantaEquipoComputo").innerHTML = ``;

    plantas.forEach((planta) => {
      document.querySelector("#selectPlantaEquipoComputo").innerHTML += `
    <option value="${planta.id}">${planta.nombre}</option>`;
    })


    showModal(DOM.modals.registrarLinea)
  });

  DOM.forms.registrarLinea.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    await gestionPlantas.registrarLinea(dataForm)
    e.target.reset()

    updateInterfaz()
  });

  DOM.buttons.apagarEquipoComputo.addEventListener("click", async () => {
    const dataForm = new FormData();
    dataForm.append("ip", state.hostname);

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres apagar el equipo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await comandosWmi.apagarEquipoComputo(dataForm);
      }
    });
  });

  DOM.buttons.informacionEquipoComputo.addEventListener("click", async () => {

    var formData = new FormData();
    formData.append("ip", state.hostname);

    const data = await comandosWmi.obtenerInfoEquipoComputo(formData)

    console.log(data)

    let htmlContent = ``
    data.forEach(item => {
      htmlContent += `
    <div style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px">
            <p>Domain:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px"> ${item.domain}</span></p>
      <p>Fabricante:<span class="text-white bg-info p-1" style="padding:10px;border-radius:4px"> ${item.manufacturer}</span></p>
      <p>Modelo:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px"> ${item.model}</span></p>
      <p>Tipo de sistema:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.systemType}</span></p>
      <p>Usuario:<span class="text-white bg-success p-1" style="padding:10px;border-radius:4px"> ${item.userName}</span></p>
    </div>
    <hr>
  `
    });

    Swal.fire({
      html: `${htmlContent}`
    })
  });

  DOM.buttons.uptimeEquipoComputo.addEventListener("click", async () => {
    var formData = new FormData();
    formData.append("ip", state.hostname);

    const data = await comandosWmi.obtenerUptimeDevice(formData)


    Swal.fire({
      html: `
      <div>
        <p><span>Tiempo de encendido:</span> ${data.tiempoEncendido}</p>
        <p><span>Fecha de encendido:</span> ${data.fechaEncendido}</p>
      </div>
    `,
    })
  })

  DOM.buttons.registrarSoftwareEquipoComputo.addEventListener("click", () => {
    showModal(DOM.modals.registrarSoftwareEquipoComputo)
  });

  DOM.forms.registrarSoftwareEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    const data = await gestionPlantas.registrarSoftware(dataForm)


    e.target.reset()

    await updateInterfaz()

    Swal.fire({
      icon: "success",
      text: data.message,
    });
  });

  DOM.buttons.desinstalarSoftwareInstaladoEquipoComputo.addEventListener("click", async (e) => {

    const dataForm = new FormData()
    dataForm.append("ip", state.hostname)

    const data = await comandosWmi.obtenerSoftwareInstalado(dataForm);


    document.querySelector("#selectListadoSoftwareInstaladoEquipoComputo").innerHTML = ``;
    data.softwareInstalado.forEach((item) => {
      document.querySelector("#selectListadoSoftwareInstaladoEquipoComputo").innerHTML += `
    <option value="${item}">${item}</option>`;
    });

    showModal(DOM.modals.desinstalarSoftwareInstaladoEquipoComputo)
  });

  DOM.forms.desinstalarSoftwareInstaladoEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    dataForm.append("ip", state.hostname)

    const data = await comandosWmi.DesinstalarSoftwareDeEquipoWmi(dataForm)


    e.target.reset()

    await updateInterfaz()

    Swal.fire({
      icon: "success",
      text: data.message,
    });
  });

  DOM.buttons.historialActualizacionEquipoComputo.addEventListener("click", async () => {
    const dataForm = new FormData()
    dataForm.append("ip", state.hostname)

    const data = await comandosWmi.HistorialActualizacionEquipoComputo(dataForm)



    let htmlContent = ``
    data.forEach(item => {
      htmlContent += `
      <div style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px">
        <p>hotFixID:${item.hotFixID}</p>
        <p>installedOn:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px">${item.installedOn}</span></p>
        <p>TiempoDesdeInstalacion:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px">${item.tiempoDesdeInstalacion}</span></p>
        <p>descripcion:<span class="text-white bg-danger p-1" style="padding:10px;border-radius:4px">${item.description}</span></p>
        <p>csName:${item.csName}</p>
        <p>installDate:${item.installDate}</p>
        <p>name:${item.name}</p>
        <p>status:${item.status}</p>
        <hr>
      </div>
    `
    });

    Swal.fire({
      html: `
      <div>
        ${htmlContent}
      </div>
    `,
    });

  });

  DOM.buttons.obtenerPuntoRestauracionEquipoComputo.addEventListener("click", async () => {
    const dataForm = new FormData()
    dataForm.append("ip", state.hostname)

    const data = await comandosWmi.GetPuntoRestauracion(dataForm)

    let content = ""
    data.forEach(item => {

      content += `
      <div style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px">
        <p>Descripcion:<span class="text-white bg-success p-1" style="padding:10px;border-radius:4px"> ${item.description}</span></p>
        <p>Fecha de creación:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px"> ${item.creationTime}</span></p> 
        <p>Tiempo TRanscurrido:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.creationTimeFormatted}</span></p>
      </div>
      <hr>
    `
    })


    Swal.fire({
      html: `
      ${content}
    `,
    });

  });

  DOM.buttons.almacenamientoEquipoComputo.addEventListener("click", async () => {
    const formData = new FormData()
    formData.append("ip", state.hostname)

    const data = await comandosWmi.DiskSpace(formData)



    let content = ""
    data.forEach(item => {

      content += `
      <div style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px">
        <p><span>Device:</span> ${item.deviceID}</p>
        <p>Espacio libre:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px"> ${item.freeSpace}</span></p>
        <p>Espacio total:<span class="text-white bg-success p-1" style="padding:10px;border-radius:4px"> ${item.size}</span></p>
        <p>Tipo disco: ${item.driveType}</p>
        <p>Porcentaje utilizado: <span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px">${item.usedPercentage}%</span></p>
      </div>

      <hr>
    `
    })


    Swal.fire({
      html: `
      ${content}
    `,
    });

  });

  DOM.buttons.memoriaFisicaEquipoComputo.addEventListener("click", async () => {
    const formData = new FormData()
    formData.append("ip", state.hostname)

    const data = await comandosWmi.PhysicalMemory(formData)



    let content = ""
    data.forEach(item => {

      content += `
      <div style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px">
        <p>Velocidad:<span class="text-white bg-success p-1" style="padding:10px;border-radius:4px"> ${item.capacity}</span></p>
        <p>Velocidad:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px"> ${item.speed}</span></p>
        <p>Tipo:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.memoryType}</span></p>
      </div>

      <hr>
    `
    })


    Swal.fire({
      html: `
      ${content}
    `,
    });

  });

  DOM.buttons.sistemaOperativoEquipoComputo.addEventListener("click", async () => {
    const formData = new FormData()
    formData.append("ip", state.hostname)

    const data = await comandosWmi.SistemaOperativo(formData)



    let content = ""
    data.forEach(item => {

      // <p>Build:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.buildNumber}</span></p>
      // <p>Fabricante:<span class="text-white bg-info p-1" style="padding:10px;border-radius:4px"> ${item.manufacturer}</span></p>
      content += `
      <div style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px">
        <p>Nombre:<span class="text-white bg-success p-1" style="padding:10px;border-radius:4px"> ${item.caption}</span></p>
        <p>Versión:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px"> ${item.version}</span></p> 
      </div>
      <hr>
    `
    })


    Swal.fire({
      html: `
      ${content}
    `,
    });

  });

  DOM.buttons.getServicesEquipoComputo.addEventListener("click", async () => {
    const formData = new FormData()
    formData.append("ip", state.hostname)

    const data = await comandosWmi.GetServicesEquipoComputo(formData)
    // <p>Tipo:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.type}</span></p>
    //<p>Inicio:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.startMode}</span></p>
    let content = ""
    data.forEach(item => {

      content += `
      <div style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px">
        <p>Nombre:<span class="text-white bg-success p-1" style="padding:10px;border-radius:4px"> ${item.name}</span></p>
        <p>Descripción:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px"> ${item.displayName}</span></p> 
        <p>Estado:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.status}</span></p>
      </div>
      <hr>
    `
    })


    Swal.fire({
      html: `
      ${content}
    `,
    });

  })


  DOM.buttons.deleteTempEquipoComputo.addEventListener("click", async () => {
    var formData = new FormData();
    formData.append("ip", state.hostname);

    const data = await comandosWmi.obtenerInfoEquipoComputo(formData)

    const userName = data[0].userName

    if (!userName) {
      Swal.fire({
        icon: "error",
        text: "Pc no tiene usuario iniciado"
      })
      return
    }


    const extractedUser = userName.split('\\')[1]; // Divide la cadena y toma el segundo elemento

    formData.append("user", extractedUser);

    const deleteTemp = await comandosWmi.DeleteTempEquipoComputo(formData)


  });

  DOM.buttons.getProcessEquipoComputo.addEventListener("click", async () => {
    const formData = new FormData()
    formData.append("ip", state.hostname)

    let data = await comandosWmi.GetProcessEquipoComputo(formData)

    let content = "<div class='container-items-process'></div>";
    // Convertir la cadena HTML en un elemento DOM
    let container = document.createElement('div');
    container.innerHTML = content;
    data.forEach(item => {

      container.querySelector(
        ".container-items-process"
      ).innerHTML += `<div class="item" style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px;">
        <p><span class="text-white bg-primary p-1 text-proccess-open" style="padding:10px;border-radius:4px;cursor:pointer"> ${item.name} <i class="fas fa-hand-pointer"></i></span></p>
      </div>
      <hr>`
    });

    showModal(exampleModalCerrarSoftwareEquipoComputo)

    containerListSoftwareAbierto.innerHTML = container.innerHTML

    document.querySelector(".container-items-process").addEventListener("click", async (e) => {
      console.log(e.target)
      if (e.target.closest('.item')) {
        const itemName = e.target.closest('.item').querySelector('span').textContent;

        var dataForm = new FormData()
        dataForm.append("ip", state.hostname)
        dataForm.append("app", itemName.trim())

        Swal.fire({
          title: "¿Estás seguro?",
          text: `¿Quieres cerrar la aplicacion '${itemName.trim()}'?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            showLoading();
            await comandosWmi.cerrarAppWmi(dataForm);
            hideLoading();
          }
        });



      }
    })


  });

  DOM.buttons.getUsuariosEquipoComputo.addEventListener("click", async () => {
    const formData = new FormData()
    formData.append("ip", state.hostname)

    const data = await comandosWmi.GetUsersInfoEquipoComputo(formData)

    let content = ""
    data.forEach(item => {

      content += `
      <div style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px">
        <p>Nombre:<span class="text-white bg-success p-1" style="padding:10px;border-radius:4px"> ${item.localPath}</span></p>
        <p>Ultimo uso:<span class="text-white bg-warning p-1" style="padding:10px;border-radius:4px"> ${item.lastUserTime}</span></p> 
        <p>Ultimo uso:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.lastUserTimeFormated}</span></p>
      </div>
      <hr>
    `
    })


    Swal.fire({
      html: `
      ${content}
    `,
    });

  })


  DOM.buttons.registrarImpresoraEquipoComputo.addEventListener("click", async () => {
    showModal(DOM.modals.registrarImpresoraEquipoComputo)
  })


  DOM.forms.registrarImpresoraEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    await gestionPlantas.registrarImpresora(dataForm)

    updateInterfaz()
  })


  DOM.buttons.asignarImpresoraEquipoComputo.addEventListener("click", async () => {
    const impresora = await gestionPlantas.obtenerImpresora();

    document.querySelector("#selectImpresoraEquipoComputo").innerHTML = ``;
    impresora.forEach((item) => {
      document.querySelector("#selectImpresoraEquipoComputo").innerHTML += `
    <option value="${item.id}">${item.modelo}</option>`;
    });

    showModal(DOM.modals.asignarImpresoraEquipoComputo)
  });

  DOM.forms.asignarImpresoraEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    dataForm.append("idEquipoComputo", state.idEquipoComputo)

    await gestionPlantas.asignarImpresoraEquipoComputo(dataForm)

    updateInterfaz()
  });

  DOM.buttons.registrarSoporteEquipoComputo.addEventListener("click", () => {
    showModal(DOM.modals.registrarSoporteEquipoComputo);
  });

  DOM.forms.registrarSoporteEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    dataForm.append("idEquipoComputo", state.idEquipoComputo)

    if (await gestionPlantas.registrarSoporte(dataForm)) e.target.reset()

    // updateInterfaz()

  });

  document.querySelector(".container-soportes-por-hostname").addEventListener("click", async (e) => {
    html2canvas(document.querySelector(".container-soportes-por-hostname")).then(function (canvas) {
      var imgData = canvas.toDataURL('image/png');
      var link = document.createElement('a');
      link.href = imgData;
      link.download = `soportes-de-${state.hostname}.png`;
      link.click();
    })
  });

  document.querySelector(".container-soportes").addEventListener("click", async (e) => {

    if (e.target.tagName === "BUTTON") {
      // Encuentra el elemento <p> con la clase "estado-soporte" en el mismo contenedor del botón
      const estadoSoporte = e.target.closest("td").closest("tr").querySelector(".estado-soporte");
      const idSoporte = e.target.closest("td").closest("tr").querySelector(".id-soporte");
      if (estadoSoporte) {
        state.estadoSoporte = estadoSoporte.textContent.trim()
        state.idSoporte = idSoporte.textContent.trim()

        if (state.estadoSoporte == "Pendiente") {
          state.estadoSoporte = "En proceso"

          let dataForm = new FormData()
          dataForm.append("id", state.idSoporte)
          dataForm.append("estado", state.estadoSoporte)


          Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Quieres actualizar el estado de la actividad?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí",
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isConfirmed) {
              await gestionPlantas.completarSoporte(dataForm)
              await obtenerSoportesHoy()

            }
          });




        } else if (state.estadoSoporte == "En proceso") {
          state.estadoSoporte = "Resuelto"
          showModal("#exampleModalCompletarSoporte")
        }

      }


    } else {
      html2canvas(document.querySelector(".container-soportes")).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png');
        var link = document.createElement('a');
        link.href = imgData;
        link.download = 'soportes.png';
        link.click();
      }).catch(function (error) {
        console.error('Error al capturar el div:', error);
      });
    }
  })


  DOM.buttons.soportesHoy.addEventListener("click", async () => {
    if (await gestionPlantas.obtenerSoportesHoy()) showModal(DOM.modals.soportesHoy)
  })


  DOM.forms.completarSoporte.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    dataForm.append("id", state.idSoporte)
    dataForm.append("estado", state.estadoSoporte)

    if (await gestionPlantas.completarSoporte(dataForm)) {
      e.target.reset()
      await obtenerSoportesHoy()
    }

  });

  DOM.buttons.obtenerSoporteEquipoComputo.addEventListener("click", async (e) => {

    const response = await fetch("/GestionPlantas/ObtenerEquiposComputo?idPlanta=" + localStorage.getItem("plantaSeleccionadaG") || "")

    state.data = await response.json()

    const soportes = obtenerSoportesPorHostname(state.hostname)

    if (soportes.length == 0) {
      Swal.fire({
        icon: "error",
        text: "No se encontraron soportes",
      })
      return false
    }

    gestionPlantas.SoportesPorHostname({
      soportes: soportes
    })

    showModal(DOM.modals.obtenerSoporteEquipoComputo)
  });

  DOM.buttons.accionesGenerales.addEventListener("click", () => {
    showModal(DOM.modals.accionesGenerales)
  });

  DOM.buttons.estadisticasSoportes.addEventListener("click", async () => {
    await pintarGraficasEstadisticasDeSoportes()
    showModal(DOM.modals.estadisticasSoportes)
  });

  btnBuscarEstadisticasSoportesPorMes.addEventListener("click", () => pintarGraficasEstadisticasDeSoportes(inputMesEstadisticasSoportes.value.trim()))


  DOM.buttons.accionesDispositivoTemporal.addEventListener("click", () => {
    showModal(DOM.modals.accionesDispositivoTemporal)
  });

  DOM.forms.dispositivoTemporal.addEventListener("submit", async (e) => {
    e.preventDefault()
    const dataForm = new FormData(e.target)

    state.hostname = dataForm.get("inputHostnameTemporal")

    document.querySelector(
      "#exampleModalAccionesLabel"
    ).textContent = `Acciones para ${state.hostname}`;

    //VERIFICAR LA CONEXION DE HOST
    const testConection = await comandosWmi.ping(state.hostname)

    if (testConection.estatus == "ok") {
      document.querySelector(".test-conection").classList.add("bg-success")
      document.querySelector(".test-conection").classList.remove("bg-danger")
      document.querySelector(".test-conection p").innerHTML = `<i class="fas fa-check-circle"></i> Conectado`;
    } else {
      document.querySelector(".test-conection").classList.add("bg-danger")
      document.querySelector(".test-conection").classList.remove("bg-success")
      document.querySelector(".test-conection p").innerHTML = `<i class="fas fa-times-circle"></i> Desconectado`;
    }

    showModal(DOM.modals.accionesRegistro);
    e.target.reset()
  });

  btnObtenerSerialNumber.addEventListener("click", async () => {

    const formData = new FormData()
    formData.append("ip", state.hostname)

    const data = await comandosWmi.GetBiosSerialNumber(formData)

    console.log(data)

    await Swal.fire({
      title: "Enter your Serial Number",
      input: "text",
      inputLabel: "Your Serial Number",
      inputValue: data.serialNumber,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(`Your Serial Number is ${result.value}`);
      }
    });


  })


  // Inicializar después de un breve retraso
  //setTimeout(initDataTable, 100);
  initDataTable();


}); // ! FINN EVENTO ONLOAD



const pintarGraficasEstadisticasDeSoportes = async (mesSelected = "") => {
  const dataF = new FormData()


  if (mesSelected) {
    dataF.append("mes", mesSelected)
  } else {
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');

    const fechaFormateada = `${anio}-${mes}`;
    dataF.append("mes", fechaFormateada)
  }

  const data = await gestionPlantas.obtenerTopSoportes(dataF)

  const ctx = document.getElementById('chartTopSoportes').getContext('2d');
  const ctxSemanas = document.getElementById('chartSemanasSoportes').getContext('2d');

  if (myChart) {
    myChart.destroy();
  }
  if (chartSemanasSoportes) {
    chartSemanasSoportes.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(item => `${item.estacion} (${item.linea === 'NO APLICA MCH3' ? 'N/A' : item.linea})`),
      datasets: [{
        label: 'Top 10 de Soportes por Ubicación/Estación',
        type: 'bar',
        data: data.map(item => item.total),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 5,
        datalabels: {
          formatter: (value) => value,
          font: {
            size: '0',
          },
        }
      }, {
        label: 'Total',
        type: 'line',
        data: data.map(item => item.total),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 15,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 16,
        datalabels: {
          formatter: (value) => value,
          color: 'white',
          font: {
            weight: 'bold',
            size: '20',
          },
          offset: 4
        }

      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        datalabels: {
          display: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });

  const estatisticasSemanas = await gestionPlantas.obtenerSoportesSemana(dataF)

  chartSemanasSoportes = new Chart(ctxSemanas, {
    type: 'bar',
    data: {
      labels: estatisticasSemanas.map(item => `${item.semana}`),
      datasets: [{
        label: 'Total de Soportes por Semana',
        data: estatisticasSemanas.map(item => item.total),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 5,
        datalabels: {
          formatter: (value) => value,
          font: {
            size: '0',
          },
        }
      }, {
        label: 'Total',
        type: 'line',
        data: estatisticasSemanas.map(item => item.total),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 15,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 16,
        datalabels: {
          formatter: (value) => value,
          color: 'white',
          font: {
            weight: 'bold',
            size: '20',
          },
          offset: 4
        }

      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        datalabels: {
          display: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });




document.querySelector('.selected-option').addEventListener('click', () => {
  const optionsContainer = document.getElementById('options');
  const selectedOption = document.getElementById('selectedOption');

  optionsContainer.style.display = optionsContainer.style.display === 'grid' ? 'none' : 'grid';

  if (optionsContainer.style.display === 'grid') {
    selectedOption.querySelector('i:nth-last-of-type(2)').style.display = 'inline';
    selectedOption.querySelector('i:nth-last-of-type(1)').style.display = 'none';
  } else {
    selectedOption.querySelector('i:nth-last-of-type(2)').style.display = 'none';
    selectedOption.querySelector('i:nth-last-of-type(1)').style.display = 'inline';
  }
});

document.querySelector("#options").addEventListener("click", (e) => {
  if (e.target.classList.contains("option")) {
    const selectedOption = document.getElementById("selectedOption");
    const hiddenInput = document.getElementById("customSelect");

    selectedOption.firstChild.textContent = e.target.textContent;

    selectedOption.querySelector("i").style.display = "inline";

    selectedOption.querySelector("i:nth-last-of-type(1)").style.display =
      "none";
    selectedOption.querySelector("i:nth-last-of-type(2)").style.display =
      "none";

    hiddenInput.value = e.target.getAttribute("data-value");
  }
});
}
const updateInterfaz = async () => {
  const dataForm = new FormData()
  dataForm.append("idPlanta", localStorage.getItem("plantaSeleccionadaG") || "")

  state.data = await gestionPlantas.obtenerEquiposComputo(dataForm);

  $("#equiposTable").DataTable({
    language: {
      url: "../lib/datatables/traslate/es/es-ES.json",
    },
    columnDefs: [
      {
        targets: 0,
        visible: true,
      },
    ],
    dom: "Bfrtip",
    buttons: [
      {
        extend: "excelHtml5",
        text: "Exportar Excel",
        filename: "Reporte Empleados",
        title: "",
        exportOptions: {
          columns: [1, 2, 3, 4, 5],
        },
        className: "btn-exportar-excel",
      },
      {
        extend: "pdfHtml5",
        text: "Exportar PDF",
        filename: "Reporte de equipo de",
        title: "",
        exportOptions: {
          columns: [1, 2, 3, 4, 5],
        },
        className: "btn-exportar-pdf",
      },
      {
        extend: "print",
        title: "",
        exportOptions: {
          columns: [1, 2, 3, 4, 5],
        },
        className: "btn-exportar-print",
      },
      "pageLength",
    ],
  });
}


function obtenerSoftwarePorHostname(hostname) {
  const equipo = state.data.find((equipo) => equipo.hostname === hostname);

  if (!equipo) {
    return [];
  }

  return equipo.equiposComputoSoftware.map(
    (softwareData) => softwareData.software.nombre
  );
}

function obtenerSoportesPorHostname(hostname) {
  const equipo = state.data.find((equipo) => equipo.hostname === hostname);

  if (!equipo) {
    return [];
  }

  return equipo.soportes.map(
    (soporte) => soporte
  );
}

function buscarSoftware(termino) {
  const resultados = [];

  equipos.forEach((equipo) => {
    const nombresSoftware = equipo.equiposComputoSoftware.map(
      (s) => s.software.nombre
    );

    if (
      nombresSoftware.some((nombre) =>
        nombre.toLowerCase().includes(termino.toLowerCase())
      )
    ) {
      resultados.push({
        hostname: equipo.hostname,
        software: nombresSoftware,
      });
    }
  });

  return resultados;
}

const initAccionesEquipoSoftware = async (target) => {
  state.hostname =
    target.parentNode.parentNode.querySelector("#hostname").textContent;
  state.idEquipoComputo =
    target.parentNode.parentNode.querySelector("#idEquipo").textContent;

  document.querySelector(
    "#exampleModalAccionesLabel"
  ).textContent = `Acciones para ${state.hostname}`;

  const testConection = await comandosWmi.ping(state.hostname)

  if (testConection.estatus == "ok") {
    document.querySelector(".test-conection").classList.add("bg-success")
    document.querySelector(".test-conection").classList.remove("bg-danger")
    document.querySelector(".test-conection p").innerHTML = `<i class="fas fa-check-circle"></i> Conectado`;
  } else {
    document.querySelector(".test-conection").classList.add("bg-danger")
    document.querySelector(".test-conection").classList.remove("bg-success")
    document.querySelector(".test-conection p").innerHTML = `<i class="fas fa-times-circle"></i> Desconectado`;
  }

  showModal(DOM.modals.accionesRegistro);
}
