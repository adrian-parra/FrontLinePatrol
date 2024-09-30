export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelector(selector);

const $containerLoading = $(".container-loading");

export const showModal = (modal) => new bootstrap.Modal(modal).show();
export const hideLoading = () => $containerLoading.style.display = "none";
export const showLoading = () => $containerLoading.style.display = "flex";