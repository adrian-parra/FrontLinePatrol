import { obtenerEquiposComputo ,registrarEquipoComputo } from "./gestionPlantasIndex.js";
import { restartDeviceWmi,cerrarAppWmi } from "./cmdIndex.js";
import { hideLoading, showLoading, showModal } from "./utils.js";

const $containerItems = document.querySelector(".container-items");
const $btnRegistrarOpciones = document.querySelector("#btnRegistrarOpciones");
const $modalRegistrarOpciones = document.querySelector("#exampleModalOpcionesRegistro");
const $btnRegistrarEquipoComputo = document.querySelector("#btnRegistrarEquipoComputo");
const $modalRegistarEquipoComputo = document.querySelector("#exampleModalRegistrarEquipoComputo");
const $formRegistrarEquipoComputo = document.querySelector("#formRegistrarEquipoComputo");
const $modalExampleModalAccionesRegistro = document.querySelector("#exampleModalAccionesRegistro");
const $btnCerrarApp = document.querySelector("#btnCerrarApp");
const $btnReiniciarEquipo = document.querySelector("#btnReiniciarEquipo");

const $formCerrarSoftware = document.querySelector("#formCerrarSoftware");



let hostnameGlobal;
let dataGlobal;




document.addEventListener("DOMContentLoaded", async () => {

  dataGlobal = await obtenerEquiposComputo();

  $("#equiposTable").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json",
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

  $containerItems.addEventListener("click", async (e) => {
    const target = e.target;
    if(target.id === "btnAcciones"){
      hostnameGlobal = target.parentNode.parentNode.querySelector("#hostname").textContent;
      document.querySelector("#exampleModalAccionesLabel").textContent = `Acciones para ${hostnameGlobal}`;
      showModal($modalExampleModalAccionesRegistro)
    }
  });

  $btnRegistrarEquipoComputo.addEventListener("click",() => {
    showModal($modalRegistarEquipoComputo);
  })



  $btnRegistrarOpciones.addEventListener("click", () => {
    showModal($modalRegistrarOpciones);
  });

  $formRegistrarEquipoComputo.addEventListener("submit",(e)=>{
    e.preventDefault()
    const formData = new FormData(e.target)

    registrarEquipoComputo(formData)

    e.target.reset();
  })

  $btnCerrarApp.addEventListener("click",async ()=>{
    const dataForm = new FormData();
    dataForm.append("ip", hostnameGlobal);

    const software = obtenerSoftwarePorHostname(hostnameGlobal);
    
    if(software == "") {
      Swal.fire({
        icon:"error",
        text:"No se encontraron software",
      })
      return;
    }
    document.querySelector("#selectSoftware").innerHTML = ``

    software.forEach(item => {
      document.querySelector("#selectSoftware").innerHTML += `
      <option value="${item}.exe">${item}</option>` 
  });

  showModal("#exampleModalCerrarSoftware")
   
  })

  $btnReiniciarEquipo.addEventListener("click",async ()=>{
    const dataForm = new FormData();
    dataForm.append("ip", hostnameGlobal);

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres reiniciar el equipo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.isConfirmed) {
          // Swal.fire(
          //     'Cerrando!',
          //     'La aplicación se cerrará ahora.',
          //     'success'
          // );
          showLoading()
          restartDeviceWmi(dataForm);
          hideLoading()
      }
  });
    
  })

  $formCerrarSoftware.addEventListener("submit",async (e)=>{
    e.preventDefault()
    const dataForm = new FormData(e.target)
    dataForm.append("ip", hostnameGlobal);
    showLoading()
    await cerrarAppWmi(dataForm)
    hideLoading()
  })



});
function obtenerSoftwarePorHostname(hostname) {
  // Encuentra el equipo con el hostname dado
  const equipo = dataGlobal.find(equipo => equipo.hostname === hostname);

  // Si no se encuentra el equipo, retorna un array vacío
  if (!equipo) {
    return [];
  }

  // Retorna un array de nombres de software del equipo encontrado
  return equipo.equiposComputoSoftware.map(softwareData => softwareData.software.nombre);
}

function buscarSoftware(termino) {
  const resultados = [];

  // Iterar sobre cada equipo en el array
  equipos.forEach(equipo => {
    // Obtener los nombres de software del equipo
    const nombresSoftware = equipo.equiposComputoSoftware.map(s => s.software.nombre);

    // Verificar si algún nombre de software coincide con el término de búsqueda
    if (nombresSoftware.some(nombre => nombre.toLowerCase().includes(termino.toLowerCase()))) {
      resultados.push({
        hostname: equipo.hostname,
        software: nombresSoftware
      });
    }
  });

  return resultados;
}
