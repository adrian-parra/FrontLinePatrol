import { showLoading, hideLoading } from "/js/utils.js";

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

export const ping = async (hostname) => {
    try {
        const dataForm = new FormData();
        dataForm.append("ip", hostname);

        const response = await fetch("/cmd/TestConection", {
            method: "POST",
            body: dataForm,
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        Swal.fire({
            icon: "error",
            text: error.message,
        })
    }
}
export const apagarEquipoComputo = async (formData) => {
    try {
        showLoading()
        const response = await fetch("/cmd/ApagarDeviceWmi", {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        Swal.fire({
            icon: "success",
            text: "Equipo se apago coon éxito"
        });
        return data;
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            text: "Error al apagar equipo, " + (error.message || "desconocido")
        });
    } finally {
        hideLoading()
    }

}
export const obtenerInfoEquipoComputo = async (formData) => {
    try {
        showLoading()
        const response = await fetch("/cmd/ObtenerInfoDeviceWmi", {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            text: "Error al obtener información del equipo, " + (error.message || "desconocido")
        });
    } finally {
        hideLoading()
    }

}

export const obtenerUptimeDevice = async (formData) => {
    try {
        showLoading()
        const response = await fetch("/cmd/UptimeDeviceWmi", {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            text: "Error al obtener información del equipo, " + (error.message || "desconocido")
        });
    } finally {
        hideLoading()
    }

}

export const obtenerSoftwareInstalado = async (formData) => {
    try {
        showLoading()
        const response = await fetch("/cmd/ObtenerSoftwareDeEquipoWmi", {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            text: "Error al obtener información del equipo, " + (error.message || "desconocido")
        });
    } finally {
        hideLoading()
    }

}

export const DesinstalarSoftwareDeEquipoWmi = async (formData) => {
    try {
        showLoading()
        const response = await fetch("/cmd/DesinstalarSoftwareDeEquipoWmi", {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            text: "Error al obtener información del equipo, " + (error.message || "desconocido")
        });
    } finally {
        hideLoading()
    }

}

export const HistorialActualizacionEquipoComputo = async (formData) => {
    try {
        showLoading()
        const response = await fetch("/cmd/ObtenerActualizacionesDeEquipoWmi", {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            text: "Error al obtener información del equipo, " + (error.message || "desconocido")
        });
    } finally {
        hideLoading()
    }

}

export const DiskSpace = async (formData) => {
    showLoading();
  
    try {
      const respuesta = await fetch("/Cmd/DiskSpace", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      return dataResponse;
    } catch (error) {
      console.error("Error al obtener espacio en disco:", error);
      Swal.fire({
        icon: "error",
        text: "Error al obtener espacio en disco. Inténtalo de nuevo más tarde. "+error.message,
      });
    } finally {
      hideLoading();
    }
  };

export const PhysicalMemory = async (formData) => {
    showLoading();
  
    try {
      const respuesta = await fetch("/Cmd/PhysicalMemory", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      return dataResponse;
    } catch (error) {
      console.error("Error al obtener memoria física:", error);
      Swal.fire({
        icon: "error",
        text: "Error al obtener memoria física. Inténtalo de nuevo más tarde. "+error.message,
      });
    } finally {
      hideLoading();
    }
}

export const SistemaOperativo = async (formData) => {   
    showLoading();
  
    try {
      const respuesta = await fetch("/Cmd/InfoSistemaOperativo", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      return dataResponse;
    } catch (error) {
      console.error("Error al obtener sistema operativo:", error);
      Swal.fire({
        icon: "error",
        text: "Error al obtener sistema operativo. Inténtalo de nuevo más tarde. "+error.message,
      });
    } finally {
      hideLoading();
    }
}

export const GetServicesEquipoComputo = async (formData) => {
    showLoading();
  
    try {
      const respuesta = await fetch("/Cmd/GetServiceInfo", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      return dataResponse;
    } catch (error) {
      console.error("Error al obtener servicios del equipo:", error);
      Swal.fire({
        icon: "error",
        text: "Error al obtener servicios del equipo. Inténtalo de nuevo más tarde. "+error.message,
      });
    } finally {
      hideLoading();
    }
}

export const DeleteTempEquipoComputo = async (formData) => {
    showLoading();
  
    try {
      const respuesta = await fetch("/Cmd/DeleteTemp", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      Swal.fire({
        icon: "success",
        text: dataResponse.message + " " + dataResponse.totalSizeMB + " en carpeta temporal",
      });
    } catch (error) {
      console.error("Error al eliminar archivos temporales:", error);
      Swal.fire({
        icon: "error",
        text: "Error al eliminar archivos temporales. Inténtalo de nuevo más tarde. "+error.message,
      });
    } finally {
      hideLoading();
    }
  }

export const GetProcessEquipoComputo =  async (formData) => {
    
  
    try {
      const respuesta = await fetch("/Cmd/GetProccessInfo", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      return dataResponse;
    } catch (error) {
      console.error("Error al obtener procesos del equipo:", error);
      throw new Error(`Error: ${error.message}`);
    } 
  }

export const GetUsersInfoEquipoComputo = async (formData) => {
    showLoading();
  
    try {
      const respuesta = await fetch("/Cmd/GetUsersInfo", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      return dataResponse;
    } catch (error) {
      console.error("Error al obtener información de usuarios:", error);
      Swal.fire({
        icon: "error",
        text: "Error al obtener información de usuarios. Inténtalo de nuevo más tarde. "+error.message,
      });
    } finally {
      hideLoading();
    }
}

export const GetPuntoRestauracion = async (formData) => {
    showLoading();
  
    try {
      const respuesta = await fetch("/Cmd/PuntoRestauracion", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      return dataResponse;
    } catch (error) {
      console.error("Error al obtener puntos de restauración:", error);
      Swal.fire({
        icon: "error",
        text: "Error al obtener puntos de restauración. Inténtalo de nuevo más tarde. "+error.message,
      });
    } finally {
      hideLoading();
    }

}

export const GetBiosSerialNumber = async (formData) => {
    showLoading();
  
    try {
      const respuesta = await fetch("/Cmd/GetBiosSerialNumber", {
        method: 'POST',
        body: formData,
      });
  
      // Verifica si la respuesta es exitosa
      if (!respuesta.ok) {
        throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const dataResponse = await respuesta.json();
  
      return dataResponse;
    } catch (error) {
      console.error("Error al obtener serial number de BIOS:", error);
      Swal.fire({
        icon: "error",
        text: "Error al obtener serial number de BIOS. Inténtalo de nuevo más tarde. "+error.message,
      });
    } finally {
      hideLoading();
    }

}








export function recorrerCadena(cadena) {
    var newCadena = ''
    var isNotBlockRecorrido = true
    for (let i = 0; i < cadena.length; i++) {

        let caracterEnter = cadena[i] + cadena[i + 1]


        let saltoDeLinea = caracterEnter.replace(/\\n|\\r/g, function (match) {
            if (match === "\\n") {
                return "\n";
            } else if (match === "\\r") {
                return "\r";
            }
        });






        if (isNotBlockRecorrido) {
            if (saltoDeLinea.charCodeAt(0) === 10 || saltoDeLinea.charCodeAt(0) === 13) {

                newCadena += '<br>'
                isNotBlockRecorrido = false

            } else {



                newCadena += cadena[i]


            }
        } else {
            isNotBlockRecorrido = true
        }



    }



    return newCadena
}

