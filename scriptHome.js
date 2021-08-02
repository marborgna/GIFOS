// NAV sticky

window.onscroll = function() {stickyNav()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function stickyNav() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
 //NO ADD Y SACA LA CLASS STICKY, LA DEJA SIEMPRE PueSTA


//---> llamado API
let apiKeyGIPHY = "bdbs9mjKP9hSl2LbvfTBkpX2CDuOaHeR";

function pedirGIFO() {
    async function getTrending() {
        let url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKeyGIPHY}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    let info = getTrending();
    info.then(response =>{
        console.log(response);

        // Lista con las urls de los gifos
        let listaURLSGIFOS = [];

        for(idGifo in response.data) {
            let gifo = response.data[idGifo];
            let urlDelElemento = gifo.images.original.url;
            listaURLSGIFOS.push(urlDelElemento);
        }

        crearElementosGIFOS(listaURLSGIFOS);

        inicioSlider();

    }).catch(error => {
        console.log(error);
    });
};

function crearElementosGIFOS (listaUrls) {
    imagenes = document.getElementById('slider');
    for(idElement in listaUrls) {
        let unaUrl = listaUrls[idElement];
        insertarImagenSlider(unaUrl);
    }
}


function insertarImagenSlider (url) {
    let nuevoDiv = document.createElement("div");
    let nuevaImg = document.createElement("img");
    nuevoDiv.appendChild(nuevaImg);

    nuevaImg.setAttribute("src", url);

    let currentDiv = document.getElementById("slider");
    currentDiv.appendChild(nuevoDiv);
    nuevoDiv.classList.add("slider-section");
}

pedirGIFO();



// Carousel

var posicionSlider = 0;


function inicioSlider() {
    var cantidadImagenes = slider.childElementCount;
    slider = document.getElementById('slider');
    botonLeft = document.getElementById('btn-left');
    botonRight = document.getElementById('btn-right');
    posicionarImgsSlider();
    
    botonLeft.addEventListener('click', () => {
        if(posicionSlider > 0) {
            posicionSlider = posicionSlider - 1;
        }
        posicionarImgsSlider();
    });
    botonRight.addEventListener('click',  () => {
        if(posicionSlider < cantidadImagenes) {
            posicionSlider = posicionSlider + 1;
        }
        posicionarImgsSlider();
    });

}

function posicionarImgsSlider() {
    let nuevoMargin =  posicionSlider * -275; // SI CAMBIO MARGEN EN CSS CAMBIO EL MARGEN DE ACA

    slider = document.getElementById('slider');
    primerImagen = slider.firstChild;
    primerImagen.style['margin-left'] = nuevoMargin + "px";
}




//BARRA BUSQUEDA

function askSearchSuggestions() {
    async function getSearch() {
        inputBusqueda = document.getElementById('search');
        valueInput = inputBusqueda.value;

        let url = `https://api.giphy.com/v1/tags/related/${valueInput}?api_key=${apiKeyGIPHY}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    let info = getSearch();
    info.then(response => {
        console.log(response);
        listaSugerencias = document.getElementById('lista-search');
        listaSugerencias.textContent = '';

        for(indiceElement in response.data) {
            let element = response.data[indiceElement];
            let nameDelElemento = element.name;
            addUlSuggestions(nameDelElemento);
        }
         

    }).catch(error => {
        console.log(error);
    });



}

inputBusqueda = document.getElementById('search');
inputBusqueda.addEventListener('input', askSearchSuggestions);

function addUlSuggestions(sugerencia) {
    listaSugerencias = document.getElementById('lista-search');
    let nuevaSugerencia = document.createElement('li');
    listaSugerencias.appendChild(nuevaSugerencia);

    nuevaSugerencia.innerHTML = sugerencia;

    let img = document.createElement("img");
    img.src = "img/icon-search.svg";

    nuevaSugerencia.appendChild(img);
}


// Trending endpoint

function pedirInfo() {
    async function getInfo() {
        let url = `https://api.giphy.com/v1/trending/searches?api_key=${apiKeyGIPHY}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    let info = getInfo();
    info.then(response => {
        console.log(response);
        palabrasSugeridas = document.getElementById("sugerencia");
    })
}