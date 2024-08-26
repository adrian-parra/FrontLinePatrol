const wrapper = document.getElementById("signature-pad");
const clearButton = wrapper.querySelector("[data-action=clear]");
//const changeColorButton = wrapper.querySelector("[data-action=change-color]");
const undoButton = wrapper.querySelector("[data-action=undo]");
const redoButton = wrapper.querySelector("[data-action=redo]");


const wrapperFirmaOperador = document.querySelector("#signature-pad-firma-operador")
const clearButtonFirmaOperador = wrapperFirmaOperador.querySelector("[data-action=clear]");
//const changeColorButton = wrapper.querySelector("[data-action=change-color]");
const undoButtonFirmaOperador = wrapperFirmaOperador.querySelector("[data-action=undo]");
const redoButtonFirmaOperador = wrapperFirmaOperador.querySelector("[data-action=redo]");


//const savePNGButton = wrapper.querySelector("[data-action=save-png]");
//const saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
//const saveSVGButton = wrapper.querySelector("[data-action=save-svg]");

const btnGuardarFirma = document.querySelector("#btnGuardarFirma");

let undoData = [];
let undoDataFirmaOperador = [];



// const canvas = wrapper.querySelector("canvas");
const canvas = document.querySelector("#canvasFirmaAuditor");
const canvasFirmaOperador = document.querySelector("#canvasFirmaOperador");

const signaturePad = new SignaturePad(canvas, {
  // It's Necessary to use an opaque color when saving image as JPEG;
  // this option can be omitted if only saving as PNG or SVG
  backgroundColor: "rgb(255, 255, 255)",
});

const signaturePadFirmaOperador = new SignaturePad(canvasFirmaOperador, {
  backgroundColor: "rgb(255, 255, 255)",
})

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  const ratio = Math.max(window.devicePixelRatio || 1, 1);

  // This part causes the canvas to be cleared
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);

  canvasFirmaOperador.width = canvasFirmaOperador.offsetWidth * ratio;
  canvasFirmaOperador.height = canvasFirmaOperador.offsetHeight * ratio;
  canvasFirmaOperador.getContext("2d").scale(ratio, ratio);

  // This library does not listen for canvas changes, so after the canvas is automatically
  // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
  // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
  // that the state of this library is consistent with visual state of the canvas, you
  // have to clear it manually.
  signaturePad.clear();
  signaturePadFirmaOperador.clear();
}

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = resizeCanvas;
resizeCanvas();

btnGuardarFirma.addEventListener("click", async () => {
  
});

function download(dataURL, filename) {
  const blob = dataURLToBlob(dataURL);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

signaturePad.addEventListener("endStroke", () => {
  // clear undoData when new data is added
  undoData = [];
});

signaturePadFirmaOperador.addEventListener("endStroke", () => {
  // clear undoData when new data is added
  undoDataFirmaOperador = [];
});



clearButton.addEventListener("click", () => {
  signaturePad.clear();
});

clearButtonFirmaOperador.addEventListener("click",()=>{
  signaturePadFirmaOperador.clear();
})

undoButton.addEventListener("click", () => {
  const data = signaturePad.toData();

  if (data && data.length > 0) {
    const removed = data.pop();
    undoData.push(removed);
    signaturePad.fromData(data);
  }
});

undoButtonFirmaOperador.addEventListener("click",()=>{
  const data = signaturePadFirmaOperador.toData();

  if (data && data.length > 0) {
    const removed = data.pop(); // remove the last dot or line
    undoDataFirmaOperador.push(removed)
    signaturePadFirmaOperador.fromData(data);
  }
})

redoButton.addEventListener("click", () => {
  if (undoData.length > 0) {
    const data = signaturePad.toData();
    data.push(undoData.pop());
    signaturePad.fromData(data);
  }
});

redoButtonFirmaOperador.addEventListener("click",()=>{
  if (undoDataFirmaOperador.length > 0) {
    const data = signaturePadFirmaOperador.toData();
    data.push(undoDataFirmaOperador.pop());
    signaturePadFirmaOperador.fromData(data);
  }
})

// ! SE DESHABILITO EN EL HTML
// changeColorButton.addEventListener("click", () => {
//   const r = Math.round(Math.random() * 255);
//   const g = Math.round(Math.random() * 255);
//   const b = Math.round(Math.random() * 255);
//   const color = "rgb(" + r + "," + g + "," + b +")";

//   signaturePad.penColor = color;
// });

// savePNGButton.addEventListener("click",async () => {
//   if (signaturePad.isEmpty()) {
//     alert("Pon tu firma!!!");
//   } else {

//     //$file = "upload/signature.png";
//    //const dataURL = signaturePad.toDataFile();

//   // console.log(dataURL)
//    const dataURL = signaturePad.toDataURL("image/png");

//    const blob =  dataURLToBlob(dataURL);

//    const file = new File([blob], 'firma.png', { type: 'image/png' });

//    const formData = new FormData();
//    formData.append('image', file);

// //    fetch('/Signature/SubirImagen', {
// //     method: 'POST',
// //     body: formData
// // })

// const datosResponse = await fetch('/Signature/SubirImagen', {
//   method: 'POST',
//   body: formData,
// });

// const datos = await datosResponse.text();

//    console.log(datos)

//    //console.log(dataURL)

//   //  const link = document.createElement('a');
//   //   link.href = dataURL;
//   //   link.download = 'firma.png'; // Nombre del archivo
//   //   document.body.appendChild(link);
//   //   link.click(); // Simula un clic en el enlace para iniciar la descarga
//   //   document.body.removeChild(link);
//    //download(file="upload", "signature.png");
//   }
// });

// saveJPGButton.addEventListener("click", () => {
//   if (signaturePad.isEmpty()) {
//     alert("Please provide a signature first.");
//   } else {
//     const dataURL = signaturePad.toDataURL("image/jpeg");
//     download(dataURL, "signature.jpg");
//   }
// });

// saveSVGButton.addEventListener("click", () => {
//   if (signaturePad.isEmpty()) {
//     alert("No esta firmado el documento.");
//   } else {
//     const dataURL = signaturePad.toDataURL('image/svg+xml');
//     download(dataURL, "signature.svg");
//   }
// });
