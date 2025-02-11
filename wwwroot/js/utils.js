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

// Utility function for consistent Swal alerts
export const showAlert = (type, message, title = '') => {
  const config = {
    icon: type,
    text: message,
    title: title,
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000
  };
  
  // Remove title if empty
  if (!title) delete config.title;
  
  Swal.fire(config);
};


export class ApiService {
  static async fetchData(url, options = {}) {
    try {
      const defaultOptions = {
        method: 'GET',
      };

      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }
}

// Utilidades para validación de IPs
export const IPUtils = {
  // Validar IPv4
  isValidIPv4(ip) {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  },

  // Validar IPv6
  isValidIPv6(ip) {
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  },

  // Extraer IPs de un texto
  extractIPs(text) {
    const ipv4Regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    return text.match(ipv4Regex) || [];
  },

  // Validar rango de IP privada
  isPrivateIP(ip) {
    const privateIPv4Ranges = [
      /^10\./,                    // 10.0.0.0 - 10.255.255.255
      // /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0 - 172.31.255.255
      /^192\.168\./,              // 192.168.0.0 - 192.168.255.255
      /^127\./                    // Localhost
    ];

    return privateIPv4Ranges.some(regex => regex.test(ip));
  },

  // Convertir IP a número entero (útil para comparaciones)
  ipToNumber(ip) {
    return ip.split('.').reduce((acc, octet) => (acc * 256) + parseInt(octet, 10), 0);
  },

  // Comparar dos IPs
  compareIPs(ip1, ip2) {
    if (!this.isValidIPv4(ip1) || !this.isValidIPv4(ip2)) {
      throw new Error('Invalid IP address');
    }

    const num1 = this.ipToNumber(ip1);
    const num2 = this.ipToNumber(ip2);

    return Math.sign(num1 - num2);
  },
  async getHostnameFromIP(ip) {
    try {
      // Validar IP primero
      if (!IPUtils.isValidIPv4(ip)) {
        throw new Error('IP inválida');
      }

      const response = await ApiService.fetchData(`/Network/ResolveHostname?ip=${ip}`);
      
      if (response.success) {
        // Eliminar el dominio específico
        const cleanHostname = response.hostname.split('.')[0];
        return cleanHostname;
      } else {
        console.warn(response.message);
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo hostname:", error);
      showAlert('error', `Error al resolver hostname: ${error.message}`);
      return null;
    }
  },
// Método para obtener información de red completa
async getNetworkInfo(ip) {
  try {
    // Validar IP primero
    if (!IPUtils.isValidIPv4(ip)) {
      throw new Error('IP inválida');
    }

    const response = await ApiService.fetchData(`/Network/GetNetworkInfo?ip=${ip}`);
    
    if (response.success) {
      return response;
    } else {
      console.warn(response.message);
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo información de red:", error);
    showAlert('error', `Error al obtener información de red: ${error.message}`);
    return null;
  }
}

};