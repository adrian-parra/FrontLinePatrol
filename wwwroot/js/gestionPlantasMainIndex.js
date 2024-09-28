



import { obtenerEquiposComputo } from "./gestionPlantasIndex.js";
import {restartDeviceWmi} from "./cmdIndex.js"

 




document.addEventListener("DOMContentLoaded", async () => {

   await obtenerEquiposComputo()

   $("#equiposTable").DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json",
      },
      columnDefs: [
        {
          targets: 0,
          visible: true,
        },
      ],
      //_______________ CUARTO ______________
      dom: "Bfrtip",
      buttons: [
        //'excel',
        {
          extend: "excelHtml5",
          text: "Exportar Excel",
          filename: "Reporte Empleados",
          title: "",
          exportOptions: {
            columns: [1, 2, 3, 4, 5],
          },
          className: "btn-exportar-excel",
        },
        //'pdf',
        {
          extend: "pdfHtml5",
          text: "Exportar PDF",
          filename: "Reporte de equipo de",
          title: "",
          exportOptions: {
            columns: [1, 2, 3, 4, 5],    
          },
          className: "btn-exportar-pdf",
        },
        //'print'
        {
          extend: "print",
          title: "",
          exportOptions: {
            columns: [1, 2, 3, 4, 5],
          },
          className: "btn-exportar-print",
        },
        //extra
        "pageLength",
      ],
    });


    document.querySelector(".container-items").addEventListener('click', async (e) => {
      const target = e.target;
      console.log(target);

      if(target.id === "cerrarApp"){
         const parent = target.parentNode.parentNode
         console.log(parent)

         const hostname = parent.querySelector("#hostname")

        
      }

      if(target.id === "reiniciarEquipo"){
        const parent = target.parentNode.parentNode
        console.log(parent)

        const hostname = parent.querySelector("#hostname")

        const dataForm = new FormData();
        dataForm.append("ip", hostname.textContent)
       await restartDeviceWmi(dataForm)
      
      }
  });

});