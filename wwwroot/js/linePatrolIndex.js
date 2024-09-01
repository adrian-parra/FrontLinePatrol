import { $ } from "./utils.js";
let id = null;
let personaLibera = null;

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

    var siguienteEl = e.target.nextElementSibling
    personaLibera = siguienteEl.textContent;


    $("#personaLibero").value = e.target.nextElementSibling.textContent;
    $("#fechaLiberacionIn").value = siguienteEl.nextElementSibling.textContent
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
      // title: 'Exito!',
      text: "Patrullaje liberado",
      icon: "success",
    });

    e.target.reset();

    const response1 = await fetch("/LinePatrol/Filter", {
      method: "POST",
      body: null,
    });

    const data1 = await response1.text();

    $(".container-items").innerHTML = data1;

    // const modal = new bootstrap.Modal($("#exampleModalLiberar"));
    // modal.toggle();

  } else {
    Swal.fire({
      // title: 'Error!',
      text: "Imagen no cargada",
      icon: "error",
    });
    // Si deseas obtener más información sobre el error, puedes acceder a response.statusText
    $(".container-loading").style = "display:none;";
  }
};
