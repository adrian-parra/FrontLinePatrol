import {
  obtenerEquiposComputo,
  registrarEquipoComputo,
  obtenerSoftware,
  asignarSoftwareEquipoComputo,
  obtenerEstaciones,
  obtenerLineas,
  asignarEstacionUbicacionEquipoComputo,
  registrarPlanta,
  registrarEstacion,
  registrarLinea,
  obtenerPlantas,
  registrarSoftware,
  confirmarPlantaRecorrido,
  registrarImpresora,
  obtenerImpresora,
  asignarImpresoraEquipoComputo,
  registrarSoporte,
  obtenerSoportesHoy,
  completarSoporte
} from "./gestionPlantasIndex.js";
import { 
  restartDeviceWmi, 
  cerrarAppWmi,
  ping,
  apagarEquipoComputo,
  obtenerInfoEquipoComputo,
  recorrerCadena,
  obtenerUptimeDevice,
  obtenerSoftwareInstalado,
  DesinstalarSoftwareDeEquipoWmi,
  HistorialActualizacionEquipoComputo,
  PhysicalMemory,
  DiskSpace,
  SistemaOperativo,
  GetServicesEquipoComputo,
  DeleteTempEquipoComputo,
  GetProcessEquipoComputo,
  GetUsersInfoEquipoComputo
} from "./cmdIndex.js";

import { hideLoading, showLoading, showModal } from "./utils.js";

const $containerItems = document.querySelector(".container-items");
const $btnRegistrarOpciones = document.querySelector("#btnRegistrarOpciones");
const $modalRegistrarOpciones = document.querySelector(
  "#exampleModalOpcionesRegistro"
);
const $btnRegistrarEquipoComputo = document.querySelector(
  "#btnRegistrarEquipoComputo"
);
const $modalRegistarEquipoComputo = document.querySelector(
  "#exampleModalRegistrarEquipoComputo"
);
const $formRegistrarEquipoComputo = document.querySelector(
  "#formRegistrarEquipoComputo"
);
const $modalExampleModalAccionesRegistro = document.querySelector(
  "#exampleModalAccionesRegistro"
);
const $btnCerrarApp = document.querySelector("#btnCerrarApp");
const $btnReiniciarEquipo = document.querySelector("#btnReiniciarEquipo");

const $formCerrarSoftware = document.querySelector("#formCerrarSoftware");
const $btnAgregarSoftware = document.querySelector("#btnAgregarSoftware");

const $formAgregarSoftwareEquipoComputo = document.querySelector(
  "#formAgregarSoftwareEquipoComputo"
);

const $formAgregarEstacionEquipoComputo = document.querySelector(
  "#formAgregarEstacionEquipoComputo"
);


const $btnEstacionUbicacion = document.querySelector("#btnAgregarEstacionUbicacion");

const $btnRegistrarPlanta = document.querySelector("#btnRegistrarPlanta");
const $modalRegistrarPlanta = document.querySelector(
  "#exampleModalRegistrarPlanta"
);
const $formRegistrarPlanta = document.querySelector("#formRegistrarPlanta");

const $btnRegistrarEstacion = document.querySelector("#btnRegistrarEstacion");
const $modalRegistrarEstacion = document.querySelector(
  "#exampleModalRegistrarEstacion"
);
const $formRegistrarEstacion = document.querySelector("#formRegistrarEstacion");

const $btnRegistrarLinea = document.querySelector("#btnRegistrarLinea");
const $modalRegistrarLinea = document.querySelector(
  "#exampleModalRegistrarLinea"
);
const $formRegistrarLinea = document.querySelector("#formRegistrarLinea");

const $btnApagarEquipoComputo = document.querySelector("#btnApagarEquipoComputo");

const $btnInformacionEquipoComputo = document.querySelector("#btnInformacionEquipoComputo");

const $btnUptimeEquipoComputo = document.querySelector("#btnUptimeEquipoComputo");

const $btnRegistrarSoftwareEquipoComputo = document.querySelector(
  "#btnRegistrarSoftwareEquipoComputo"
);

const $modalRegistrarSoftwareEquipoComputo = document.querySelector(
  "#exampleModalRegistrarSoftwareEquipoComputo"
);
const $formRegistrarSoftwareEquipoComputo = document.querySelector(
  "#formRegistrarSoftwareEquipoComputo"
);

const $btnDesinstalarSoftwareInstaladoEquipoComputo = document.querySelector(
  "#btnDesinstalarSoftwareInstaladoEquipoComputo"
);

const $modalDesinstalarSoftwareInstaladoEquipoComputo = document.querySelector(
  "#exampleModalDesinstalarSoftwareInstaladoEquipoComputo"
);
const $formDesinstalarSoftwareInstaladoEquipoComputo = document.querySelector(
  "#formDesinstalarSoftwareEquipoComputo"
);

const $btnConfirmarPlanta =  document.querySelector("#BtnconfirmarPlanta");
const $modalPlantaRecorrido =  document.querySelector("#exampleModalPlantaRecorrido")
const $loalContainerButton =  document.querySelector(".loal-container-button-flotante-planta")


const $btnHistorialActualizacionEquipoComputo = document.querySelector("#btnHistorialActualizacionEquipoComputo")

const $btnAlmacenamientoEquipoComputo = document.querySelector("#btnAlmacenamientoEquipoComputo")

const $btnMemoriaFisicaEquipoComputo = document.querySelector("#btnMemoriaFisicaEquipoComputo")

const $btnSistemaOperativoEquipoComputo = document.querySelector("#btnSistemaOperativoEquipoComputo")

const $btnGetServicesEquipoComputo = document.querySelector("#btnGetServicesEquipoComputo")

const $btnDeleteTempEquipoComputo = document.querySelector("#btnDeleteTempEquipoComputo")

const $btnGetProcessEquipoComputo = document.querySelector("#btnGetProcessEquipoComputo")

const $btnGetUsuariosEquipoComputo = document.querySelector("#btnGetUsuariosEquipoComputo")

const $btnRegistrarImpresoraEquipoComputo = document.querySelector("#btnRegistrarImpresoraEquipoComputo")
const $modalRegistrarImpresoraEquipoComputo = document.querySelector("#exampleModalRegistrarImpresoraEquipoComputo")
const $formRegistrarImpresoraEquipoComputo = document.querySelector("#formRegistrarImpresoraEquipoComputo")

const $btnAsignarImpresoraEquipoComputo = document.querySelector("#btnAsignarImpresoraEquipoComputo")
const $modalAsignarImpresoraEquipoComputo = document.querySelector("#exampleModalAsignarImpresoraEquipoComputo")
const $formAsignarImpresoraEquipoComputo = document.querySelector("#formAsignarImpresoraEquipoComputo")

const $btnRegistrarSoporteEquipoComputo = document.querySelector("#btnRegistrarSoporteEquipoComputo");
const $modalRegistrarSoporteEquipoComputo = document.querySelector("#exampleModalRegistrarSoporteEquipoComputo");
const $formRegistrarSoporteEquipoComputo = document.querySelector("#formRegistrarSoporteEquipoComputo");

const $btnSoportesHoy = document.querySelector("#btnSoportesHoy");
const $modalSoportesHoy = document.querySelector("#exampleModalSoportesHoy");
//const $formSoportesHoy = document.querySelector("#formSoportesHoy");
const $formCompletarSoporte = document.querySelector("#formCompletarSoporte");




let hostnameGlobal; // SE ASIGNA VALOR CUANDO USUARIO DA CLICK EN ACCIONES DE EQUIPO DE COMPUTO
let idEquipoComputoGlobal; // SE ASIGNA VALOR CUANDO USUARIO DA CLICK EN ACCIONES DE EQUIPO DE COMPUTO
let dataGlobal; // SE ASIGNA VALOR CUANDO CARGA LA PAGINA POR COMPLETO

let estadoSoporteGlobal;
let idSoporteGlobal

document.addEventListener("DOMContentLoaded", async () => {

  const plantaGuardada = localStorage.getItem("plantaSeleccionadaG");


  if (plantaGuardada) {
    document.querySelector(".loal-button-flotante-planta").textContent = `Planta ${plantaGuardada}`;
    document.querySelector("#selectPlanta").value = plantaGuardada;

    const formData = new FormData()
    formData.append("idPlanta",plantaGuardada)

    dataGlobal = await obtenerEquiposComputo(formData);
  } else {
    showModal($modalPlantaRecorrido);

  }

 
  //dataGlobal = await obtenerEquiposComputo();


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
    //_______________ CUARTO ______________
    dom: "Bfrtip",
    buttons: [
      //'excel',
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
      //'pdf',
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
      //'print'
      {
        extend: "print",
        title: "",
        exportOptions: {
          columns: [1, 2, 3, 4, 5],
        },
        className: "btn-exportar-print",
      },
      //extra
      "pageLength",
    ],
  });

  $btnConfirmarPlanta.addEventListener("click",async ()=>{
    const formData = new FormData()
    formData.append("idPlanta",document.querySelector("#selectPlanta").value)

    await confirmarPlantaRecorrido(formData)

    await updateInterfaz()
  });

  $loalContainerButton.addEventListener("click", () => showModal($modalPlantaRecorrido));

  $containerItems.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.id === "btnAcciones") {

      initAccionesEquipoSoftware(target)
    }

    if (target.tagName === 'TD') {
      // initAccionesEquipoSoftware(target)
    }



  });

  $btnRegistrarEquipoComputo.addEventListener("click", () => {
    showModal($modalRegistarEquipoComputo);
  });

  $btnRegistrarOpciones.addEventListener("click", () => {
    showModal($modalRegistrarOpciones);
  });

  $formRegistrarEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = await registrarEquipoComputo(formData);

    e.target.reset();
    updateInterfaz()
  });

  $btnCerrarApp.addEventListener("click", async () => {
    const dataForm = new FormData();
    dataForm.append("ip", hostnameGlobal);

    const software = obtenerSoftwarePorHostname(hostnameGlobal);
   
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

  $btnReiniciarEquipo.addEventListener("click", async () => {
    const dataForm = new FormData();
    dataForm.append("ip", hostnameGlobal);

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
        // Swal.fire(
        //     'Cerrando!',
        //     'La aplicación se cerrará ahora.',
        //     'success'
        // );
        showLoading();
        restartDeviceWmi(dataForm);
        hideLoading();
      }
    });
  });

  $btnAgregarSoftware.addEventListener("click", async () => {
    const software = await obtenerSoftware();

    document.querySelector("#selectSoftwareEquipoComputo").innerHTML = ``;
    software.forEach((item) => {
      document.querySelector("#selectSoftwareEquipoComputo").innerHTML += `
      <option value="${item.id}">${item.nombre}</option>`;
    });

    showModal("#exampleModalAgregarSoftwareEquipoComputo");
  });

  $formCerrarSoftware.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
   
    if(dataForm.get("app") == ""){
      Swal.fire({
        icon: "error",
        text: "Selecciona una opción",
      })
      return;
    }
    dataForm.append("ip", hostnameGlobal);
    showLoading();
    await cerrarAppWmi(dataForm);
    hideLoading();
  });

  $formAgregarSoftwareEquipoComputo.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dataForm = new FormData(e.target);
    dataForm.append("idEquipoComputo", idEquipoComputoGlobal);

    const data = await asignarSoftwareEquipoComputo(dataForm);

    updateInterfaz()

  });

  $btnEstacionUbicacion.addEventListener("click",async()=>{
    const estaciones = await obtenerEstaciones();

    document.querySelector("#selectEstacionEquipoComputo").innerHTML = ``;

    estaciones.forEach((estacion)=>{
      document.querySelector("#selectEstacionEquipoComputo").innerHTML += `
      <option value="${estacion.id}">${estacion.nombre}</option>`;
    })
    const lineas = await obtenerLineas();

    document.querySelector("#selectLineaEquipoComputo").innerHTML = ``;

    lineas.forEach((linea)=>{
      document.querySelector("#selectLineaEquipoComputo").innerHTML += `
      <option value="${linea.id}">${linea.nombre}</option>`;
    })

   
    showModal("#exampleModalAgregarEstacionEquipoComputo")
  })

  $formAgregarEstacionEquipoComputo.addEventListener("submit",async (e)=>{
    e.preventDefault()
    const dataForm = new FormData(e.target)

    dataForm.append("idEquipo",idEquipoComputoGlobal)

    await asignarEstacionUbicacionEquipoComputo(dataForm)

    updateInterfaz()
  })

  $btnRegistrarPlanta.addEventListener("click",()=>{
    showModal($modalRegistrarPlanta)
  })

  $formRegistrarPlanta.addEventListener("submit",async (e)=>{
    e.preventDefault()
    const dataForm = new FormData(e.target)

    await registrarPlanta(dataForm)
    e.target.reset()

    updateInterfaz()
  })

  $btnRegistrarEstacion.addEventListener("click",()=>{
    showModal($modalRegistrarEstacion)
  })

$formRegistrarEstacion.addEventListener("submit",async (e)=>{
  e.preventDefault()
  const dataForm = new FormData(e.target)

  await registrarEstacion(dataForm)
  e.target.reset()

  updateInterfaz()
})

$btnRegistrarLinea.addEventListener("click",async()=>{

  const plantas = await obtenerPlantas();

  document.querySelector("#selectPlantaEquipoComputo").innerHTML = ``;

  plantas.forEach((planta)=>{
    document.querySelector("#selectPlantaEquipoComputo").innerHTML += `
    <option value="${planta.id}">${planta.nombre}</option>`;
  })


  showModal($modalRegistrarLinea)
})

$formRegistrarLinea.addEventListener("submit",async (e)=>{
  e.preventDefault()
  const dataForm = new FormData(e.target)

  await registrarLinea(dataForm)
  e.target.reset()

  updateInterfaz()
})

$btnApagarEquipoComputo.addEventListener("click",async()=>{
  const dataForm = new FormData();
  dataForm.append("ip", hostnameGlobal);

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
      //showLoading();
      await apagarEquipoComputo(dataForm);
      //hideLoading();
    }
  });
})

$btnInformacionEquipoComputo.addEventListener("click",async()=>{

  var formData = new FormData();
  formData.append("ip", hostnameGlobal);

  const data = await obtenerInfoEquipoComputo(formData)

 // document.querySelector(".respuesta-info-pc").innerHTML = `<pre>${recorrerCadena(data)}</pre>`;

 let htmlContent =  ``
 data.forEach(item =>{
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
 })

  Swal.fire({
    html:`${htmlContent}`
  })
  //showModal("#exampleModalInformacionEquipoComputo")
})

$btnUptimeEquipoComputo.addEventListener("click",async()=>{
  var formData = new FormData();
  formData.append("ip", hostnameGlobal);

  const data = await obtenerUptimeDevice(formData)


  Swal.fire({
    html: `
      <div>
        <p><span>Tiempo de encendido:</span> ${data.tiempoEncendido}</p>
        <p><span>Fecha de encendido:</span> ${data.fechaEncendido}</p>
      </div>
    `,
  })
  //document.querySelector(".respuesta-uptime-pc").innerHTML = `<pre>${data.tiempoEncendido}</pre>`;
  //document.querySelector(".respuesta-fecha-encendido-pc").innerHTML = `<pre>${data.fechaEncendido}</pre>`;
  //showModal("#exampleModalUptimeEquipoComputo")
})


$btnRegistrarSoftwareEquipoComputo.addEventListener("click",()=>{
  showModal($modalRegistrarSoftwareEquipoComputo)
})

$formRegistrarSoftwareEquipoComputo.addEventListener("submit",async (e)=>{
  e.preventDefault()
  const dataForm = new FormData(e.target)

  const data = await registrarSoftware(dataForm)


  e.target.reset()

  await updateInterfaz()

  Swal.fire({
    icon: "success",
    text: data.message,
  });
})

$btnDesinstalarSoftwareInstaladoEquipoComputo.addEventListener("click",async (e)=>{

  const dataForm = new FormData()
  dataForm.append("ip",hostnameGlobal)

  const data = await obtenerSoftwareInstalado(dataForm);


  document.querySelector("#selectListadoSoftwareInstaladoEquipoComputo").innerHTML = ``;
  data.softwareInstalado.forEach((item) => {
    document.querySelector("#selectListadoSoftwareInstaladoEquipoComputo").innerHTML += `
    <option value="${item}">${item}</option>`;
  });

  showModal($modalDesinstalarSoftwareInstaladoEquipoComputo)
})

$formDesinstalarSoftwareInstaladoEquipoComputo.addEventListener("submit",async (e)=>{
  e.preventDefault()
  const dataForm = new FormData(e.target)

  dataForm.append("ip",hostnameGlobal)

  const data = await DesinstalarSoftwareDeEquipoWmi(dataForm)


  e.target.reset()

  await updateInterfaz()

  Swal.fire({
    icon: "success",
    text: data.message,
  });
})

$btnHistorialActualizacionEquipoComputo.addEventListener("click",async ()=>{
  const dataForm = new FormData()
  dataForm.append("ip",hostnameGlobal)

  const data = await HistorialActualizacionEquipoComputo(dataForm)



  let htmlContent = ``
  data.forEach(item =>{
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
  })

  Swal.fire({
    html: `
      <div>
        ${htmlContent}
      </div>
    `,
  })
 
})

$btnAlmacenamientoEquipoComputo.addEventListener("click",async ()=>{
  const formData = new FormData()
  formData.append("ip",hostnameGlobal)

  const data = await DiskSpace(formData)



  let content = ""
  data.forEach(item =>{

    content +=  `
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
  })
 
})

$btnMemoriaFisicaEquipoComputo.addEventListener("click",async ()=>{
  const formData = new FormData()
  formData.append("ip",hostnameGlobal)

  const data = await PhysicalMemory(formData)



  let content = ""
  data.forEach(item =>{

    content +=  `
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
  })
 
})

$btnSistemaOperativoEquipoComputo.addEventListener("click",async ()=>{
  const formData = new FormData()
  formData.append("ip",hostnameGlobal)

  const data = await SistemaOperativo(formData)



  let content = ""
  data.forEach(item =>{
  
    // <p>Build:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.buildNumber}</span></p>
    // <p>Fabricante:<span class="text-white bg-info p-1" style="padding:10px;border-radius:4px"> ${item.manufacturer}</span></p>
    content +=  `
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
  })
 
})  

// document.addEventListener("click", (e) => {
//   // Verifica si el elemento clickeado es un botón con la clase "btn-exportar"
//   if (e.target.classList.contains("btn-exportar")) {
//     // Obtiene el tipo de exportación del atributo "data-export" del botón
//     const exportType = e.target.getAttribute("data-export");

//     // Crea una instancia de la clase DataTable
//     const table = $("#equiposTable").DataTable();

//     // Llama al método de exportación correspondiente según el tipo de exportación
//     if (exportType === "excel") {
//       table.button(0).trigger();
//     } else if (exportType === "pdf") {
//       table.button(1).trigger();
//     } else if (exportType === "print") {
//       table.button(2).trigger();
//     }
//   }
// });

// document.addEventListener("click", (e) => {
//   // Verifica si el elemento clickeado es un botón con la clase "btn-exportar"
//   if (e.target.classList.contains("btn-exportar")) {
//     // Obtiene el tipo de exportación del atributo "data-export" del botón
//     const exportType = e.target.getAttribute("data-export");

//     // Crea una instancia de la clase DataTable
//     const table = $("#equiposTable").DataTable();

//     // Llama al método de exportación correspondiente según el tipo de exportación
//     if (exportType === "excel") {
//       table.button(0).trigger();
//     } else if (exportType === "pdf") {
//       table.button(1).trigger();
//     } else if (exportType === "print") {
//       table.button(2).trigger();
//     }
//   }
// })



$btnGetServicesEquipoComputo.addEventListener("click", async ()=>{
  const formData = new FormData()
  formData.append("ip",hostnameGlobal)

  const data = await GetServicesEquipoComputo(formData)
// <p>Tipo:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.type}</span></p>
//<p>Inicio:<span class="text-white bg-primary p-1" style="padding:10px;border-radius:4px"> ${item.startMode}</span></p>
  let content = ""
  data.forEach(item =>{

    content +=  `
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
  })
 
})


$btnDeleteTempEquipoComputo.addEventListener("click",async ()=>{
  var formData = new FormData();
  formData.append("ip", hostnameGlobal);

  const data = await obtenerInfoEquipoComputo(formData)

  const userName = data[0].userName

  if(!userName){
    Swal.fire({
      icon:"error",
      text:"Pc no tiene usuario iniciado"
    })
    return
  }

  console.log(userName)

  const extractedUser = userName.split('\\')[1]; // Divide la cadena y toma el segundo elemento

  formData.append("user", extractedUser);

  const deleteTemp = await DeleteTempEquipoComputo(formData)

  console.log(deleteTemp)

})

$btnGetProcessEquipoComputo.addEventListener("click",async ()=>{
  const formData = new FormData()
  formData.append("ip",hostnameGlobal)

  const data = await GetProcessEquipoComputo(formData)




  let content = "<div class='container-items-process'></div>";
// Convertir la cadena HTML en un elemento DOM
let container = document.createElement('div');
container.innerHTML = content;
  data.forEach(item =>{

    container.querySelector(
      ".container-items-process"
    ).innerHTML += `<div class="item" style="display:flex;flex-direction:column;justify-content:left;align-items:left;text-align:left;padding:10px;">
        <p><span class="text-white bg-success p-1 text-proccess-open" style="padding:10px;border-radius:4px;cursor:pointer"> ${item.name}</span></p>
      </div>
      <hr>`
  })

  // Usar innerHTML para obtener el contenido HTML del contenedor
Swal.fire({
  html: container.innerHTML, // Cambiar aquí para usar innerHTML
  allowOutsideClick: false,
  preConfirm: () => {
    // Abrir la segunda alerta si se confirma
    // abrirAlerta();
    //return false; // Evita cerrar el modal
}
});

  document.querySelector(".container-items-process").addEventListener("click", async (e)=>{
    console.log(e.target)
        if (e.target.closest('.item')) {
         const itemName = e.target.closest('.item').querySelector('span').textContent;
        console.log(`Se hizo clic en el item: ${itemName}`);


        var dataForm =  new FormData()
        dataForm.append("ip",hostnameGlobal)
        dataForm.append("app",itemName.trim())

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
            // Swal.fire(
            //     'Cerrando!',
            //     'La aplicación se cerrará ahora.',
            //     'success'
            // );
            showLoading();
            await cerrarAppWmi(dataForm);
            hideLoading();
          }
        });

       
        
    }
  })
 
 
})

$btnGetUsuariosEquipoComputo.addEventListener("click",async ()=>{
  const formData = new FormData()
  formData.append("ip",hostnameGlobal)

  const data = await GetUsersInfoEquipoComputo(formData)

  let content = ""
  data.forEach(item =>{

    content +=  `
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
  })
 
})


$btnRegistrarImpresoraEquipoComputo.addEventListener("click",async ()=>{
  showModal($modalRegistrarImpresoraEquipoComputo)
})


$formRegistrarImpresoraEquipoComputo.addEventListener("submit",async (e)=>{
  e.preventDefault()
  const dataForm = new FormData(e.target)

  await registrarImpresora(dataForm)

  updateInterfaz()
})


$btnAsignarImpresoraEquipoComputo.addEventListener("click",async ()=>{
  const impresora = await obtenerImpresora();

  document.querySelector("#selectImpresoraEquipoComputo").innerHTML = ``;
  impresora.forEach((item) => {
    document.querySelector("#selectImpresoraEquipoComputo").innerHTML += `
    <option value="${item.id}">${item.modelo}</option>`;
  });

  showModal($modalAsignarImpresoraEquipoComputo)
})

$formAsignarImpresoraEquipoComputo.addEventListener("submit",async (e)=>{
  e.preventDefault()
  const dataForm = new FormData(e.target)

  dataForm.append("idEquipoComputo",idEquipoComputoGlobal)

  await asignarImpresoraEquipoComputo(dataForm)

  updateInterfaz()
})

$btnRegistrarSoporteEquipoComputo.addEventListener("click",()=>{
  showModal($modalRegistrarSoporteEquipoComputo);
})

$formRegistrarSoporteEquipoComputo.addEventListener("submit",async (e)=>{
  e.preventDefault()
  const dataForm = new FormData(e.target)

  dataForm.append("idEquipoComputo",idEquipoComputoGlobal)

  await registrarSoporte(dataForm)

  updateInterfaz()

})

document.querySelector(".container-soportes").addEventListener("click",async (e)=>{
  console.log(e.target)

  

  if (e.target.tagName === "BUTTON") {
    // Encuentra el elemento <p> con la clase "estado-soporte" en el mismo contenedor del botón
    const estadoSoporte = e.target.closest("td").closest("tr").querySelector(".estado-soporte");
    const idSoporte = e.target.closest("td").closest("tr").querySelector(".id-soporte");
    if (estadoSoporte) {
      estadoSoporteGlobal = estadoSoporte.textContent.trim()
      idSoporteGlobal = idSoporte.textContent.trim()

      if(estadoSoporteGlobal == "Pendiente"){
        estadoSoporteGlobal = "En proceso"

        let dataForm = new FormData()
        dataForm.append("id",idSoporteGlobal)
        dataForm.append("estado",estadoSoporteGlobal)


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
            // Swal.fire(
            //     'Cerrando!',
            //     'La aplicación se cerrará ahora.',
            //     'success'
            // );
            await completarSoporte(dataForm)

          }
        });

       


      }else if(estadoSoporteGlobal == "En proceso"){
         estadoSoporteGlobal = "Resuelto"
        showModal("#exampleModalCompletarSoporte")
      }
     
    }


  }else{
    html2canvas(document.querySelector(".container-soportes")).then(function(canvas) {
      var imgData = canvas.toDataURL('image/png');
      var link = document.createElement('a');
      link.href = imgData;
      link.download = 'soportes.png';
      link.click();
  }).catch(function(error) {
      console.error('Error al capturar el div:', error);
  });
  }
})


$btnSoportesHoy.addEventListener("click",async ()=>{
  const datos = await obtenerSoportesHoy()

  console.log(datos)

  const containerSoportes = document.querySelector(".container-soportes")

  containerSoportes.innerHTML = ``

  // Crear una variable para almacenar el contenido de la tabla
  let tablaHTML = `
  <table class="table">
      <thead>
          <tr>
              <th>Linea</th>
              <th>Estación/Ubicación</th>
              <th>Problema/Descripción</th>
              <th>Responsable</th>
              <th>Solución/Acción</th>
              <th>Estado</th>
              <th>Opción</th>
          </tr>
      </thead>
      <tbody>
  `;

  // Agregar los datos a la tabla
  datos.forEach(item => {
      console.log(item);

      
      tablaHTML += `
          <tr >
              <td style="display:none;" class="id-soporte">${item.id}</td>
              <td><span class="text-primary">${item.equipoComputo.lineas[0].linea.nombre === "NO APLICA MCH3" ? "N/A" : item.equipoComputo.lineas[0].linea.nombre}</span></td>
              <td><span class="text-primary estacion-ubicacion-soporte">${item.equipoComputo.lineas[0].estacion.nombre}</span></td>
              <td><span class="text-primary">${item.descripcion}</span></td>
              <td><span class="text-primary">${item.responsable}</span></td>
              <td><span class="text-primary">${item.solucion}</span></td>
              <td><span class="${getEstadoClass(item.estado)} estado-soporte">${item.estado}</span></td>
              <td>
                  <button style="${item.estado === "Resuelto" ? "display:none;" : ""} width:100px;" class="btn btn-sm ${item.estado === 'Pendiente' ? 'bg-warning' : item.estado === 'En proceso' ? 'bg-success' : 'bg-secondary'}">
                      ${item.estado === "Pendiente" ? 'En proceso' : item.estado === 'En proceso' ? 'Realizar' : 'Pendiente'}
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



  showModal($modalSoportesHoy)

 
})


$formCompletarSoporte.addEventListener("submit",async (e)=>{
  e.preventDefault()
  const dataForm = new FormData(e.target)

  dataForm.append("id",idSoporteGlobal)
  dataForm.append("estado",estadoSoporteGlobal)


  await completarSoporte(dataForm)


})



}); // FINN EVENTO ONLOAD

function getEstadoClass(estado) {
  switch (estado) {
    case 'Pendiente':
      return 'text-danger';
    case 'En proceso':
      return 'text-warning';
    case 'Resuelto':
      return 'text-success';
    default:
      return 'text-secondary'; // Clase por defecto si el estado no coincide
  }
}


const updateInterfaz = async ()=>{
  const dataForm =  new FormData()
  dataForm.append("idPlanta",localStorage.getItem("plantaSeleccionadaG") || "")

  dataGlobal = await obtenerEquiposComputo(dataForm);

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
    //_______________ CUARTO ______________
    dom: "Bfrtip",
    buttons: [
      //'excel',
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
      //'pdf',
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
      //'print'
      {
        extend: "print",
        title: "",
        exportOptions: {
          columns: [1, 2, 3, 4, 5],
        },
        className: "btn-exportar-print",
      },
      //extra
      "pageLength",
    ],
  });
}


function obtenerSoftwarePorHostname(hostname) {
  // Encuentra el equipo con el hostname dado
  const equipo = dataGlobal.find((equipo) => equipo.hostname === hostname);

  // Si no se encuentra el equipo, retorna un array vacío
  if (!equipo) {
    return [];
  }

  // Retorna un array de nombres de software del equipo encontrado
  return equipo.equiposComputoSoftware.map(
    (softwareData) => softwareData.software.nombre
  );
}

function buscarSoftware(termino) {
  const resultados = [];

  // Iterar sobre cada equipo en el array
  equipos.forEach((equipo) => {
    // Obtener los nombres de software del equipo
    const nombresSoftware = equipo.equiposComputoSoftware.map(
      (s) => s.software.nombre
    );

    // Verificar si algún nombre de software coincide con el término de búsqueda
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

/**
 * Inicializa las acciones para el equipo de software.
 * Esta función obtiene el nombre de host y el ID del equipo de cómputo
 * a partir del elemento objetivo del evento, y actualiza el título
 * del modal con el nombre de host. Luego, muestra el modal correspondiente.
 *
 * @function initAccionesEquipoSoftware
 * @returns {void} No retorna ningún valor.
 *
 * @example
 * Supongamos que se llama a esta función al hacer clic en un botón
 * initAccionesEquipoSoftware();
 */
const initAccionesEquipoSoftware = async (target) => {
  hostnameGlobal =
    target.parentNode.parentNode.querySelector("#hostname").textContent;
  idEquipoComputoGlobal =
    target.parentNode.parentNode.querySelector("#idEquipo").textContent;



  document.querySelector(
    "#exampleModalAccionesLabel"
  ).textContent = `Acciones para ${hostnameGlobal}`;

  //VERIFICAR LA CONEXION DE HOST
  const testConection = await ping(hostnameGlobal)

  if(testConection.estatus == "ok"){
    document.querySelector(".test-conection").classList.add("bg-success")
    document.querySelector(".test-conection").classList.remove("bg-danger")
    document.querySelector(".test-conection p").innerHTML = `<i class="fas fa-check-circle"></i> Conectado`;
  }else{
    document.querySelector(".test-conection").classList.add("bg-danger")
    document.querySelector(".test-conection").classList.remove("bg-success")
    document.querySelector(".test-conection p").innerHTML = `<i class="fas fa-times-circle"></i> Desconectado`;
  }


  showModal($modalExampleModalAccionesRegistro);
}




/**
 * Maneja el evento de clic en la opción seleccionada del menú desplegable.
 * 
 * Alterna la visibilidad del contenedor de opciones y actualiza la visualización
 * de los iconos de flecha para indicar si el menú está abierto o cerrado.
 *
 * @listens .selected-option:click
 */
document.querySelector('.selected-option').addEventListener('click', () => {
  const optionsContainer = document.getElementById('options');
  const selectedOption = document.getElementById('selectedOption');

  // Alterna la visibilidad del contenedor de opciones.
  optionsContainer.style.display = optionsContainer.style.display === 'grid' ? 'none' : 'grid';

  // Actualiza la visualización de los iconos de flecha.
  if (optionsContainer.style.display === 'grid') {
    selectedOption.querySelector('i:nth-last-of-type(2)').style.display = 'inline'; // Flecha arriba
    selectedOption.querySelector('i:nth-last-of-type(1)').style.display = 'none';   // Flecha abajo
  } else {
    selectedOption.querySelector('i:nth-last-of-type(2)').style.display = 'none';   // Flecha arriba
    selectedOption.querySelector('i:nth-last-of-type(1)').style.display = 'inline'; // Flecha abajo
  }
});



/**
 * Maneja el evento de clic en el contenedor de opciones de software.
 * 
 * Al hacer clic en una opción de software, actualiza el texto del elemento
 * seleccionado con el nombre del software y establece el valor del campo
 * oculto con el nombre del archivo ejecutable del software.
 *
 * @listens document#options:click
 * @param {Event} e - El objeto del evento.
 */
document.querySelector("#options").addEventListener("click", (e) => {
  // Verifica si el elemento clickeado tiene la clase "option"
  if (e.target.classList.contains("option")) {
    // Obtiene el elemento del texto de la opción seleccionada
    const selectedOption = document.getElementById("selectedOption");
    // Obtiene el campo oculto para almacenar el valor de la opción
    const hiddenInput = document.getElementById("customSelect");

    // Actualiza el texto de la opción seleccionada con el texto de la opción clickeada
    selectedOption.firstChild.textContent = e.target.textContent;

    // Muestra el icono de palomita en la opción seleccionada
    selectedOption.querySelector("i").style.display = "inline";

    // Oculta los iconos de flecha arriba y abajo en la opción seleccionada
    selectedOption.querySelector("i:nth-last-of-type(1)").style.display =
      "none";
    selectedOption.querySelector("i:nth-last-of-type(2)").style.display =
      "none";

    // Establece el valor del campo oculto con el valor del atributo "data-value" de la opción clickeada
    hiddenInput.value = e.target.getAttribute("data-value");
  }
});

