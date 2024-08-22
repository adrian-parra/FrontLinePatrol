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




    // console.log(formData.get("id_planta"))
    // console.log(formData.get("id_linea"))
    // console.log(formData.get("imagen").size)
    // console.log(formData.get("id_estacion"))
    // console.log(formData.get("comentario")) 



    // ! VALIDACION DE FORMULARIO
    let errores = []; // Array para acumular errores

    const iconError = `<i class="fas fa-exclamation-triangle" style="color: #F27474; font-size: 24px;" aria-hidden="true"></i> `

    if (formData.get("id_planta") === "" || formData.get("id_planta") == null) {
        errores.push(iconError + "El campo <span> planta </span> no puede estar vacío.");
    }
    if (formData.get("id_linea") === "" || formData.get("id_linea") == null) {
        errores.push(iconError + "El campo <span> linea </span> no puede estar vacío.");
    }
    if (formData.get("imagen").size === 0 || null) {
        errores.push(iconError + "El campo <span> imagen </span> no puede estar vacío.");
    }
    if (formData.get("id_estacion") === "" || formData.get("id_estacion") == null) {
        errores.push(iconError + "El campo <span> estacion </span> no puede estar vacío.");
    }
    if (formData.get("comentario") === "") {
        errores.push(iconError + "El campo <span> comentario </span> no puede estar vacío.");
    }

    if (formData.get("responsable") === "") {
        errores.push(iconError + "El campo <span> responsable </span> no puede estar vacío.");
    }


    if (errores.length > 0) {
        swal.fire({
            html: errores.join("<br>"), // Unir errores en un solo mensaje
            icon: "error",
            button: "Aceptar",

        });

        return false
    } 
    

    console.log(formData.get("responsable"))







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
                text: 'Recorrido registrado',
                icon: 'success'
            }).then(() => {
                // window.location.href = '../';

            });

            // e.target.reset();

            $('#floatingTextarea2').value = ""
            $("#formFileSm").value = ""
            $("#selectEstacion").selectedIndex = 0;
            $("#linkInfoImagenSelected").style.display = "none"


        } else { // RESPUESTA DEL SERVER ERROR

            const errorMessage = await response.text();
            Swal.fire({
                text: errorMessage,
                icon: 'error'
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        $('.container-loading').style = 'display:none'; // OCULTA EL LOADING DE CARGA
    }
}
