import { showLoading, hideLoading, showModal } from "/js/utils.js";
import { obtenerPlantas } from "/js/GestionPlantasIndex.js";

const $selectPlantaReporteGenrador = document.querySelector(
  "#selectPlantaReporteGenrador"
);
const $modalRegistrarReporteGenerador = document.querySelector(
  "#modalRegistrarReporteGenerador"
);
const $btnRegistrarReporteGenerador = document.querySelector(
  "#btnRegistrarReporteGenerador"
);

document.addEventListener("DOMContentLoaded", async () => {
  const reportesGenerador = await obtenerReporteGenerador();
    console.log(reportesGenerador)
  initTable(reportesGenerador)

  const plantas = await obtenerPlantas();

  plantas.forEach((element) => {
    $selectPlantaReporteGenrador.innerHTML += `
         <option value="${element.id}">${element.nombre}</option>
    `;
  });

  $btnRegistrarReporteGenerador.addEventListener("click", async () => {
    showModal($modalRegistrarReporteGenerador);
  });

  document.querySelector(".items-table").addEventListener("click",async (e)=>{
    console.log(e.target)

    if(e.target.tagName == "IMG"){
      console.log(e.target.src)

      document.querySelector("#imagenSeleccionada1").src = e.target.src

      const modal = new bootstrap.Modal($("#exampleModal1"));
      modal.show();

    }
  })
});

//  EVENTO CLICK EN CONTAINER DE FORM
document.querySelector(".loal-container-form").addEventListener("click", (e) => {
  const target = e.target;

  // Mapeamos los botones a sus inputs correspondientes
  const buttonToInputMap = {
    btnChangeInputFileImageHorasTrabajadas: "#inputFileHorasTrabajadas",
    btnChangeInputFileImageStatusBateria: "#inputFileImageStatusBateria",
    btnChangeInputFileImageNivelAnticongelante: "#inputFileNivelAnticongelante",
    btnChangeInputFileImageNivelDiesel: "#inputFileNivelDiesel",
    btnChangeInputFileImageNivelAceite: "#inputFileNivelAceite",
  };

  // Verificamos si el clic fue en un botón que está en el mapeo
  if (target.tagName === "BUTTON" && buttonToInputMap[target.id]) {
    $(buttonToInputMap[target.id]).click(); // Simulamos clic en el input file correspondiente
  }
});

// Objetos para almacenar las URLs de las imágenes seleccionadas
const imageUrls = {};

// Función para manejar el evento change de un input file de manera dinámica
function handleFileInputChange(inputId, linkId, key) {
  document.querySelector(inputId).addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log(file)
    const link = document.querySelector(linkId);

    // Ocultamos el link inicialmente
    link.classList.add("loal-ocultar-o-mostrar");
    // Si hay un archivo seleccionado, guardamos la URL y mostramos el link
    if (file) {
      const imageURL = URL.createObjectURL(file);
      console.log(imageURL)
      document.querySelector("#imagenSeleccionada").src = imageURL;
      const modal = new bootstrap.Modal(document.querySelector("#exampleModal"));
      modal.show();
      imageUrls[key] = imageURL; // Guardamos la URL de la imagen seleccionada
      link.classList.toggle("loal-ocultar-o-mostrar");
    }
  });

  // Evento click en el link para mostrar la imagen seleccionada en el modal
  document.querySelector(linkId).addEventListener("click", (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del enlace

    // Si existe una imagen guardada, la mostramos en el modal
    console.log(imageUrls)
    console.log(key)
    if (imageUrls[key]) {
      console.log("si entra " + imageUrls[key])
      document.querySelector("#imagenSeleccionada").src = imageUrls[key];
      const modal = new bootstrap.Modal($("#exampleModal"));
      modal.show();
    }
  });
}

handleFileInputChange(
  "#inputFileHorasTrabajadas",
  "#linkInfoImagenSelectedHoras",
  "horas"
);
handleFileInputChange(
  "#inputFileImageStatusBateria",
  "#linkInfoImagenSelectedBateria",
  "bateria"
);
handleFileInputChange(
  "#inputFileNivelAnticongelante",
  "#linkInfoImagenSelectedAnticongelante",
  "anticongelante"
);
handleFileInputChange(
  "#inputFileNivelDiesel",
  "#linkInfoImagenSelectedDiesel",
  "diesel"
);
handleFileInputChange(
  "#inputFileNivelAceite",
  "#linkInfoImagenSelectedAceite",
  "aceite"
);

// ... (código para manejar la selección de imágenes) ...

document.querySelector("#formReporteGenerador").addEventListener("submit", async (e) => {
  e.preventDefault();
  var formData = new FormData(e.target);
  console.log(formData.get("reloj"));
  console.log(formData.get("imagen_horas_trabajadas"));
  console.log(formData.get("imagen_status_bateria"));
  console.log(formData.get("imagen_nivel_anticongelante"));
  console.log(formData.get("imagen_nivel_diesel"));
  console.log(formData.get("imagen_nivel_aceite"));
  // Validación de datos
  let errores = [];
  const iconError = `<i class="fas fa-exclamation-triangle" style="color: #F27474; font-size: 24px;" aria-hidden="true"></i> `;

  // Ejemplo de validación para el campo "reloj" (puedes agregar más validaciones)
  if (
    formData.get("responsable") === "" ||
    formData.get("responsable") === null
  ) {
    errores.push(iconError + " El campo 'Responsable' es obligatorio.");
  }
  // Validación de imágenes (asegúrate de que se haya seleccionado una imagen)
  if (formData.get("imagen_horas_trabajadas").size === 0) {
    errores.push(
      iconError + " Debes seleccionar una imagen para 'Horas Trabajadas'."
    );
  }
  if (formData.get("imagen_status_bateria").size === 0) {
    errores.push(
      iconError + " Debes seleccionar una imagen para 'Status de Batería'."
    );
  }
  if (formData.get("imagen_nivel_anticongelante").size === 0) {
    errores.push(
      iconError +
        " Debes seleccionar una imagen para 'Nivel de Anticongelante'."
    );
  }
  if (formData.get("imagen_nivel_diesel").size === 0) {
    errores.push(
      iconError + " Debes seleccionar una imagen para 'Nivel de Diesel'."
    );
  }
  if (formData.get("imagen_nivel_aceite").size === 0) {
    errores.push(
      iconError + " Debes seleccionar una imagen para 'Nivel de Aceite'."
    );
  }
  // ... (otras validaciones) ...

  // Si hay errores, mostrarlos al usuario y detener el envío
  if (errores.length > 0) {
    Swal.fire({
      html: errores.join("<br>"),
      icon: "error",
    });
    return; // Detener el envío del formulario
  }

  // Si no hay errores, enviar los datos al servidor
  try {
    showLoading()

    const response = await fetch("/reportegenerador/Index", {
      // Reemplaza con la ruta correcta
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      // Manejar respuesta exitosa (ej. mostrar mensaje al usuario)
      console.log("Formulario enviado correctamente!");
      const data = await response.json(); // o response.json() si el servidor responde con JSON
      console.log(data); // Mostrar la respuesta del servidor
      Swal.fire({
        text: data.message,
        icon: "success",
      });
      e.target.reset(); // Opcional: limpiar el formulario
    } else {
      // Manejar errores del servidor (ej. mostrar mensaje de error)
      const errorData = await response.text(); // o response.json()
      console.error("Error al enviar el formulario:", errorData);
      Swal.fire({
        text: errorData,
        icon: "error",
      });
    }
  } catch (error) {
    // Manejar errores de red
    console.error("Error al enviar el formulario:", error);
    Swal.fire({
      text: "Ocurrió un error al enviar el formulario.",
      icon: "error",
    });
  } finally {
    hideLoading()
  }
});

const obtenerReporteGenerador = async () => {
  try {
    showLoading();
    const response = await fetch("/reportegenerador/ObtenerReportesGenerador");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Error al obtener reportes, " + (error.message || "desconocido"),
    });
  } finally {
    // Puedes limpiar algún estado aquí si lo necesitas
    hideLoading();
  }
};

const initTable = async (data) => {
  document.querySelector(".container-items").innerHTML = `
    <table id="equiposTable" class="table">
    <thead class="table-header">
      <tr>
        <th>Planta</th>
        <th>Responsable</th>
        <th>Horas trabajadas</th>
         <th>Bateria</th>
        <th>Nivel anticongelante</th>
        <th>Nivel diesel</th>
        <th>Nivel aceite</th>
        <th>Comentario</th>
        <th>Fecha</th>

      </tr>
    </thead>
    <tbody class="items-table">
    </tbody>
  </table>
    `;

  data.forEach((reporte) => {
    document.querySelector(".items-table").innerHTML += `
     <tr>
       <td>
  <p data-tippy-content="${
    reporte.planta?.nombre || "Sin información"
  }">
    ${reporte.planta?.nombre || "N/A"}
  </p>
</td>
<td>
  <p data-tippy-content="${reporte.responsable || "Sin información"}" >
    ${reporte.responsable || "N/A"}
  </p>
</td>
<td>
  <img data-tippy-content="${
    reporte.path_imagen_horas_trabajadas || "Sin información"
  }" src="${
      reporte.path_imagen_horas_trabajadas ? reporte.path_imagen_horas_trabajadas : ""
    }" width="50px" height="50px" loading="lazy" style="aspect-ratio: 16/9; object-fit: cover; cursor: pointer; border-radius: 7px" alt="${
      reporte.path_imagen_horas_trabajadas || "N/A"
    }" />
</td>
<td>
  <img data-tippy-content="${
    reporte.path_imagen_status_bateria || "Sin información"
  }" src="${
      reporte.path_imagen_status_bateria ? reporte.path_imagen_status_bateria : ""
    }" width="50px" height="50px" loading="lazy" style="aspect-ratio: 16/9; object-fit: cover; cursor: pointer; border-radius: 7px" alt="${
      reporte.path_imagen_status_bateria || "N/A"
    }" />
</td>
<td>
  <img data-tippy-content="${
    reporte.path_imagen_nivel_anticongelante || "Sin información"
  }" src="${
      reporte.path_imagen_nivel_anticongelante
        ? reporte.path_imagen_nivel_anticongelante
        : ""
    }" width="50px" height="50px" loading="lazy" style="aspect-ratio: 16/9; object-fit: cover; cursor: pointer; border-radius: 7px" alt="${
      reporte.path_imagen_nivel_anticongelante || "N/A"
    }" />
</td>
<td>
  <img data-tippy-content="${
    reporte.path_imagen_nivel_diesel || "Sin información"
  }" src="${
      reporte.path_imagen_nivel_diesel ? reporte.path_imagen_nivel_diesel : ""
    }" width="50px" height="50px" loading="lazy" style="aspect-ratio: 16/9; object-fit: cover; cursor: pointer; border-radius: 7px" alt="${
      reporte.path_imagen_nivel_diesel || "N/A"
    }" />
</td>
<td>
  <img data-tippy-content="${
    reporte.path_imagen_nivel_aceite || "Sin información"
  }" src="${
      reporte.path_imagen_nivel_aceite ? reporte.path_imagen_nivel_aceite : ""
    }" width="50px" height="50px" loading="lazy" style="aspect-ratio: 16/9; object-fit: cover; cursor: pointer; border-radius: 7px" alt="${
      reporte.path_imagen_nivel_aceite || "N/A"
    }" />
</td>
<td>
  <p data-tippy-content="${reporte.comentario || "Sin información"}">
    ${reporte.comentario || "N/A"}
  </p>
</td>
<td>
  <p data-tippy-content="${
    reporte.created_at || "Sin información"
  }">
    ${reporte.created_at_format_relative || "N/A"}
  </p>
</td>

     </tr>
     `;
  });

  // Iniciar Tippy en los elementos que tengan data-tippy-content
  tippy("[data-tippy-content]", {
    // theme: 'custom', // Aplica el tema personalizado
    animation: "scale", // Animación de escalado
    duration: [300, 200], // Duración de la animación (entrada, salida)
    placement: "top", // Posición del tooltip
    arrow: true, // Mostrar la flecha del tooltip
    delay: [100, 50], // Retraso al mostrar (entrada, salida)
    //maxWidth: 200, // Ancho máximo del tooltip
  });


  var table = $("#equiposTable").DataTable({
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
        // customize: function(doc) {
        //     console.log(doc);
        //     var rows = doc.content[0].table.body; // Accede al cuerpo de la tabla
        //     console.log(rows);
        
        //     // Asumiendo que la tabla tiene un número conocido de columnas, ajusta este valor según tu tabla
        //     const totalColumnas = rows[0].length; // Total de columnas
        
        //     rows.forEach(function(row, rowIndex) {
        //         // Recorre las columnas de cada fila
        //         for (let colIndex = 0; colIndex < totalColumnas; colIndex++) {
        //             // Solo procesar columnas que contienen imágenes
        //             if (colIndex === 2 || colIndex === 3 || colIndex === 4 || colIndex === 5 || colIndex === 6) { // Ajusta según las columnas que contienen imágenes
        //                 // Obtiene la instancia de DataTables
        //                 var imagenSrc = $(table.cell(rowIndex, colIndex).node()).find('img').attr('src'); // Reemplaza 'colIndex' con el índice de la columna de la imagen
        
        //                 console.log(`Imagen src en fila ${rowIndex}, columna ${colIndex}:`, imagenSrc);
        
        //                 if (imagenSrc) {
        //                     // Reemplaza el contenido de la celda con un link a la imagen
        //                     row[colIndex].text = {
        //                         text: 'Ver Imagen',
        //                         link: "https://localhost:7114/"+imagenSrc, // Puedes ajustar el enlace según sea necesario
        //                         color: '#007bff'
        //                     };
        //                 } else {
        //                     row[colIndex].text = 'No disponible';
        //                 }
        //             }
        //         }
        //     });
        // }
        
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
};

// export const obtenerReporteGeneradorPorPlanta = async (plantaId) => {
//     try {
//         showLoading();
//         const response = await fetch(`/reportegenerador/ObtenerReporteGeneradorPorPlanta?plantaId=${plantaId}`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.log(error);
//         Swal.fire({
//             icon: "error",
//             text: "Error al obtener reportes, " + (error.message || "desconocido")
//         });
//     } finally {
//         hideLoading();
//     }
// };

// export const obtenerReporteGeneradorPorFecha = async (fecha) => {
//     try {
//         showLoading();
//         const response = await fetch(`/reportegenerador/ObtenerReporteGeneradorPorFecha?fecha=${fecha}`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.log(error);
//         Swal.fire({
//             icon: "error",
//             text: "Error al obtener reportes, " + (error.message || "desconocido")
//         });
//     } finally {
//         hideLoading();
//     }
// };

// export const obtenerReporteGeneradorPorPlantaYFecha = async (plantaId, fecha) => {
//     try {
//         showLoading();
//         const response = await fetch(`/reportegenerador/
// }
