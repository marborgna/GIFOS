// NAV sticky

window.onscroll = function() {stickyNav()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function stickyNav() {
  if (window.pageYOffset > sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}


//DARK MODE

let btnSwitch = document.getElementById('switch');

btnSwitch.addEventListener('click', () =>{
    document.body.classList.toggle('dark');
    btnSwitch.classList.toggle('active');

    if (document.body.classList == 'dark') {
        btnSwitch.innerHTML="Modo Diurno";
    } else {
        btnSwitch.innerHTML="Modo Nocturno";
    }
    
});




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

        registrarBotonFav();

        registrarBotonExpandir();

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
    let nuevoHover = document.createElement("div");
    let nuevaImg = document.createElement("img");
    nuevoDiv.appendChild(nuevaImg);
    nuevoDiv.appendChild(nuevoHover);

    nuevoHover.classList.add("fondoHover");

    nuevaImg.setAttribute("src", url);

    let currentDiv = document.getElementById("slider");
    currentDiv.appendChild(nuevoDiv);
    nuevoDiv.classList.add("slider-section");

    let botonFav = document.createElement("div");
    let botonDesc = document.createElement("div");
    let botonExpan = document.createElement("div");

    nuevoHover.appendChild(botonFav);
    botonFav.classList.add("boton-favorito");
    botonFav.dataset['urlImg'] = url;

    nuevoHover.appendChild(botonDesc);
    botonDesc.classList.add("boton-descarga");

    nuevoHover.appendChild(botonExpan);
    botonExpan.classList.add("boton-expandir");
    botonExpan.dataset['urlImg'] = url;
    
}

//HAY QUE AGREGAR #myBtn a botonExpan para que funcione el modal
pedirGIFO();



// SLIDER

var posicionSlider = 0;


function inicioSlider() {
    slider = document.getElementById('slider');
    var cantidadImagenes = slider.childElementCount;  
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
    segundaImagen = slider.children[1];
    let compStyle = window.getComputedStyle(segundaImagen);
    let valorTotalAnchoImagen = parseFloat(compStyle.marginLeft) + parseFloat(compStyle.width);
    let nuevoMargin =  posicionSlider * -valorTotalAnchoImagen; 
    
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


//TERMINAR --->




// MODAL

var modal = document.getElementsByClassName('modal')[0];

var cerrar = document.getElementsByClassName('cerrar')[0];




cerrar.onclick = function() {
    modal.style.display = "none";
    var stickyBar = document.getElementsByClassName('navbar')[0];
    stickyBar.style.display = "inline";
}

function registrarBotonExpandir () {
    var botonExpandir = document.getElementsByClassName('boton-expandir');

    for (var i = 0; i < botonExpandir.length; ++i) {

        var expandir = botonExpandir[i];
        expandir.addEventListener('click', function() {
            let valorURLImg = this.dataset['urlImg'];
            abrirModal(valorURLImg);
        })
    }
}


function abrirModal(urlImg) {
    var modal = document.getElementsByClassName('modal')[0];

    modal.style.display = "block";
    var stickyBar = document.getElementsByClassName('navbar')[0];
    stickyBar.style.display = "none";

    var imgModal = document.getElementById('img-modal');
    imgModal.setAttribute('src', urlImg);
}


// LOCAL STORAGE

function registrarBotonFav() {
    botonFav = document.querySelectorAll(".boton-favorito");

    for (var i = 0; i < botonFav.length; i++) {
        
        var fav = botonFav[i];
        fav.addEventListener('click', function() {
            // <div data-urlImg='http://giphy.com/…'></div>
            let valorURLImg = this.dataset['urlImg'];
            agregarFavorito(valorURLImg);
        });
    }
}

function agregarFavorito(urlImg) {
    var listaImg = cargarFavoritos();
    listaImg.push(urlImg);
    guardarFavoritos(listaImg);
}

function cargarFavoritos() {
    var listaImg = window.localStorage.getItem('favoritos');
    if (listaImg == null) {
        listaImg = [];
    } else {
        listaImg = JSON.parse(listaImg);
    }
    return listaImg;
}

function guardarFavoritos(lista) {
    window.localStorage.setItem('favoritos', JSON.stringify(lista));
}

