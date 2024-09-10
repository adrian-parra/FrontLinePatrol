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

// SELECTORES COMUNES
const $containerLoading = $(".container-loading");
const $containerItems = $(".container-items");
const $modalPlantaRecorrido = $("#exampleModalPlantaRecorrido");
const $modalFiltrar = $("#exampleModalF");
const $modalRegistrarRecorrido = $("#exampleModalFormRegistrarRecorrido");
const $formFileSm = $("#formFileSm");
const $btnChangeInputFileImage = $("#btnChangeInputFileImage");
const $btnFiltrar = $("#btnFiltrar");
const $btnRegistrarLP = $("#btnRegistrarLP");
const $formFiltrado = $("#formFiltrado");
const $formLiberarP = $("#formLiberarP");
const $formLinePatrol = $(".form-line-patrol");
const $btnConfirmarPlanta = $("#BtnconfirmarPlanta");
const $loalContainerButton = $(".loal-container-button-flotante-planta");
const $selectPlanta = $("#selectPlantaRegistroRecorrido");


// FUNCIONES AUXILIARES
const showModal = (modal) => new bootstrap.Modal(modal).show();
const hideLoading = () => $containerLoading.style.display = "none";
const showLoading = () => $containerLoading.style.display = "flex";

// INICIALIZAR EVENTOS Y ESTADO DE LA APLICACIÓN AL CARGAR EL DOCUMENTO
document.addEventListener("DOMContentLoaded", () => {
  const plantaGuardada = localStorage.getItem("plantaSeleccionada");

  if (plantaGuardada) {
    $(".loal-button-flotante-planta").textContent = `Planta ${plantaGuardada}`;
    $("#selectPlanta").value = plantaGuardada;
    $selectPlanta.value = plantaGuardada;
    $selectPlanta.disabled = true
    obtenerRecorridosPorPlanta({ id_planta: plantaGuardada });
  } else {
    showModal($modalPlantaRecorrido);
  }

  $btnConfirmarPlanta.addEventListener("click", confirmarPlantaRecorrido);
  $loalContainerButton.addEventListener("click", () => showModal($modalPlantaRecorrido));
  $containerItems.addEventListener("click", contenedorDatos);
  $btnFiltrar.addEventListener("click", () => showModal($modalFiltrar));
  $btnRegistrarLP.addEventListener("click", () => showModal($modalRegistrarRecorrido));
  $formFiltrado.addEventListener("submit", submitFiltrarDatosLinePatrol);
  $formLiberarP.addEventListener("submit", liberarLinePatrol);
  
  $btnChangeInputFileImage.addEventListener("click", () => $formFileSm.click());
  $formLinePatrol.addEventListener("submit", formSubmitHandler);
  $formFileSm.addEventListener("change", changeInputFile);
  window.addEventListener("scroll", showAndHideButtonFlotantePlantaRecorrido);
});
