import {
  obtenerEquiposComputo,
  registrarEquipoComputo,
  obtenerSoftware,
  asignarSoftwareEquipoComputo,
} from "./gestionPlantasIndex.js";
import { restartDeviceWmi, cerrarAppWmi } from "./cmdIndex.js";
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

let hostnameGlobal; // SE ASIGNA VALOR CUANDO USUARIO DA CLICK EN ACCIONES DE EQUIPO DE COMPUTO
let idEquipoComputoGlobal; // SE ASIGNA VALOR CUANDO USUARIO DA CLICK EN ACCIONES DE EQUIPO DE COMPUTO
let dataGlobal; // SE ASIGNA VALOR CUANDO CARGA LA PAGINA POR COMPLETO

document.addEventListener("DOMContentLoaded", async () => {
  dataGlobal = await obtenerEquiposComputo();

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

  

  $containerItems.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.id === "btnAcciones") {
      initAccionesEquipoSoftware(target)
    }

    if (target.tagName === 'TD') {
      // initAccionesEquipoSoftware(target)
    }

    console.log(target)


  });

  $btnRegistrarEquipoComputo.addEventListener("click", () => {
    showModal($modalRegistarEquipoComputo);
  });

  $btnRegistrarOpciones.addEventListener("click", () => {
    showModal($modalRegistrarOpciones);
  });

  $formRegistrarEquipoComputo.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    registrarEquipoComputo(formData);

    e.target.reset();
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
    document.querySelector("#selectSoftware").innerHTML = ``;

    software.forEach((item) => {
      document.querySelector("#selectSoftware").innerHTML += `
      <option value="${item}.exe">${item}</option>`;
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

  });
});
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
const initAccionesEquipoSoftware = (target) => {
  hostnameGlobal =
    target.parentNode.parentNode.querySelector("#hostname").textContent;
  idEquipoComputoGlobal =
    target.parentNode.parentNode.querySelector("#idEquipo").textContent;

  document.querySelector(
    "#exampleModalAccionesLabel"
  ).textContent = `Acciones para ${hostnameGlobal}`;
  showModal($modalExampleModalAccionesRegistro);
}
