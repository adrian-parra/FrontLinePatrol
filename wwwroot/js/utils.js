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