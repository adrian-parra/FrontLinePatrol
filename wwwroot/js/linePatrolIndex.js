let id = null;
let personaLibera = null;

export const $ = (selector) => document.querySelector(selector);

/**
 * OBTENER DATOS DE LINEPATROL Y ACTUALIZAR LA INTERFAZ.
 * 
 * ESTA FUNCIÓN SOLICITA DATOS AL SERVIDOR Y ACTUALIZA EL CONTENIDO DE LA INTERFAZ
 * CON LA RESPUESTA RECIBIDA. MUESTRA UNA ANIMACIÓN DE CARGA MIENTRAS SE REALIZA LA SOLICITUD.
 * 
 * PASOS:
 * 1. MOSTRAR ANIMACIÓN DE CARGA.
 * 2. REALIZAR UNA SOLICITUD POST AL SERVIDOR PARA OBTENER DATOS.
 * 3. ACTUALIZAR EL CONTENIDO DEL ELEMENTO CON CLASE `container-items` CON LOS DATOS RECIBIDOS.
 * 4. OCULTAR LA ANIMACIÓN DE CARGA.
 * 
 * @returns {Promise<void>} - UNA PROMESA QUE SE RESUELVE CUANDO SE COMPLETA LA SOLICITUD.
 */
export const obtenerDatosLinePatrol = async () => {
  // MOSTRAR ANIMACIÓN DE CARGA
  $(".container-loading").style.display = "flex";

  try {
    // REALIZAR UNA SOLICITUD POST AL SERVIDOR
    const response = await fetch("/LinePatrol/Filter", {
      method: "POST",
      body: null, // SIN CUERPO PARA LA SOLICITUD
    });

    if (response.ok) {
      // OBTENER Y ACTUALIZAR INTERFAZ CON LOS DATOS RECIBIDOS
      const data = await response.text();
      $(".container-items").innerHTML = data;
    } else {
      // MANEJAR RESPUESTA DE ERROR DEL SERVIDOR
      Swal.fire({
        text: "Error al obtener los datos.",
        icon: "error",
      });
    }
  } catch (error) {
    // MANEJAR ERRORES DE LA SOLICITUD
    console.error("Error:", error);
    Swal.fire({
      text: "Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo.",
      icon: "error",
    });
  } finally {
    // OCULTAR ANIMACIÓN DE CARGA
    $(".container-loading").style.display = "none";
  }
};


/**
 * MANEJADOR DE EVENTOS PARA INTERACCIÓN CON ELEMENTOS EN EL CONTENEDOR DE DATOS.
 * 
 * ESTA FUNCIÓN MANEJA LOS EVENTOS DE CLIC EN DIVERSOS ELEMENTOS DENTRO DEL CONTENEDOR DE DATOS.
 * REALIZA LAS SIGUIENTES ACCIONES:
 * 1. CARGAR IMAGEN EN UN MODAL PARA PREVISUALIZACIÓN.
 * 2. MOSTRAR INFORMACIÓN DE LIBERACIÓN EN UN MODAL.
 * 3. TOGGLE DE VISIBILIDAD DE COMENTARIOS COMPLETOS.
 * 4. MOSTRAR UN FORMULARIO MODAL PARA LIBERAR PATRULLAJE.
 * 
 * @param {Event} e - EL EVENTO DE CLIC.
 */
export const contenedorDatos = (e) => {
  const tagNameClick = e.target.tagName.toLowerCase();
  const idClick = e.target.id;

  // ? CARGAR IMAGEN EN MODAL PARA PREVISUALIZACIÓN
  if (tagNameClick === "img") {
    $("#imagenSeleccionada").src = e.target.src;
    // CREAR UNA INSTANCIA DEL MODAL Y MOSTRARLO
    new bootstrap.Modal($("#exampleModal")).toggle();
  }

  // ? MOSTRAR INFORMACIÓN DE LIBERACIÓN EN UN MODAL
  if (idClick === "btnInfoLiberarP" && tagNameClick === "button") {
    $("#imagenAfterLiberacion").src = e.target.getAttribute("name");

    // OBTENER INFORMACIÓN DE LIBERACIÓN
    const siguienteEl = e.target.nextElementSibling;
    personaLibera = siguienteEl.textContent;

    // CONFIGURAR VALORES EN EL FORMULARIO DEL MODAL
    $("#personaLibero").value = personaLibera;
    $("#fechaLiberacionIn").value = siguienteEl.nextElementSibling.textContent;

    // CREAR UNA INSTANCIA DEL MODAL Y MOSTRARLO
    new bootstrap.Modal($("#exampleModalInfoLiberacion")).toggle();
  }

  // ? TOGGLE DE VISIBILIDAD DE COMENTARIOS COMPLETOS
  if (tagNameClick === "p" && e.target.classList.contains("card-text-small")) {
    e.target.classList.toggle("show");
  }

  // ? MOSTRAR FORMULARIO MODAL PARA LIBERAR PATRULLAJE
  if (idClick === "btnLiberarP" && tagNameClick === "button") {
    id = e.target.getAttribute("name");
    // CREAR UNA INSTANCIA DEL MODAL Y MOSTRARLO
    new bootstrap.Modal($("#exampleModalLiberar")).toggle();
  }
};

/**
 * MANEJADOR PARA FILTRAR DATOS DE LINEPATROL.
 * 
 * ESTA FUNCIÓN MANEJA EL ENVÍO DE UN FORMULARIO PARA FILTRAR LOS DATOS DE LINEPATROL.
 * MUESTRA UNA ANIMACIÓN DE CARGA DURANTE EL PROCESO Y ACTUALIZA LA INTERFAZ CON
 * LOS RESULTADOS OBTENIDOS DEL SERVIDOR.
 * 
 * PASOS:
 * 1. CANCELAR EL ENVÍO DEL FORMULARIO.
 * 2. MOSTRAR ANIMACIÓN DE CARGA.
 * 3. CREAR UNA INSTANCIA DE `FormData` A PARTIR DEL FORMULARIO.
 * 4. ENVIAR LOS DATOS AL SERVIDOR Y OBTENER LA RESPUESTA.
 * 5. ACTUALIZAR LA INTERFAZ CON LOS DATOS RECIBIDOS.
 * 6. OCULTAR ANIMACIÓN DE CARGA.
 * 
 * @param {Event} e - EL EVENTO DE ENVÍO DEL FORMULARIO.
 */
export const submitFiltrarDatosLinePatrol = async (e) => {
  e.preventDefault(); // CANCELA LA ACCIÓN POR DEFECTO DEL FORMULARIO (RELOADING DE PÁGINA)

  // MOSTRAR ANIMACIÓN DE CARGA
  $(".container-loading").style.display = "flex";

  try {
    // CREAR UNA INSTANCIA DE FormData A PARTIR DEL FORMULARIO
    const formData = new FormData(e.target);

    // ENVIAR LOS DATOS AL SERVIDOR
    const response = await fetch("/LinePatrol/Filter", {
      method: "POST",
      body: formData,
    });

    // OBTENER Y ACTUALIZAR INTERFAZ CON LOS DATOS RECIBIDOS
    if (response.ok) {
      const data = await response.text();
      $(".container-items").innerHTML = data;
    } else {
      Swal.fire({
        text: "Error al obtener los datos.",
        icon: "error",
      });
    }
  } catch (error) {
    // MANEJAR ERRORES DE LA SOLICITUD
    console.error("Error:", error);
    Swal.fire({
      text: "Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo.",
      icon: "error",
    });
  } finally {
    // OCULTAR ANIMACIÓN DE CARGA
    $(".container-loading").style.display = "none";
  }
};


/**
 * MANEJADOR PARA LIBERAR UN RECORRIDO DE LINEPATROL.
 * 
 * ESTA FUNCIÓN MANEJA EL ENVÍO DE UN FORMULARIO PARA LIBERAR UN RECORRIDO, VERIFICA
 * LA CONTRASEÑA, ENVÍA LOS DATOS AL SERVIDOR Y ACTUALIZA LA INTERFAZ DE USUARIO.
 * 
 * PASOS:
 * 1. CANCELAR EL ENVÍO DEL FORMULARIO.
 * 2. VALIDAR LA CONTRASEÑA.
 * 3. CONFIGURAR LOS DATOS DEL FORMULARIO.
 * 4. ENVIAR LOS DATOS AL SERVIDOR.
 * 5. MANEJAR LA RESPUESTA DEL SERVIDOR.
 * 6. ACTUALIZAR LA INTERFAZ DE USUARIO Y LIMPIAR EL FORMULARIO.
 * 
 * @param {Event} e - EL EVENTO DE ENVÍO DEL FORMULARIO.
 */
export const liberarLinePatrol = async (e) => {
  e.preventDefault(); // CANCELA LA ACCIÓN POR DEFECTO DEL FORMULARIO (RELOADING DE PÁGINA)

  const formData = new FormData(e.target);

  // VALIDAR LA CONTRASEÑA
  if (formData.get("contra") !== "1234") {
    Swal.fire({
      text: "Contraseña para liberar incorrecta",
      icon: "error",
    });
    return;
  }

  // AGREGAR EL ID AL FORMULARIO Y ELIMINAR EL CAMPO DE CONTRASEÑA
  formData.append("id", id);
  formData.delete("contra");

  // MOSTRAR ANIMACIÓN DE CARGA
  $(".container-loading").style.display = "flex";

  try {
    // ENVIAR LOS DATOS AL SERVIDOR
    const response = await fetch(`/LinePatrol/Liberar`, {
      method: "PATCH",
      body: formData,
    });

    if (response.ok) {
      // MANEJAR RESPUESTA EXITOSA
      Swal.fire({
        position: "center",
        icon: "success",
        text: "Recorrido liberado",
        showConfirmButton: false,
        timer: 1500,
      });

      // LIMPIAR FORMULARIO Y CERRAR MODAL
      e.target.reset();
      $("#exampleModalLiberar .modal-dialog .modal-content .modal-header .btn-close").click();

      // ACTUALIZAR INTERFAZ DE USUARIO
      const plantaGuardada = localStorage.getItem("plantaSeleccionada");
      obtenerRecorridosPorPlanta({ id_planta: plantaGuardada });
     
    } else {
      // MANEJAR RESPUESTA DE ERROR
      Swal.fire({
        text: "Imagen no cargada",
        icon: "error",
      });
    }
  } catch (error) {
    // MANEJAR ERRORES DE LA SOLICITUD
    console.error("Error:", error);
    Swal.fire({
      text: "Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo.",
      icon: "error",
    });
  } finally {
    // OCULTAR ANIMACIÓN DE CARGA
    $(".container-loading").style.display = "none";
  }
};


/**
 * MANEJADOR DE EVENTO PARA CAMBIOS EN EL INPUT DE ARCHIVO.
 * 
 * ESTA FUNCIÓN MANEJA EL CAMBIO EN UN INPUT DE ARCHIVO, CARGA LA IMAGEN SELECCIONADA,
 * MUESTRA UN ENLACE DE INFORMACIÓN Y ABRE UN MODAL CON UNA VISTA PREVIA DE LA IMAGEN.
 * 
 * PASOS:
 * 1. OBTENER EL ARCHIVO SELECCIONADO DEL INPUT.
 * 2. OCULTAR EL ENLACE DE INFORMACIÓN DE IMAGEN SI NO HAY ARCHIVO.
 * 3. SI HAY UN ARCHIVO:
 *    - MOSTRAR EL ENLACE DE INFORMACIÓN DE IMAGEN.
 *    - CREAR UNA URL DE OBJETO PARA LA IMAGEN Y ASIGNARLA AL ELEMENTO DE IMAGEN.
 *    - MOSTRAR EL MODAL CON LA IMAGEN SELECCIONADA.
 * 
 * @param {Event} e - EL EVENTO DE CAMBIO EN EL INPUT DE ARCHIVO.
 */
export const changeInputFile = async (e) => {
  // OBTENER EL ARCHIVO SELECCIONADO DEL INPUT
  const file = e.target.files[0];
  
  // OCULTAR EL ENLACE DE INFORMACIÓN DE IMAGEN
  $("#linkInfoImagenSelected").style.display = "none";
  
  if (file) {
    // MOSTRAR EL ENLACE DE INFORMACIÓN DE IMAGEN
    $("#linkInfoImagenSelected").style.display = "flex";
    
    // CREAR UNA URL DE OBJETO PARA LA IMAGEN Y ASIGNARLA AL ELEMENTO DE IMAGEN
    const imageURL = URL.createObjectURL(file);
    $("#imagenSeleccionada").src = imageURL;
    
    // CREAR UNA INSTANCIA DEL MODAL Y MOSTRARLO
    new bootstrap.Modal($("#exampleModal")).show();
  }
};



/**
 * MANEJADOR DE ENVÍO DE FORMULARIO ASÍNCRONO.
 *
 * ESTA FUNCIÓN SE ENCARGA DE MANEJAR EL ENVÍO DE UN FORMULARIO. REALIZA VALIDACIONES
 * DE LOS CAMPOS DEL FORMULARIO, MUESTRA MENSAJES DE ERROR SI ALGUNOS CAMPOS SON INVÁLIDOS
 * Y, EN CASO DE ÉXITO, ENVIAR LOS DATOS AL SERVIDOR Y ACTUALIZAR LA INTERFAZ DE USUARIO.
 *
 * PASOS:
 * 1. PREVENIR LA ACCIÓN POR DEFECTO DEL FORMULARIO (RELOADING DE PÁGINA).
 * 2. CREAR UNA INSTANCIA DE `FormData` A PARTIR DEL FORMULARIO.
 * 3. VALIDAR LOS CAMPOS DEL FORMULARIO Y ACUMULAR ERRORES EN UN ARRAY.
 * 4. SI SE ENCUENTRAN ERRORES, MOSTRAR UN MENSAJE DE ERROR CON SWEETALERT.
 * 5. SI NO HAY ERRORES, ENVIAR LOS DATOS AL SERVIDOR Y MANEJAR LA RESPUESTA.
 * 6. SI LA SOLICITUD ES EXITOSA, ACTUALIZAR LA INTERFAZ DE USUARIO Y LIMPIAR EL FORMULARIO.
 * 7. SI OCURRE UN ERROR DURANTE EL ENVÍO, MOSTRAR UN MENSAJE DE ERROR.
 *
 * @param {Event} e - El evento de envío del formulario.
 */
export const formSubmitHandler = async (e) => {
  e.preventDefault(); // CANCELA LA ACCIÓN POR DEFECTO DEL FORMULARIO (RELOADING DE PÁGINA)

  // CREAR UNA INSTANCIA DE FormData A PARTIR DEL FORMULARIO
  const formData = new FormData(e.target);

  formData.append("id_planta", localStorage.getItem("plantaSeleccionada"));


  // VALIDACIÓN DE FORMULARIO
  let errores = []; // ARRAY PARA ACUMULAR ERRORES

  const iconError = `<i class="fas fa-exclamation-triangle" style="color: #F27474; font-size: 24px;" aria-hidden="true"></i> `;

  // VALIDAR CAMPOS DEL FORMULARIO
  if (!formData.get("id_planta")) {
    errores.push(
      iconError + "El campo <span> planta </span> no puede estar vacío."
    );
  }
  if (!formData.get("id_linea")) {
    errores.push(
      iconError + "El campo <span> linea </span> no puede estar vacío."
    );
  }
  if (formData.get("imagen").size === 0) {
    errores.push(
      iconError + "El campo <span> imagen </span> no puede estar vacío."
    );
  }
  if (!formData.get("id_estacion")) {
    errores.push(
      iconError + "El campo <span> estacion </span> no puede estar vacío."
    );
  }
  if (!formData.get("comentario")) {
    errores.push(
      iconError + "El campo <span> comentario </span> no puede estar vacío."
    );
  }
  if (!formData.get("responsable")) {
    errores.push(
      iconError + "El campo <span> responsable </span> no puede estar vacío."
    );
  }

  // SI HAY ERRORES, MOSTRAR MENSAJE DE ERROR Y DETENER LA EJECUCIÓN
  if (errores.length > 0) {
    Swal.fire({
      html: errores.join("<br>"), // UNIR ERRORES EN UN SOLO MENSAJE
      icon: "error",
      confirmButtonText: "Aceptar",
    });
    return false;
  }

  try {
    // MOSTRAR ANIMACIÓN DE CARGA MIENTRAS SE ENVIAN LOS DATOS
    $(".container-loading").style.display = "flex";

    // ENVIAR DATOS AL SERVIDOR
    const response = await fetch("/LinePatrol/GuardarCambios", {
      method: "POST",
      body: formData,
    });

    // MANEJAR RESPUESTA DEL SERVIDOR
    if (response.ok) {
      const data = await response.text();
      $(".container-loading").style.display = "none";

      // MOSTRAR MENSAJE DE ÉXITO
      Swal.fire({
        position: "center",
        icon: "success",
        text: "Recorrido registrado",
        showConfirmButton: false,
        timer: 1500,
      });

      // ACTUALIZAR INTERFAZ DE USUARIO CON NUEVOS DATOS
      const plantaGuardada = localStorage.getItem("plantaSeleccionada");
      obtenerRecorridosPorPlanta({ id_planta: plantaGuardada })

      // LIMPIAR CAMPOS DEL FORMULARIO
      $("#floatingTextarea2").value = "";
      $("#formFileSm").value = "";
      $("#selectEstacion").selectedIndex = 0;
      $("#linkInfoImagenSelected").style.display = "none";
    } else {
      // MANEJAR ERRORES DEL SERVIDOR
      const errorMessage = await response.text();
      Swal.fire({
        text: errorMessage,
        icon: "error",
      });
    }
  } catch (error) {
    // MANEJAR ERRORES DE LA SOLICITUD
    console.error("Error:", error);
    Swal.fire({
      text: "Ocurrió un error al procesar el formulario. Por favor, inténtalo de nuevo.",
      icon: "error",
    });
  } finally {
    // OCULTAR ANIMACIÓN DE CARGA
    $(".container-loading").style.display = "none";
  }
};

/**
 * FUNCIÓN PARA MOSTRAR U OCULTAR EL MENÚ FLOTANTE DEPENDIENDO DE LA DIRECCIÓN DEL SCROLL.
 *
 * CUANDO EL USUARIO HACE SCROLL HACIA ABAJO, SE OCULTA EL MENÚ FLOTANTE.
 * CUANDO EL USUARIO HACE SCROLL HACIA ARRIBA, SE MUESTRA EL MENÚ FLOTANTE.
 *
 * PASOS:
 * 1. SE OBTIENE LA POSICIÓN ACTUAL DEL SCROLL.
 * 2. SI LA POSICIÓN ACTUAL DEL SCROLL ES MAYOR QUE LA ANTERIOR (SCROLL HACIA ABAJO), SE OCULTA EL MENÚ.
 * 3. SI LA POSICIÓN ACTUAL DEL SCROLL ES MENOR QUE LA ANTERIOR (SCROLL HACIA ARRIBA), SE MUESTRA EL MENÚ.
 * 4. SE ACTUALIZA LA POSICIÓN DEL SCROLL PARA LA SIGUIENTE ITERACIÓN.
 */

// SELECCIONAR EL MENÚ FLOTANTE
const floatingMenu = $(".loal-container-button-flotante-planta");

// GUARDAR LA POSICIÓN ANTERIOR DEL SCROLL
let lastScrollTop = 0;

export const showAndHideButtonFlotantePlantaRecorrido = () => {
  // OBTENER LA POSICIÓN ACTUAL DEL SCROLL
  const currentScroll =
    window.pageYOffset || document.documentElement.scrollTop;

  // SI EL SCROLL ESTÁ BAJANDO, OCULTAR EL MENÚ
  if (currentScroll > lastScrollTop) {
    floatingMenu.classList.add("loal-hidden");
  } else {
    // SI EL SCROLL ESTÁ SUBIENDO, MOSTRAR EL MENÚ
    floatingMenu.classList.remove("loal-hidden");
  }

  // ACTUALIZAR LA POSICIÓN DEL SCROLL PARA LA SIGUIENTE COMPROBACIÓN
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // EVITAR VALORES NEGATIVOS DEL SCROLL
};

/**
 * FUNCIÓN PARA CONFIRMAR LA PLANTA SELECCIONADA Y OBTENER LOS RECORRIDOS CORRESPONDIENTES.
 *
 * ESTA FUNCIÓN SE UTILIZA CUANDO EL USUARIO SELECCIONA UNA PLANTA EN LA INTERFAZ. EL PROCESO
 * IMPLICA CONFIRMAR LA SELECCIÓN, ALMACENARLA LOCALMENTE Y ACTUALIZAR LA INFORMACIÓN
 * EN LA PÁGINA. SI EL USUARIO NO HA SELECCIONADO UNA PLANTA, SE MOSTRARÁ UNA ALERTA.
 *
 * PASOS:
 * 1. SE OBTIENE LA PLANTA SELECCIONADA DESDE UN ELEMENTO `<select>` EN LA INTERFAZ.
 * 2. SI EL USUARIO SELECCIONÓ UNA PLANTA, ESTA SE ALMACENA EN `localStorage` PARA USO FUTURO.
 * 3. SE ACTUALIZA EL TEXTO DEL BOTÓN FLOTANTE PARA REFLEJAR LA PLANTA SELECCIONADA.
 * 4. SE MANTIENE LA PLANTA SELECCIONADA EN EL SELECTOR (EN CASO DE QUE EL MODAL SE ABRA DE NUEVO).
 * 5. SE LLAMA A LA FUNCIÓN `obtenerRecorridosPorPlanta` PASANDO EL `id_planta` PARA OBTENER LOS DATOS.
 * 6. SE CIERRA EL MODAL UNA VEZ FINALIZADA LA ACCIÓN.
 * 7. SI NO SE SELECCIONA NINGUNA PLANTA, SE MUESTRA UNA ALERTA UTILIZANDO SWEETALERT.
 *
 * @throws {Error} Si no se selecciona una planta, se muestra una alerta de error.
 */
export const confirmarPlantaRecorrido = async () => {
  const plantaSeleccionada = $("#selectPlanta").value;

  if (plantaSeleccionada) {
    // ALMACENAR LA PLANTA SELECCIONADA EN LOCALSTORAGE
    localStorage.setItem("plantaSeleccionada", plantaSeleccionada);

    // ACTUALIZAR EL TEXTO DEL BOTÓN FLOTANTE CON LA PLANTA SELECCIONADA
    $(
      ".loal-button-flotante-planta"
    ).textContent = `Planta ${plantaSeleccionada}`;

    // MANTENER LA SELECCIÓN EN EL SELECTOR
    $("#selectPlanta").value = plantaSeleccionada;

    $("#selectPlantaRegistroRecorrido").value = plantaSeleccionada;

    $("#selectPlantaRegistroRecorrido").disabled = true

    // LLAMADA A LA FUNCIÓN PARA OBTENER LOS RECORRIDOS POR PLANTA
    await obtenerRecorridosPorPlanta({ id_planta: plantaSeleccionada });

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

/**
 * FUNCIÓN PARA OBTENER LOS RECORRIDOS SEGÚN LA PLANTA SELECCIONADA.
 *
 * ESTA FUNCIÓN ENVÍA UNA SOLICITUD POST A UN SERVIDOR PARA FILTRAR LOS RECORRIDOS
 * BASADOS EN EL `id_planta`. MUESTRA UNA ANIMACIÓN DE CARGA MIENTRAS SE PROCESA
 * LA SOLICITUD Y ACTUALIZA EL CONTENIDO DE LA PÁGINA CON LOS RESULTADOS OBTENIDOS.
 *
 * PASOS:
 * 1. SE MUESTRA UNA ANIMACIÓN DE CARGA INDICANDO QUE LA SOLICITUD ESTÁ EN PROGRESO.
 * 2. SE CREA UN OBJETO `FormData` Y SE LE AGREGA EL `id_planta` COMO PARÁMETRO.
 * 3. SE REALIZA UNA SOLICITUD POST A LA URL "/LinePatrol/Filter" ENVIANDO EL `id_planta`.
 * 4. SI LA SOLICITUD ES EXITOSA, SE OBTIENE EL RESULTADO COMO TEXTO Y SE ACTUALIZA EL CONTENIDO HTML
 *    DEL ELEMENTO CON LA CLASE `.container-items` CON DICHO RESULTADO.
 * 5. SI OCURRE UN ERROR, SE MUESTRA UNA ALERTA CON UN MENSAJE INFORMATIVO.
 * 6. UNA VEZ FINALIZADA LA SOLICITUD, YA SEA EXITOSA O FALLIDA, SE OCULTA LA ANIMACIÓN DE CARGA.
 *
 * @param {Object} params - El objeto de parámetros que contiene el `id_planta`.
 * @param {string} params.id_planta - El ID de la planta seleccionada que se enviará en la solicitud.
 */
export const obtenerRecorridosPorPlanta = async ({ id_planta }) => {
  try {
    // MOSTRAR ANIMACIÓN DE CARGA
    $(".container-loading").style.display = "flex";

    // CREAR UNA NUEVA INSTANCIA DE FORMDATA Y AÑADIR EL ID DE LA PLANTA
    const formData = new FormData();
    formData.append("id_planta", id_planta);

    // ENVIAR LA SOLICITUD POST UTILIZANDO FETCH Y ESPERAR LA RESPUESTA
    const response = await fetch("/LinePatrol/Filter", {
      method: "POST",
      body: formData,
    });

    // COMPROBAR SI LA RESPUESTA ES EXITOSA
    if (!response.ok) {
      throw new Error("Error en la solicitud. Estado: " + response.status);
    }

    // OBTENER EL TEXTO DE LA RESPUESTA
    const data = await response.text();

    // ACTUALIZAR EL CONTENIDO DEL ELEMENTO CON LOS DATOS RECIBIDOS
    $(".container-items").innerHTML = data;
  } catch (error) {
    // MANEJAR ERRORES DE LA SOLICITUD
    console.error("Ocurrió un error:", error);
    Swal.fire({
      icon: "error",
      text: "Ocurrió un error al obtener los recorridos. Por favor, inténtalo de nuevo.",
    });
  } finally {
    // OCULTAR LA ANIMACIÓN DE CARGA
    $(".container-loading").style.display = "none";
  }
};
