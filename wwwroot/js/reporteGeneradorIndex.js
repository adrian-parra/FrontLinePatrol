
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