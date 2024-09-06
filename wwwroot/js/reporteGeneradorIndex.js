
import { $ } from "/js/utils.js";

//  EVENTO CLICK EN CONTAINER DE FORM
$('.loal-container-form').addEventListener("click", (e) => {
    const target = e.target;

    // Mapeamos los botones a sus inputs correspondientes
    const buttonToInputMap = {
        'btnChangeInputFileImageHorasTrabajadas': '#inputFileHorasTrabajadas',
        'btnChangeInputFileImageStatusBateria': '#inputFileImageStatusBateria',
        'btnChangeInputFileImageNivelAnticongelante': '#inputFileNivelAnticongelante',
        'btnChangeInputFileImageNivelDiesel': '#inputFileNivelDiesel',
        'btnChangeInputFileImageNivelAceite': '#inputFileNivelAceite',
    };

    // Verificamos si el clic fue en un botón que está en el mapeo
    if (target.tagName === 'BUTTON' && buttonToInputMap[target.id]) {
        $(buttonToInputMap[target.id]).click(); // Simulamos clic en el input file correspondiente
    }
})

// Objetos para almacenar las URLs de las imágenes seleccionadas
const imageUrls = {};

// Función para manejar el evento change de un input file de manera dinámica
function handleFileInputChange(inputId, linkId, key) {
    $(inputId).addEventListener("change", (e) => {
        const file = e.target.files[0];
        const link = $(linkId);

        // Ocultamos el link inicialmente
        link.classList.add("loal-ocultar-o-mostrar");
        // Si hay un archivo seleccionado, guardamos la URL y mostramos el link
        if (file) {
            const imageURL = URL.createObjectURL(file);
            $('#imagenSeleccionada').src = imageURL;
            const modal = new bootstrap.Modal($('#exampleModal'));
            modal.show();
            imageUrls[key] = imageURL; // Guardamos la URL de la imagen seleccionada
            link.classList.toggle("loal-ocultar-o-mostrar");
        }
    });

    // Evento click en el link para mostrar la imagen seleccionada en el modal
    $(linkId).addEventListener("click", (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del enlace

        // Si existe una imagen guardada, la mostramos en el modal
        if (imageUrls[key]) {
            $('#imagenSeleccionada').src = imageUrls[key];
            const modal = new bootstrap.Modal($('#exampleModal'));
            modal.show();
        }
    });
}

handleFileInputChange('#inputFileHorasTrabajadas', '#linkInfoImagenSelectedHoras', 'horas');
handleFileInputChange('#inputFileImageStatusBateria', '#linkInfoImagenSelectedBateria', 'bateria');
handleFileInputChange('#inputFileNivelAnticongelante', '#linkInfoImagenSelectedAnticongelante', 'anticongelante');
handleFileInputChange('#inputFileNivelDiesel', '#linkInfoImagenSelectedDiesel', 'diesel');
handleFileInputChange('#inputFileNivelAceite', '#linkInfoImagenSelectedAceite', 'aceite');



// ... (código para manejar la selección de imágenes) ...

$('#formReporteGenerador').addEventListener('submit', async (e) => {
    e.preventDefault();
    var formData = new FormData(e.target);
    console.log(formData.get("reloj"))
    console.log(formData.get("imagen_horas_trabajadas"))
    console.log(formData.get("imagen_status_bateria"))
    console.log(formData.get("imagen_nivel_anticongelante"))
    console.log(formData.get("imagen_nivel_diesel"))
    console.log(formData.get("imagen_nivel_aceite"))
    // Validación de datos
    let errores = [];
     const iconError = `<i class="fas fa-exclamation-triangle" style="color: #F27474; font-size: 24px;" aria-hidden="true"></i> `

    // Ejemplo de validación para el campo "reloj" (puedes agregar más validaciones)
    if (formData.get("reloj") === "" || formData.get("reloj") === null) {
        errores.push(iconError + " El campo 'Reloj' es obligatorio.");
    }
    // Validación de imágenes (asegúrate de que se haya seleccionado una imagen)
    if (formData.get("imagen_horas_trabajadas").size === 0) {
        errores.push(iconError + " Debes seleccionar una imagen para 'Horas Trabajadas'.");
    }
    if (formData.get("imagen_status_bateria").size === 0) {
        errores.push(iconError + " Debes seleccionar una imagen para 'Status de Batería'.");
    }
    if (formData.get("imagen_nivel_anticongelante").size === 0) {
        errores.push(iconError + " Debes seleccionar una imagen para 'Nivel de Anticongelante'.");
    }
    if (formData.get("imagen_nivel_diesel").size === 0) {
        errores.push(iconError + " Debes seleccionar una imagen para 'Nivel de Diesel'.");
    }
    if (formData.get("imagen_nivel_aceite").size === 0) {
        errores.push(iconError + " Debes seleccionar una imagen para 'Nivel de Aceite'.");
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
        $('.container-loading').style = 'display:flex;'; // Mostrar loading

        const response = await fetch('/reportegenerador/Index', { // Reemplaza con la ruta correcta
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Manejar respuesta exitosa (ej. mostrar mensaje al usuario)
            console.log('Formulario enviado correctamente!');
            const data = await response.text(); // o response.json() si el servidor responde con JSON
            console.log(data); // Mostrar la respuesta del servidor
            e.target.reset(); // Opcional: limpiar el formulario
        } else {
            // Manejar errores del servidor (ej. mostrar mensaje de error)
            const errorData = await response.text(); // o response.json()
            console.error('Error al enviar el formulario:', errorData);
            Swal.fire({
                text: errorData,
                icon: 'error'
            });
        }
    } catch (error) {
        // Manejar errores de red
        console.error('Error al enviar el formulario:', error);
        Swal.fire({
            text: 'Ocurrió un error al enviar el formulario.',
            icon: 'error'
        });
    } finally {
        $('.container-loading').style = 'display:none;'; // Ocultar loading
    }
});