import {
  $,
  obtenerDatosLinePatrol,
  contenedorDatos,
  submitFiltrarDatosLinePatrol,
  liberarLinePatrol,
  formSubmitHandler,
  changeInputFile,
  showAndHideButtonFlotantePlantaRecorrido,
  confirmarPlantaRecorrido,
  obtenerRecorridosPorPlanta
} from "/js/linePatrolIndex.js";

document.addEventListener("DOMContentLoaded", () => {
  const plantaGuardada = localStorage.getItem("plantaSeleccionada");

  if (plantaGuardada) {
     $(".loal-button-flotante-planta").textContent = `Planta ${plantaGuardada}`
     $("#selectPlanta").value = plantaGuardada
    // obtenerDatosLinePatrol();
    obtenerRecorridosPorPlanta({id_planta:plantaGuardada})
  } else {
    new bootstrap.Modal($("#exampleModalPlantaRecorrido")).show();
  }
  $("#BtnconfirmarPlanta").addEventListener("click", confirmarPlantaRecorrido);

  $(".loal-container-button-flotante-planta").addEventListener("click", () =>
    new bootstrap.Modal($("#exampleModalPlantaRecorrido")).show()
  );
  $(".container-items").addEventListener("click", contenedorDatos);

  $("#btnFiltrar").addEventListener("click", () =>
    new bootstrap.Modal($("#exampleModalF")).show()
  );

  $("#btnRegistrarLP").addEventListener("click", () =>
    new bootstrap.Modal($("#exampleModalFormRegistrarRecorrido")).show()
  );
  $("#formFiltrado").addEventListener("submit", submitFiltrarDatosLinePatrol);
  $("#formLiberarP").addEventListener("submit", liberarLinePatrol);

  // SIMULAR CLICK EN BTN SELECT IMAGE
  $("#btnChangeInputFileImage").addEventListener("click", () =>
    $("#formFileSm").click()
  );
  // PROCESAR DATOS DEL FORM
  $(".form-line-patrol").addEventListener("submit", formSubmitHandler);
  // AGREGAR UN EVENT PARA EL CAMBIO
  $("#formFileSm").addEventListener("change", changeInputFile);

  window.addEventListener("scroll", showAndHideButtonFlotantePlantaRecorrido);
});
