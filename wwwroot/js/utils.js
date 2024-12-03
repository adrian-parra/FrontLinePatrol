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
