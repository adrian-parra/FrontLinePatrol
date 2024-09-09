import {
  $,
  obtenerDatosLinePatrol,
  contenedorDatos,
  submitFiltrarDatosLinePatrol,
  liberarLinePatrol,
} from "/js/linePatrolIndex.js";

document.addEventListener("DOMContentLoaded", obtenerDatosLinePatrol);

$(".container-items").addEventListener("click", contenedorDatos);

$("#btnFiltrar").addEventListener("click", () =>
  new bootstrap.Modal($("#exampleModalF")).show()
);

$("#btnRegistrarLP").addEventListener("click", () =>
  new bootstrap.Modal($("#exampleModalFormRegistrarRecorrido")).show()
);
$("#formFiltrado").addEventListener("submit", submitFiltrarDatosLinePatrol);
$("#formLiberarP").addEventListener("submit", liberarLinePatrol);

import { 
  formSubmitHandler,
  changeInputFile 
} from "/js/linePatrolIndex.js";

// SIMULAR CLICK EN BTN SELECT IMAGE
$("#btnChangeInputFileImage").addEventListener("click", () =>
  $("#formFileSm").click()
);
// PROCESAR DATOS DEL FORM
$(".form-line-patrol").addEventListener("submit", formSubmitHandler);
// AGREGAR UN EVENT PARA EL CAMBIO
$("#formFileSm").addEventListener("change", changeInputFile);
