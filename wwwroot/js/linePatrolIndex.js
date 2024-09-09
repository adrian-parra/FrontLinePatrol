let id = null;
let personaLibera = null;

export const $ = (selector) => document.querySelector(selector);

/* -------------------------------
  OBTENER RECORRIDOS DE LINEAS
  ------------------------------- */
export const obtenerDatosLinePatrol = async () => {
  $(".container-loading").style = "display:flex;";

  const response1 = await fetch("/LinePatrol/Filter", {
    method: "POST",
    body: null,
  });

  const data1 = await response1.text();

  $(".container-items").innerHTML = data1;
  $(".container-loading").style = "display:none;";
};

/* ------------------------------------
  EVENTO CLICK EN CONTENEDOR DONDE SE ENCUENTRA LA TABLA 
  PARA DETECTAR EVENTO CLICK EN MULTIPLES ELEMENTOS COMO:
  1.- IMAGEN SELECCIONADA => PARA PREVIEW DE DICHA IMAGEN.
  2.- BTN BUTTON LIBERACIÓN => PARA MOSTRAR INFORMACIÓN DE LIBERACIÓN DEL RECORRIDO.
  3.- P DE COMENTARIO => PARA EXPANDER COMENTARIO.
  4.- BTN BUTTON LIBERAR RECORRIDO => ABRIR MODAL CON FORM PARA PODER LIBERAR EL RECORRIDO
  -------------------------------------*/
export const contenedorDatos = (e) => {
  let tagNameClick = e.target.tagName.toLowerCase();
  let idClick = e.target.id;

  // ? CARGAR IMAGEN EN MODAL PARA PREVIEW
  if (tagNameClick === "img") {
    $("#imagenSeleccionada").src = e.target.src;
    // Mostrar el modal
    const modal = new bootstrap.Modal($("#exampleModal"));
    modal.toggle();
  }

  if (idClick == "btnInfoLiberarP" && tagNameClick === "button") {
    $("#imagenAfterLiberacion").src = e.target.getAttribute("name");

    var siguienteEl = e.target.nextElementSibling;
    personaLibera = siguienteEl.textContent;

    $("#personaLibero").value = e.target.nextElementSibling.textContent;
    $("#fechaLiberacionIn").value = siguienteEl.nextElementSibling.textContent;
    const modal = new bootstrap.Modal($("#exampleModalInfoLiberacion"));
    modal.toggle();
  }

  // ? MOSTRAR COMETARIO COMPLETO
  if (tagNameClick === "p" && e.target.classList.contains("card-text-small")) {
    e.target.classList.toggle("show");
  }

  // ? MOSTRAR MODAL FORM PARA LIBERAR PATRULLAJE
  if (idClick == "btnLiberarP" && tagNameClick === "button") {
    id = e.target.getAttribute("name");
    const modal = new bootstrap.Modal($("#exampleModalLiberar"));
    modal.toggle();
  }
};

/* --------------------------------
  FUNCTION PARA APLICAR FILTRADO DE RECORRIDOS POR LINEA,ESTACION,PLANTA ETC
  --------------------------------- */
export const submitFiltrarDatosLinePatrol = async (e) => {
  e.preventDefault();
  $(".container-loading").style = "display:flex;";
  var formData = new FormData(e.target);

  const response = await fetch("/LinePatrol/Filter", {
    method: "POST",
    body: formData,
  });

  const data = await response.text();

  $(".container-items").innerHTML = data;

  $(".container-loading").style = "display:none;";
};

/* -------------------------------------
  FUNTION PARA LIBERAR EL RECORRIDO
  -------------------------------------- */
export const liberarLinePatrol = async (e) => {
  e.preventDefault();
  var formData = new FormData(e.target);

  if (formData.get("contra") !== "1234") {
    Swal.fire({
      text: "Password para liberar incorrecta",
      icon: "error",
    });
    return false;
  }

  formData.append("id", id);

  formData.delete("contra");
  $(".container-loading").style = "display:flex;";
  const response = await fetch(`/LinePatrol/Liberar`, {
    method: "PATCH",
    body: formData,
  });

  if (response.ok) {
    $(".container-loading").style = "display:none;";

    Swal.fire({
      position: "center",
      icon: "success",
      text: "Recorrido liberado",
      showConfirmButton: false,
      timer: 1500,
    });

    e.target.reset();

    $(
      "#exampleModalLiberar .modal-dialog .modal-content .modal-header .btn-close"
    ).click();

    const response1 = await fetch("/LinePatrol/Filter", {
      method: "POST",
      body: null,
    });

    const data1 = await response1.text();

    $(".container-items").innerHTML = data1;
  } else {
    Swal.fire({
      text: "Imagen no cargada",
      icon: "error",
    });
    $(".container-loading").style = "display:none;";
  }
};

// -------------------------------------------------
/* ! SECCION PARA LOGICA DE GUARDADO DE RECORRIDO */
// -------------------------------------------------

export const changeInputFile = async (e) => {
  const file = e.target.files[0];
  $("#linkInfoImagenSelected").style.display = "none";
  if (file) {
    $("#linkInfoImagenSelected").style.display = "flex";
    const imageURL = URL.createObjectURL(file);
    $("#imagenSeleccionada").src = imageURL;
    const modal = new bootstrap.Modal($("#exampleModal"));
    modal.show();
  }
};

export const formSubmitHandler = async (e) => {
  e.preventDefault(); // CANCELA LA ACTUALIZACIÓN DE LA PAGINA

  var formData = new FormData(e.target);

  // ! VALIDACION DE FORMULARIO
  let errores = []; // Array para acumular errores

  const iconError = `<i class="fas fa-exclamation-triangle" style="color: #F27474; font-size: 24px;" aria-hidden="true"></i> `;

  if (formData.get("id_planta") === "" || formData.get("id_planta") == null) {
    errores.push(
      iconError + "El campo <span> planta </span> no puede estar vacío."
    );
  }
  if (formData.get("id_linea") === "" || formData.get("id_linea") == null) {
    errores.push(
      iconError + "El campo <span> linea </span> no puede estar vacío."
    );
  }
  if (formData.get("imagen").size === 0 || null) {
    errores.push(
      iconError + "El campo <span> imagen </span> no puede estar vacío."
    );
  }
  if (
    formData.get("id_estacion") === "" ||
    formData.get("id_estacion") == null
  ) {
    errores.push(
      iconError + "El campo <span> estacion </span> no puede estar vacío."
    );
  }
  if (formData.get("comentario") === "") {
    errores.push(
      iconError + "El campo <span> comentario </span> no puede estar vacío."
    );
  }

  if (formData.get("responsable") === "") {
    errores.push(
      iconError + "El campo <span> responsable </span> no puede estar vacío."
    );
  }

  if (errores.length > 0) {
    swal.fire({
      html: errores.join("<br>"), // Unir errores en un solo mensaje
      icon: "error",
      button: "Aceptar",
    });

    return false;
  }

  console.log(formData.get("responsable"));

  try {
    $(".container-loading").style = "display:flex;"; // MUESTRA LOADING DE CARGA MIENTRAS GUARDA LOS DATOS
    const response = await fetch("/LinePatrol/GuardarCambios", {
      method: "POST",
      body: formData,
    });
    // SALIO BIEN (RESPUESTA POR EL SERVER OK)
    if (response.ok) {
      const data = await response.text();
      $(".container-loading").style = "display:none;";

      Swal.fire({
        position: "center",
        icon: "success",
        text: "Recorrido registrado",
        showConfirmButton: false,
        timer: 1500,
      });

      const response1 = await fetch("/LinePatrol/Filter", {
        method: "POST",
        body: null,
      });

      const data1 = await response1.text();

      $(".container-items").innerHTML = data1;

      // e.target.reset();

      $("#floatingTextarea2").value = "";
      $("#formFileSm").value = "";
      $("#selectEstacion").selectedIndex = 0;
      $("#linkInfoImagenSelected").style.display = "none";
    } else {
      // RESPUESTA DEL SERVER ERROR

      const errorMessage = await response.text();
      Swal.fire({
        text: errorMessage,
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    $(".container-loading").style = "display:none"; // OCULTA EL LOADING DE CARGA
  }
};

/* EVENTO SCROLL */
 // Seleccionamos el menú flotante
 const floatingMenu = $('.loal-container-button-flotante-planta');

 // Guardamos la posición anterior del scroll
  let lastScrollTop = 0;
export const showAndHideButtonFlotantePlantaRecorrido = ()=>{
 
const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  // Si el scroll baja, ocultamos el menú
  if (currentScroll > lastScrollTop) {
    floatingMenu.classList.add('loal-hidden');
  } else {
    // Si el scroll sube, mostramos el menú
    floatingMenu.classList.remove('loal-hidden');
  }

  // Actualizamos la 
}
export const confirmarPlantaRecorrido = ()=>{
  const plantaSeleccionada = $("#selectPlanta").value;
    if (plantaSeleccionada) {
      localStorage.setItem("plantaSeleccionada", plantaSeleccionada);
      $(".loal-button-flotante-planta").textContent = `Planta ${plantaSeleccionada}`
      $("#selectPlanta").value = plantaSeleccionada
      $("#exampleModalPlantaRecorrido .btn-close").click();
      // obtenerDatosLinePatrol();
      obtenerRecorridosPorPlanta({id_planta:plantaSeleccionada})

    } else {
      Swal.fire({
        icon:"error",
        text:"Por favor, selecciona una planta."
      })
    }
}

export const obtenerRecorridosPorPlanta = async ({id_planta})=>{
  $(".container-loading").style = "display:flex;";
  var formData = new FormData();


  formData.append("id_planta", id_planta);


  const response = await fetch("/LinePatrol/Filter", {
    method: "POST",
    body: formData,
  });

  const data = await response.text();

  $(".container-items").innerHTML = data;

  $(".container-loading").style = "display:none;";
}