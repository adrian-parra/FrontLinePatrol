const personnelData = {
    direct: 0,
    indirect: 0,
    administrative: 0
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
    esCumpleanos(esCumpleanos) {
        return esCumpleanos === "SI_CUMPLE";
    },
    // esCumpleanos(fechaCumpleanos) {
    //     const hoy = new Date();
    //     const [year, month, day] = fechaCumpleanos.split('-').map(Number);
    //     const cumpleanos = new Date(year, month - 1, day);

    //     return hoy.getMonth() === cumpleanos.getMonth() &&
    //         hoy.getDate() === cumpleanos.getDate();
    // },

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
    crearGlobos(cantidad = 50) {
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
            let datos  = {
                direct: Math.floor(Math.random() * 100),      // 0-100 empleados directos
                indirect: Math.floor(Math.random() * 50),     // 0-50 empleados indirectos
                administrative: Math.floor(Math.random() * 20)
            }
            //ChartManager.actualizarDatos(datos)
        }, 10000);
    }


};

//MODULO PARA MANEJAR GRAFICAS
const ChartManager = {
    chart: null,
    chartConfig: {
        type: 'bar',
        data: {
            labels: ['Personal Directo', 'Personal Indirecto', 'Administrativos'],
            datasets: [{
                label: 'Número de Empleados',
                data: [],
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
                    gradient.addColorStop(0, '#2575fc');
                    gradient.addColorStop(1, '#6a11cb');
                    return gradient;
                },
                borderColor: 'rgba(54, 162, 235, 1)',
                borderRadius: 7,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 300 // Reducir duración de animación
            },
            scales: {
                x: {
                    display: true,
                    ticks: {
                        color: backgroundColorApp,
                        font: { weight: 'bold', size: 14 }
                    }
                },
                y: {
                    display: true,
                    ticks: {
                        color: backgroundColorApp,
                        font: { weight: 'bold', size: 14 }
                    }
                }
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
                    backgroundColor: function (context) {
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
                    formatter: function (value) {
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
        }, plugins: [{
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, chart.width, 0);
                gradient.addColorStop(0, '#2575fc');
                gradient.addColorStop(1, '#6a11cb');

                chart.options.plugins.title.color = gradient;
            }
        }, ChartDataLabels]
    },

    inicializar() {
        const ctx = document.getElementById('personnelChart');
        if (ctx) {
            this.chart = new Chart(ctx, {
                ...this.chartConfig,
                data: {
                    ...this.chartConfig.data,
                    datasets: [{
                        ...this.chartConfig.data.datasets[0],
                        data: [
                            personnelData.direct,
                            personnelData.indirect,
                            personnelData.administrative
                        ]
                    }]
                }
            });
        }
    },

    actualizarDatos(nuevosDatos) {
        if (!this.chart) return;
    
        // Crear un array de objetos con etiquetas y valores
        const datosOrdenados = [
            { label: 'Personal Directo', value: nuevosDatos.direct },
            { label: 'Personal Indirecto', value: nuevosDatos.indirect },
            { label: 'Administrativos', value: nuevosDatos.administrative }
        ]
        // Ordenar de mayor a menor
        .sort((a, b) => b.value - a.value);
    
        // Actualizar datos y etiquetas
        this.chart.data.labels = datosOrdenados.map(item => item.label);
        this.chart.data.datasets[0].data = datosOrdenados.map(item => item.value);
    
        this.chart.update('none'); // Actualización sin animación
    },

    limpiar() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
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

    async manejarEntrada(event) {
        console.log("entrooo");
        if (event.key !== 'Enter') return;

        event.preventDefault();
        const inputValue = this.elementoInput.value.trim();

        if (!inputValue) return;

        const empleado = await this.buscarEmpleado(inputValue);

        if (!empleado) {
            this.elementoInput.value = '';
            this.mostrarMensajeError();
            return;
        }

        this.mostrarInformacionEmpleado(empleado);
        empleado.cumpleaños = "SI_CUMPLE";
        this.verificarCumpleanos(empleado);
        this.elementoInput.value = '';
    },

   async buscarEmpleado(numeroReloj) {
       try {
           const response = await fetch(`/Employee/GetEmployeeInfo?employeeId=${numeroReloj}`, {
               method: 'GET',
               headers: {
                   'Accept': 'application/json'
               }
           });
   
           if (!response.ok) {
               throw new Error('Error en la solicitud');
           }
   
           const data = await response.json();
           console.log(data);
           return data;
       } catch (error) {
           console.error('Error:', error);
           return null;
       }
   },

    mostrarInformacionEmpleado(empleado) {
        console.log("empleadoooo ",empleado);
        if (this.elementoDisplay) {
            this.elementoDisplay.innerHTML = `
           <div class="nombre-empleado-checador">
               ${empleado.nombreCompleto}
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
                   transition: opacity 0.5s ease-out;
               }

               @keyframes fadeOut {
                   from { opacity: 1; }
                   to { opacity: 0; }
               }

               .nombre-empleado-checador.fade-out {
                   animation: fadeOut 0.5s ease-out forwards;
               }
           `;
                document.head.appendChild(style);
            }

            // Limpiar el display con animación después de 10 segundos
            setTimeout(() => {
                if (this.elementoDisplay) {
                    const nombreEmpleadoElement = this.elementoDisplay.querySelector('.nombre-empleado-checador');
                    if (nombreEmpleadoElement) {
                        nombreEmpleadoElement.classList.add('fade-out');
                        
                        // Eliminar el elemento después de la animación
                        setTimeout(() => {
                            this.elementoDisplay.innerHTML = '';
                        }, 500); // Coincide con la duración de la animación
                    }
                }
            }, 10000);
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
        if (!Utilidades.esCumpleanos(empleado.cumpleaños)) return;

        // Agregar al array de cumpleaños en lugar de mostrar inmediatamente
        const edad = Utilidades.calcularEdad(empleado.cumpleaños);
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
    }, mostrarCumpleanosActual() {
        if (this.cumpleanosList.length === 0) return;

        const cumpleano = this.cumpleanosList[this.currentCarouselIndex];

        // Agregar log de depuración
        console.log('Mostrando cumpleaños:', cumpleano);

        this.elementoCumpleanos.innerHTML = `
            <div class="cumpleanos-carrusel" id="cumpleanos-carrusel-container">
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
                                Celebrando su día especial
                            </div>
                        </div>
                    </div>
                    ${this.cumpleanosList.length > 1 ? this.generarIndicadores() : ''}
                </div>
            </div>
        `;

        this.agregarEstilosCumpleanos();

        // Lanzar animación de globos
        Utilidades.crearGlobos();

        // Agregar estilos de desvanecimiento si no existen
        const styleId = 'cumpleanos-fade-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.9); }
                }

                .cumpleanos-fade-out {
                    animation: fadeOut 0.5s ease-out forwards;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        }

        // Ocultar después de 10 segundos
        setTimeout(() => {
            try {
                const carruselElemento = document.getElementById('cumpleanos-carrusel-container');
                
                if (carruselElemento) {
                    console.log('Iniciando desvanecimiento de cumpleaños');
                    carruselElemento.classList.add('cumpleanos-fade-out');
                    
                    // Limpiar el contenido después de la animación
                    setTimeout(() => {
                        console.log('Limpiando contenido de cumpleaños');
                        if (this.elementoCumpleanos) {
                            this.elementoCumpleanos.innerHTML = '';
                            
                            // Eliminar el cumpleaños actual del array
                            this.cumpleanosList.splice(this.currentCarouselIndex, 1);
                            
                            // Detener el intervalo si no quedan cumpleaños
                            if (this.cumpleanosList.length === 0) {
                                if (this.carouselInterval) {
                                    clearInterval(this.carouselInterval);
                                }
                                return;
                            }
                            
                            // Ajustar el índice si es necesario
                            if (this.currentCarouselIndex >= this.cumpleanosList.length) {
                                this.currentCarouselIndex = 0;
                            }
                            
                            // Mostrar el siguiente cumpleaños
                            this.mostrarCumpleanosActual();
                        }
                    }, 500);
                } else {
                    console.error('No se encontró el elemento de cumpleaños');
                }
            } catch (error) {
                console.error('Error al ocultar cumpleaños:', error);
            }
        }, 10000);
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


// Función para crear toast de notificación
function mostrarToast(mensaje, tipo) {
    // Eliminar toasts previos
    const toastExistente = document.getElementById('connection-toast');
    if (toastExistente) toastExistente.remove();

    const toast = document.createElement('div');
    toast.id = 'connection-toast';
    toast.classList.add('toast', `toast-${tipo}`);
    toast.innerHTML = `
        <div class="toast-icon">
            ${tipo === 'offline' ? '🚫' : '✅'}
        </div>
        <div class="toast-message">${mensaje}</div>
    `;

    document.body.appendChild(toast);

    // Animación de entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Si es offline, no lo ocultes
    if (tipo === 'online') {
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}


// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    Reloj.iniciar();
    GestorEmpleados.iniciar();
    ChartManager.inicializar();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        ChartManager.limpiar();
    } else {
        ChartManager.inicializar();
    }
});

window.addEventListener('offline', () => {
    ChartManager.limpiar();
    mostrarToast('Sin conexión a internet', 'offline');
});

window.addEventListener('online', () => {
    ChartManager.inicializar();
    mostrarToast('Con conexión a internet', 'online');
});
