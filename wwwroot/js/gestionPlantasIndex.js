// export const obtenerEquiposComputo = async () =>{
//     const response = await fetch("/GestionPlantas/ObtenerEquiposComputo")

//     const data = await response.json()
//     console.log(data)

//     // Get the table body element
//     const tableBody = document.getElementById('equiposTable').getElementsByTagName('tbody')[0];

//     // Iterate over the data and create table rows
//     data.forEach(equipo => {
//       // Extract software names
//       const softwareNames = equipo.equiposComputoSoftware.map(s => s.software.nombre).join(', ');

//       // Find the linea object within the lineas array
//       const lineaData = equipo.lineas[0]; // Assuming there's always one linea

//       // Create a new row
//       const row = tableBody.insertRow();
//       row.insertCell().textContent = equipo.id;
//       row.insertCell().textContent = lineaData.linea.planta.nombre;
//       row.insertCell().textContent = lineaData.linea.nombre;
//       row.insertCell().textContent = lineaData.estacion.nombre;
//       row.insertCell().textContent = equipo.hostname;
//       row.insertCell().textContent = softwareNames;
//     });
// }

import { $ } from "/js/utils.js";



export const obtenerEquiposComputo = async () =>{



       $('.container-loading').style = 'display:flex;'

    const response = await fetch("/GestionPlantas/ObtenerEquiposComputo")

    const data = await response.json()
    console.log(data)

    $(".container-items").innerHTML = `
    <table id="equiposTable" class="table">
    <thead class="table-header">
      <tr>
        <th>ID</th>
        <th>Planta</th>
        <th>Línea</th>
        <th>Estación</th>
         <th>Hostname</th>
        <th>Software</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody class="items-table">
    </tbody>
  </table>
    `;

    data.forEach(equipo => {
        const softwareNames = equipo.equiposComputoSoftware.map(s => s.software.nombre).join(', ');
        const lineaData = equipo.lineas[0];

        $(".items-table").innerHTML += `
        <tr>
          <td>${equipo.id}</td>
          <td>${lineaData.linea.planta.nombre}</td>
          <td>${lineaData.linea.nombre}</td>
          <td>${lineaData.estacion.nombre}</td>
          <td id="hostname">${equipo.hostname}</td>
          <td>${softwareNames}</td>
          <td>
            <button class="btn btn-warning" id="cerrarApp">Cerrar app</button>
            <button class="btn btn-warning" id="reiniciarEquipo">Reiniciar equipo</button>
          </td >
        </tr>
        `
    })

       $('.container-loading').style = 'display:none;'

}