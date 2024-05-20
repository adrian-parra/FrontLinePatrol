import { $ } from "./utils.js";
export const changeInputFile = async (e) => {
    const file = e.target.files[0];
        $('#linkInfoImagenSelected').style.display = 'none';
        if (file) {
            $('#linkInfoImagenSelected').style.display = 'flex';
            const imageURL = URL.createObjectURL(file);
            $('#imagenSeleccionada').src = imageURL;
            const modal = new bootstrap.Modal($('#exampleModal'));
            modal.show();
        }
}

export const formSubmitHandler = async (e) => {
    e.preventDefault() // CANCELA LA ACTUALIZACIÓN DE LA PAGINA

    var formData = new FormData(e.target);

    try {
        $('.container-loading').style = 'display:flex;' // MUESTRA LOADING DE CARGA MIENTRAS GUARDA LOS DATOS
        const response = await fetch('/Tarea/GuardarCambios', {
            method: 'POST',
            body: formData,
        });
        // SALIO BIEN (RESPUESTA POR EL SERVER OK)
        if (response.ok) {
            const data = await response.text();
            $('.container-loading').style = 'display:none;'
            Swal.fire({
                text: 'Patrullaje registrado',
                icon: 'success'
            }).then(() => {
                window.location.href = '../';
            });

            e.target.reset();
        } else { // RESPUESTA DEL SERVER ERROR

            const errorMessage = await response.text();
            Swal.fire({
                text: errorMessage,
                icon: 'error'
            });
        }
    } catch (error) {
    console.error('Error:', error);
}finally {
    $('.container-loading').style = 'display:none'; // OCULTA EL LOADING DE CARGA
}
}
