const personnelData = {
    direct: 45,
    indirect: 30,
    administrative: 15
};

const backgroundColorApp = "#4A92C5"

// Configuración centralizada
const CONFIG = {
   EMPLEADOS: [
       { numero: "256553", cumpleanos: "2005-02-03", nombreCompleto: "Juan Carlos Pérez Ramírez" },
       { numero: "123456", cumpleanos: "2000-01-31", nombreCompleto: "María Elena Sánchez González" },
       { numero: "789012", cumpleanos: "1995-07-30", nombreCompleto: "Luis Alberto Rodríguez Martínez" }
   ]
};

// Módulo de Utilidades
const Utilidades = {
   esCumpleanos(fechaCumpleanos) {
       const hoy = new Date();
       const [year, month, day] = fechaCumpleanos.split('-').map(Number);
       const cumpleanos = new Date(year, month - 1, day);
       
       return hoy.getMonth() === cumpleanos.getMonth() && 
              hoy.getDate() === cumpleanos.getDate();
   },

   calcularEdad(fechaCumpleanos) {
       const hoy = new Date();
       const cumpleanos = new Date(fechaCumpleanos);
       let edad = hoy.getFullYear() - cumpleanos.getFullYear();
       const m = hoy.getMonth() - cumpleanos.getMonth();
       
       return (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) 
           ? edad - 1 
           : edad;
   },

  formatearHora() {
      const now = new Date();
      const hours = (now.getHours() % 12 || 12).toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      
      return `${hours}:${minutes}:${seconds} ${ampm}`;
  },
  actualizarGrafica(){
    new Chart(document.getElementById('personnelChart'), {
        type: 'bar',
        data: {
            labels: ['Personal Directo', 'Personal Indirecto', 'Administrativos'],
            datasets: [{
                label: 'Número de Empleados',
                data: [personnelData.direct, personnelData.indirect, personnelData.administrative],
                backgroundColor: function(context) {
                const chart = context.chart;
                const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
                gradient.addColorStop(0, '#2575fc');
                gradient.addColorStop(1, '#6a11cb');
                return gradient;
                },
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderRadius: {
                    topLeft: 7,
                    topRight: 7,
                    bottomLeft: 7,
                    bottomRight: 7
                },
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
             scales: {
                x: {
                    ticks: {
                        color: backgroundColorApp, // Color del texto
                        font: {
                            weight: 'bold', // Negrita
                            size: 14 // Tamaño de fuente
                        },
                        padding: 1, // Espaciado
                    },
                    
                },
                y: {
                     display: true,
                    ticks: {
                        color: backgroundColorApp, // Color del texto
                        font: {
                            weight: 'bold', // Negrita
                            size: 14 // Tamaño de fuente
                        },
                        padding: 1, // Espaciado
                        textStrokeColor: 'rgba(0,0,0,0.3)', // Contorno del texto
                        textStrokeWidth: 1
                    },
                    
                },
               
                
            },

            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: backgroundColorApp, // Color del texto
                        font: {
                            weight: 'bold', // Negrita
                            size: 14 // Tamaño de fuente
                        },
                        padding: 1, // Espaciado
                        textStrokeWidth: 1
                    }
                },
                title: {
                    display: true,
                    text: 'Distribución de Personal',
                    color: 'transparent',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 20
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#ffffff',
                    font: {
                        weight: 'bold',
                        size: 17
                    },
                    backgroundColor: function(context) {
                        const chart = context.chart;
                        const gradient = chart.ctx.createLinearGradient(0, 0, 0, 50);
                        gradient.addColorStop(0, '#2575fc');
                        gradient.addColorStop(1, '#6a11cb');
                        return gradient;
                    },
                    borderRadius: 7,
                    padding: {
                        top: 4,
                        bottom: 4,
                        left: 8,
                        right: 8
                    },
                    formatter: function(value) {
                        return value;
                    },
                    textShadow: {
                        color: 'rgba(0,0,0,0.3)',
                        blur: 2,
                        offsetX: 1,
                        offsetY: 1
                    },
                    boxShadow: {
                        color: 'rgba(0,0,0,0.2)',
                        blur: 4,
                        offsetX: 1,
                        offsetY: 1
                    },
                    opacity: 0.9,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.5)'
                }
            }
        },
        plugins: [{
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, chart.width, 0);
                gradient.addColorStop(0, '#2575fc');
                gradient.addColorStop(1, '#6a11cb');

                chart.options.plugins.title.color = gradient;
            }
        }, ChartDataLabels]
    });
  }


};

// Módulo de Reloj
const Reloj = {
   elementoClock: null,

    iniciar() {
       this.elementoClock = document.getElementById('clock');
       this.actualizar();
       this.animar();
    },

   actualizar() {
       if (this.elementoClock) {
           this.elementoClock.textContent = Utilidades.formatearHora();
       }
   },

   animar() {
       this.actualizar();
       requestAnimationFrame(() => {
           setTimeout(() => this.animar(), 1000);
       });
   }
};

// Módulo de Gestión de Empleados
const GestorEmpleados = {
   elementoInput: null,
   elementoDisplay: null,
   elementoCumpleanos: null,
   cumpleanosList: [],
   carouselInterval: null,
   currentCarouselIndex: 0,

   iniciar() {
       this.elementoInput = document.getElementById('numberInput');
       this.elementoDisplay = document.getElementById('inputDisplay');
       this.elementoCumpleanos = document.getElementById('cumpleanosMensaje');

       if (this.elementoInput) {
           this.elementoInput.addEventListener('keydown', this.manejarEntrada.bind(this));
           this.elementoInput.focus();
       }

       
   },

   manejarEntrada(event) {
       if (event.key !== 'Enter') return;

       event.preventDefault();
       const inputValue = this.elementoInput.value.trim();

       if (!inputValue) return;

       const empleado = this.buscarEmpleado(inputValue);

       if (!empleado) {
           this.elementoInput.value = '';
           this.mostrarMensajeError();
           return;
       }

       this.mostrarInformacionEmpleado(empleado);
       this.verificarCumpleanos(empleado);
       this.elementoInput.value = '';
   },

   buscarEmpleado(numeroReloj) {
       return CONFIG.EMPLEADOS.find(emp => emp.numero === numeroReloj);
   },

   mostrarInformacionEmpleado(empleado) {
       if (this.elementoDisplay) {
           this.elementoDisplay.innerHTML = `
           <div class="nombre-empleado-checador">
               ${empleado.nombreCompleto} ✅
           </div>
       `;

       // Agregar estilos dinámicos
       const styleId = 'nombre-empleado-styles';
       if (!document.getElementById(styleId)) {
           const style = document.createElement('style');
           style.id = styleId;
           style.textContent = `
               .nombre-empleado-checador {
                   background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
                   color: white;
                   padding: 15px 25px;
                   border-radius: var(--border-radius);
                   font-size: 24px;
                   font-weight: bold;
                   text-align: center;
                   box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                   text-transform: uppercase;
                   letter-spacing: 1px;
                   max-width: 100%;
                   overflow: hidden;
                   text-overflow: ellipsis;
                   animation: fadeIn 0.5s ease-out;
               }
           `;
           document.head.appendChild(style);
       }
       }
   },
   iniciarCarruselCumpleanos() {
    // Limpiar cualquier intervalo existente
    if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
    }

    // Añadir estilos de carrusel
    this.agregarEstilosCarrusel();

    // Mostrar primer cumpleaños
    this.mostrarCumpleanosActual();

    // Configurar carrusel si hay más de un cumpleaños
    if (this.cumpleanosList.length > 1) {
        this.carouselInterval = setInterval(() => {
        this.avanzarCumpleanos();
    }, 3000); // Cambiar cada 5 segundos
    }
     },

     verificarCumpleanos(empleado) {
    if (!Utilidades.esCumpleanos(empleado.cumpleanos)) return;

    // Agregar al array de cumpleaños en lugar de mostrar inmediatamente
    const edad = Utilidades.calcularEdad(empleado.cumpleanos);
    const cumpleanoInfo = {
        nombreCompleto: empleado.nombreCompleto,
        edad: edad,
        avatar: this.generarAvatarInicial(empleado.nombreCompleto)
    };

    this.cumpleanosList.push(cumpleanoInfo);

    // Si es el primer cumpleaños, iniciar carrusel
    if (this.cumpleanosList.length >= 1) {
        console.log('Iniciando carrusel de cumpleaños');
        this.iniciarCarruselCumpleanos();
    }
  },mostrarCumpleanosActual() {
        if (this.cumpleanosList.length === 0) return;

        const cumpleano = this.cumpleanosList[this.currentCarouselIndex];

        this.elementoCumpleanos.innerHTML = `
            <div class="cumpleanos-carrusel">
                <div class="cumpleanos-mensaje-profesional">
                    <div class="cumpleanos-header">
                        <span class="emoji-celebracion">🎉</span>
                        <h2>¡Feliz Cumpleaños!</h2>
                        <span class="emoji-celebracion">🎂</span>
                    </div>
                    <div class="cumpleanos-contenido">
                        <div class="cumpleanos-avatar">
                            ${cumpleano.avatar}
                        </div>
                        <div class="cumpleanos-detalles">
                            <h3>${cumpleano.nombreCompleto}</h3>
                            
                            <div class="cumpleanos-insignia">
                                🎂 Celebrando su día especial
                            </div>
                        </div>
                    </div>
                    ${this.cumpleanosList.length > 1 ? this.generarIndicadores() : ''}
                </div>
            </div>
        `;

        this.agregarEstilosCumpleanos();

        // Lanzar animación de globos
        crearGlobos();
    },
    generarAvatarInicial(nombreCompleto) {
        const iniciales = nombreCompleto
        .split(' ')
        .map(nombre => nombre[0].toUpperCase())
        .slice(0, 2)
        .join('');

        return `
        <div class="avatar-inicial" style="
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ">
        ${iniciales}
        </div>
        `;
    },// Método para agregar estilos dinámicamente
    agregarEstilosCumpleanos() {
        const styleId = 'cumpleanos-styles';
        if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
        .cumpleanos-mensaje-profesional {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: var(--border-radius);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        padding: 20px;
        max-width: 500px;
        text-align: center;
        position: relative;
        overflow: hidden;
        }

        .cumpleanos-header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 15px;
        }

        .cumpleanos-header h2 {
        margin: 0 15px;
        color: #333;
        font-size: 24px;
        }

        .emoji-celebracion {
        font-size: 36px;
        animation: pulse 1.5s infinite;
        }

        .cumpleanos-contenido {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--gap);
        }

        .cumpleanos-detalles{
         display:flex;
         gap:var(--gap);
         flex-direction:column;
        }

        .cumpleanos-detalles h3 {
        margin: 0;
        color: #2c3e50;
        font-size: 20px;
        }

        .cumpleanos-detalles p {
        color: #7f8c8d;
        margin: 5px 0 15px;
        }

        .cumpleanos-insignia {
        background-color: #3498db;
        color: white;
        padding: 8px 15px;
        border-radius: var(--border-radius);
        font-size: 14px;
        display: inline-block;
        }


        `;
        document.head.appendChild(style);
        }
    },
  mostrarMensajeError(mensaje = 'Empleado no encontrado') {
      if (this.elementoDisplay) {
          this.elementoDisplay.textContent = mensaje;
          this.elementoDisplay.style.cssText = `
              color: red;
              font-size:var(--size-text);
              font-weight: bold;
          `;

      }
  },
avanzarCumpleanos() {
    this.currentCarouselIndex = 
    (this.currentCarouselIndex + 1) % this.cumpleanosList.length;
        this.mostrarCumpleanosActual();
},

generarIndicadores() {
return `
<div class="cumpleanos-indicadores">
    ${this.cumpleanosList.map((_, index) => `
        <span class="indicador ${index === this.currentCarouselIndex ? 'activo' : ''}"></span>
    `).join('')}
</div>
`;
},

agregarEstilosCarrusel() {
const styleId = 'cumpleanos-carrusel-styles';
if (!document.getElementById(styleId)) {
const style = document.createElement('style');
style.id = styleId;
style.textContent = `
    .cumpleanos-carrusel {
        position: relative;
    }

    .cumpleanos-indicadores {
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }

    .indicador {
        width: 10px;
        height: 10px;
        background-color: #bbb;
        border-radius: 50%;
        margin: 0 5px;
        transition: background-color 0.3s ease;
    }

    .indicador.activo {
        background-color: #3498db;
    }
`;
document.head.appendChild(style);
}
}
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
   Reloj.iniciar();
   GestorEmpleados.iniciar();
   Utilidades.actualizarGrafica();
});

// Función para crear globos animados
function crearGlobos(cantidad = 50) {
const balloonContainer = document.createElement('div');
balloonContainer.classList.add('balloon-container');
document.body.appendChild(balloonContainer);

const colores = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#FDCB6E', '#6C5CE7', '#FF8A5B', 
    '#2ECC71', '#3498DB', '#9B59B6'
];

for (let i = 0; i < cantidad; i++) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');

    // Propiedades aleatorias
    balloon.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.animationDuration = `${5 + Math.random() * 5}s`;
    balloon.style.width = `${30 + Math.random() * 40}px`;
    balloon.style.height = `${50 + Math.random() * 50}px`;

    balloonContainer.appendChild(balloon);

    // Eliminar el globo después de la animación
    balloon.addEventListener('animationend', () => {
        balloon.remove();
    });
}

// Eliminar el contenedor después de un tiempo
setTimeout(() => {
    balloonContainer.remove();
}, 10000);
}



