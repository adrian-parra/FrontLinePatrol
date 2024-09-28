export const restartDeviceWmi = async (dataForm) => {
    $('.container-loading').style = 'display:flex;'
    try {
        // OBTENER DATA DEL FORM QUE SE USARA PARA FILTRAR LA INFORMACIÓN


        const datosResponse = await fetch('/Cmd/RestartDeviceWmi', {
            method: 'POST',
            body: dataForm,
        });

        // Verificar si la respuesta es un error 400
        if (!datosResponse.ok) {
            if (datosResponse.status === 400) {
                throw new Error('Solicitud incorrecta (400). Verifica los datos enviados.');
            } else {
                throw new Error(`Error en la solicitud: ${datosResponse.status}`);
            }
        }

        const datos = await datosResponse.text();
        //$('.container-respuesta .respuesta').innerHTML = `<pre>${datos}</pre>`;
        Swal.fire({
            title: 'Respuesta',
            text: `${datos}`, // Usamos 'html' para permitir etiquetas HTML
            icon: 'info', // Puedes cambiar el icono según sea necesario
            confirmButtonText: 'Aceptar' // Texto del botón de confirmación
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
       // $('.container-respuesta .respuesta').innerHTML = `<pre>Error: ${error.message}</pre>`;
        Swal.fire({
            title: 'error',
            text: `<pre>${error.message}</pre>`, // Usamos 'html' para permitir etiquetas HTML
            icon: 'error', // Puedes cambiar el icono según sea necesario
            confirmButtonText: 'Aceptar' // Texto del botón de confirmación
        });
    } finally {
        // Ocultar el loader de carga
        $('.container-loading').style = 'display:none;';
    }
}

export const cerrarAppWmi = async (dataForm) => {
    $('.container-loading').style = 'display:flex;'
    try {
        // OBTENER DATA DEL FORM QUE SE USARA PARA FILTRAR LA INFORMACIÓN


        const datosResponse = await fetch('/Cmd/CloseAppWmi', {
            method: 'POST',
            body: dataForm,
        });

        // Verificar si la respuesta es un error 400
        if (!datosResponse.ok) {
            if (datosResponse.status === 400) {
                throw new Error('Solicitud incorrecta (400). Verifica los datos enviados.');
            } else {
                throw new Error(`Error en la solicitud: ${datosResponse.status}`);
            }
        }

        const sms = await datosResponse.text();
        //$('.container-respuesta .respuesta').innerHTML = `<pre>${datos}</pre>`;
        Swal.fire({
            icon: "success",
            text: sms,
        })
    } catch (error) {
        // Manejo de errores
        console.error('Error:', error);
        $('.container-respuesta .respuesta').innerHTML = `<pre>Error: ${error.message}</pre>`;
        Swal.fire({
            icon: "error",
            text: error.message,
        })

    } finally {
        // Ocultar el loader de carga
        $('.container-loading').style = 'display:none;';
    }
}
