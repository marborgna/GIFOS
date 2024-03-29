// CAMARA

var cuadro = document.getElementsByClassName('main-cuadro')[0];
var fondoHover = document.getElementsByClassName('fondoHover')[0];
var titulo = document.getElementById('titulo');
var texto = document.getElementById('texto');
var video = document.getElementById('video');
var uno = document.getElementById('uno');
var dos = document.getElementById('dos');
var tres = document.getElementById('tres');
var botonComenzar = document.getElementsByClassName('comenzar')[0];
var botonGrabar = document.getElementsByClassName('grabar')[0];
var botonFinalizar = document.getElementsByClassName('finalizar')[0];
var botonSubir = document.getElementsByClassName('subir')[0];
var botonRepetir = document.getElementsByClassName('repetir')[0];
var contador = document.getElementsByClassName('contador')[0];
var imgCarga = document.getElementsByClassName('img-carga')[0];
var imgListo = document.getElementsByClassName('img-listo')[0];
var acceso = document.getElementsByClassName('acceso')[0];


var stream;
var recorder;

var segundosContador;
var intervaloContador;


function botonesFinal(id) {
   let url = "https://giphy.com/gifs/" + id

   let contenedorBotonesTerminados = document.createElement("div");
   contenedorBotonesTerminados.classList.add('contenedor-botones');
   cuadro.appendChild(contenedorBotonesTerminados);

   let botonDescarga = document.createElement("div");
   botonDescarga.classList.add('boton-descarga');
   botonDescarga.setAttribute("href", url); 
   botonDescarga.setAttribute("download", id + ".jpg");
   contenedorBotonesTerminados.appendChild(botonDescarga);
   botonDescarga.url = "GIFO";
   
   let botonCopiar = document.createElement("div");
   botonCopiar.classList.add('boton-copiar');
   botonCopiar.dataset['idImg'] = id;
   botonCopiar.dataset['urlImg'] = url;
   contenedorBotonesTerminados.appendChild(botonCopiar);


   botonCopiar.addEventListener('click', (e) => {
      navigator.clipboard.writeText(e.target.dataset['urlImg']);
   })
}







function getStream () { 
   navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
         height: { max: 480 }
      }
   }).then(function(str) {
      stream = str;
      video.style.display = "block";
      video.srcObject = stream;
      video.play()
      

      titulo.style.display = "none";
      texto.style.display = "none";
      uno.classList.remove('seleccionado');
      dos.classList.add('seleccionado');

      botonGrabar.style.display = "flex";
   }) 
}


botonComenzar.addEventListener('click', () => {
    botonComenzar.style.display = "none";
    titulo.textContent = "¿Nos das acceso a tu cámara?";
    texto.textContent = "El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.";
    titulo.classList.add("acceso");
    texto.classList.add("acceso");
    uno.classList.add('seleccionado');
    getStream();
})


function crearRecorder() {
    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
         console.log('started')
       },
    });
    return recorder;
}

botonGrabar.addEventListener('click', () => {
    recorder = crearRecorder();
    recorder.startRecording();
    botonFinalizar.style.display = "flex";
    botonGrabar.style.display = "none";
    empezarContador();
})

botonFinalizar.addEventListener('click', () => {
    botonFinalizar.style.display = "none";
    recorder.stopRecording(() => {
      console.log("stopped");
      botonSubir.style.display = "flex";
      botonRepetir.style.display = "block";
      detenerContador();
   }); 
})

botonSubir.addEventListener('click', () => {
   botonSubir.style.display = "none";
   uploadGif();   //CUANDO ESTE BIEN SACAR COMENTARIO
   tres.classList.add("seleccionado");
   dos.classList.remove("seleccionado");
   texto.style.display = "flex";
   texto.textContent = "Estamos subiendo tu GIFO";
   imgCarga.style.display = "flex";
   fondoHover.classList.add("fondo-acceso"); 
})

function uploadGif() {
   let blob = recorder.getBlob();
   let form = new FormData();
   form.append('file', blob, 'myGif.gif');
   form.append("api_key", apiKeyGIPHY);
   console.log(form.get('file'))

   var request = new XMLHttpRequest();
   request.open("POST", "https://upload.giphy.com/v1/gifs");
   request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
            let response = JSON.parse(request.response);
            console.log("Respuesta giphy", response);

            let idImg = response.data.id;
            agregarGifs(idImg); 

            imgListo.style.display = "flex";
            imgCarga.style.display = "none";
            texto.textContent = "GIFO subido con éxito";

            botonesFinal(idImg);
            
            //TERMINO DE SUBIR
        }
    }
    request.send(form);
}

botonRepetir.addEventListener('click', () => {
   botonRepetir.style.display = "none";
   botonSubir.style.display = "none";
   botonFinalizar.style.display = "flex";
   recorder.reset();
   recorder.startRecording();
   empezarContador();
})

function empezarContador() {
   segundosContador = 0;
   contador.textContent = "00:00:00";
   contador.style.display = "flex";
   intervaloContador = setInterval(avanzarContador, 1000);
}

function detenerContador() {
   contador.style.display = "none";
   clearInterval(intervaloContador);
}

function avanzarContador() {
   segundosContador++;
   let segs = (segundosContador % 60).toString();
   let mins = (Math.floor(segundosContador / 60) % 60).toString();
   let horas = (Math.floor(Math.floor(segundosContador / 60) / 60)).toString();
   contador.textContent = horas.padStart(2,"0") + ":" + mins.padStart(2,"0") + ":" + segs.padStart(2,"0");
}