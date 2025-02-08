export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelector(selector);

const $containerLoading = $(".container-loading");

export const showModal = (modal) => new bootstrap.Modal(modal).show();
export const hideLoading = () => $containerLoading.style.display = "none";
export const showLoading = () => $containerLoading.style.display = "flex";

export function getEstadoClass(estado) {
    switch (estado) {
      case 'Pendiente':
        return 'text-danger';
      case 'En proceso':
        return 'text-warning';
      case 'Resuelto':
        return 'text-success';
      default:
        return 'text-secondary'; // Clase por defecto si el estado no coincide
    }
  }


  export function tiempoTranscurrido(fechaISO) {
    const fecha = new Date(fechaISO);
    const ahora = new Date();
    const diferencia = ahora - fecha;

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) {
        const horasRestantes = horas % 24;
        return `hace ${dias} días y ${horasRestantes} horas`;
    } else if (horas > 0) {
        const minutosRestantes = minutos % 60;
        return `hace ${horas} horas y ${minutosRestantes} minutos`;
    } else if (minutos > 0) {
        return `hace ${minutos} minutos`;
    } else {
        return `hace ${segundos} segundos`;
    }
}

export function diferenciaTiempo(createdAt, updatedAt) {
  const inicio = new Date(createdAt);
  const fin = new Date(updatedAt);
  const diferencia = fin - inicio;

  if (diferencia < 0) {
      return "Las fechas no son válidas"; // Manejo de errores
  }

  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  const horasRestantes = horas % 24;
  const minutosRestantes = minutos % 60;

  let resultado = [];
  if (dias > 0) resultado.push(`${dias} días`);
  if (horasRestantes > 0) resultado.push(`${horasRestantes} horas`);
  if (minutosRestantes > 0) resultado.push(`${minutosRestantes} minutos`);

  return resultado.length > 0 ? resultado.join(", ") : "0 minutos";
}

export const convertiFechaAUTC = (fechaLocal,hora) =>{
  const [yyyy, mm, dd] = fechaLocal.split("-");
  const [hh, min] = hora.split(":");
  const fechaUTC = new Date(Date.UTC(yyyy, mm - 1, dd, hh, min));
  return fechaUTC.toISOString();
}


export function establecerFechasPredeterminadas() {
  const fechaInicio = document.querySelector("#fechaInicio");
  const horaInicio = document.querySelector("#horaInicio");
  const fechaFin = document.querySelector("#fechaFin");
  const horaFin = document.querySelector("#horaFin");

  // Obtener fecha actual
  const hoy = new Date();
  
  // Establecer fecha de inicio (hoy)
  const fechaInicioLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  fechaInicio.valueAsDate = fechaInicioLocal;
  
  // Establecer hora de inicio a 5:00 PM
  horaInicio.value = "17:00";

  // Calcular fecha de fin (día siguiente)
  const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  fechaFin.valueAsDate = manana;

  // Establecer hora de fin a 12:00 PM
  horaFin.value = "12:00";
}

export function copyToClipboard(text) {
  if (text === 'N/A') return;

  if (!navigator.clipboard) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Acceso al portapapeles no disponible',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    Swal.fire({
      icon: 'success',
      title: 'Copiado',
      text: `Hostname "${text}" copiado al portapapeles`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }).catch(err => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo copiar el hostname',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  });
}
