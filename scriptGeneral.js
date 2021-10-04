// NAV sticky

window.onscroll = function() {stickyNav()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function stickyNav() {
    var navbar = document.getElementById("navbar");
    if (window.pageYOffset > sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}


var imagenes = {};

// LOCAL STORAGE
//FAVORITOS

function cargarFavoritos() {
    let listIds = window.localStorage.getItem('favoritos');
    if (listIds == null) {
        listIds = [];
    } else {
        listIds = JSON.parse(listIds);
    }
    return listIds;
}

function esFavorito(idImg) {  
    let listaIds = cargarFavoritos();
    let estaEnFavoritos = listaIds.includes(idImg);
    return estaEnFavoritos; 
}
    
function agregarFavorito(idImg) {
    let listaIds = cargarFavoritos();
    if(!esFavorito(idImg)) {
        listaIds.push(idImg);
    }
    guardarFavoritos(listaIds);
}

function removerFavorito(idImg) {
    let listaIds = cargarFavoritos();
    listaIds = listaIds.filter(f => f != idImg);
    guardarFavoritos(listaIds);
}

function guardarFavoritos(lista) {
    window.localStorage.setItem('favoritos', JSON.stringify(lista));
}

// MIS GIFS

function cargarGifs() {
    let listIds = window.localStorage.getItem('misGifs');
    if (listIds == null) {
        listIds = [];
    } else {
        listIds = JSON.parse(listIds);
    }
    return listIds;
}

function esGifs(idImg) {  
    let listaIds = cargarGifs();
    let estaEnGifs = listaIds.includes(idImg);
    return estaEnGifs; 
}
    
function agregarGifs(idImg) {
    let listaIds = cargarGifs();
    if(!esGifs(idImg)) {
        listaIds.push(idImg);
    }
    guardarFavoritos(listaIds);
}

function removerGifs(idImg) {
    let listaIds = cargarGifs();
    listaIds = listaIds.filter(f => f != idImg);
    guardarGifs(listaIds);
}

function guardarGifs(lista) {
    window.localStorage.setItem('misGifs', JSON.stringify(lista));
}



function registrarBotonFav(container) {
    botonFav = container.querySelectorAll(".boton-favorito");

    for (var i = 0; i < botonFav.length; i++) {
        
        var fav = botonFav[i];
        fav.addEventListener('click', function() {
            // <div data-urlImg='http://giphy.com/…'></div>
            let valorIDImg = this.dataset['idImg'];
            if (esFavorito(valorIDImg)) {
                removerFavorito(valorIDImg);
                this.classList.remove('favoritos-active');
            } else {
                agregarFavorito(valorIDImg);
                this.classList.add('favoritos-active');
            }
        });
    }
}


//---> llamado API


let apiKeyGIPHY = "bdbs9mjKP9hSl2LbvfTBkpX2CDuOaHeR";

function getInfoImgSlider() {
    async function getTrending() {
        let url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKeyGIPHY}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    let info = getTrending();
    info.then(response =>{
        console.log("Respuesta imagenes trending", response);

        var listaIds = [];

        for(idGifo in response.data) {
            let gifo = response.data[idGifo];
            let urlDelElemento = gifo.images.original.url;
            let idDelElemento = gifo.id;
            listaIds.push(idDelElemento);
            let username = gifo.username;
            let title = gifo.title;
            insertarImagenSlider(urlDelElemento, idDelElemento);

            imagenes[idDelElemento] = {
                "username": username,
                "title": title,
                "url": urlDelElemento,
            };
        }

        inicioSlider();

        var container = document.getElementsByClassName('container-slider')[0];
        var modal = document.getElementsByClassName('modalSlider')[0];
        modal.listaIds = listaIds;
        modal.posicion = 0;

        registrarBotonFav(container);
        registrarBotonFav(modal);
        registrarBotonExpandir(modal, container);

    }).catch(error => {
        console.log(error);
    });
};


function insertarImagenSlider (url, id) {
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
    let botonDesc = document.createElement("a");
    let botonExpan = document.createElement("div");

    nuevoHover.appendChild(botonFav);
    botonFav.classList.add("boton-favorito");
    botonFav.dataset['idImg'] = id;
    if(esFavorito(id)) {
        botonFav.classList.add('favoritos-active');
    }

    nuevoHover.appendChild(botonDesc);
    botonDesc.classList.add("boton-descarga");
    botonDesc.setAttribute("href", id); 
    botonDesc.setAttribute("download", id + ".jpg");

    nuevoHover.appendChild(botonExpan);
    botonExpan.classList.add("boton-expandir");
    botonExpan.dataset['idImg'] = id;
    botonExpan.dataset['urlImg'] = url;
    
}





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
        if(posicionSlider < cantidadImagenes-6) {
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



// MODAL

function initModal() {
    var cerrar = document.getElementsByClassName('cerrar');
    for (var i = 0; i < cerrar.length; ++i) {
        cerrar[i].onclick = function() {
            var modal = this.closest(".modal");
            modal.style.display = "none";
            var stickyBar = document.getElementsByClassName('navbar')[0];
            stickyBar.style.display = "inline";
        }
    }
    
    botonRight = document.getElementsByClassName('modal-btn right');
    botonLeft = document.getElementsByClassName('modal-btn left');
    
    for (var i = 0; i < botonRight.length; ++i) {
        botonRight[i].onclick = function() {
            var modal = this.closest(".modal");
            if (modal.posicion < modal.listaIds.length-1) {
                modal.posicion++;
                let idImg = modal.listaIds[modal.posicion];
                mostrarImgSliderModal(modal, idImg);
            }
        }
    }
    
    for (var i = 0; i < botonLeft.length; ++i) {
        botonLeft[i].onclick = function() {
            var modal = this.closest(".modal");
            if (modal.posicion > 0) {
                modal.posicion--;
                let idImg = modal.listaIds[modal.posicion];
                mostrarImgSliderModal(modal, idImg);
            }
        }
    }
}

function registrarBotonExpandir (modal, container) {
    var botonExpandir = container.getElementsByClassName('boton-expandir');

    for (var i = 0; i < botonExpandir.length; ++i) {

        var expandir = botonExpandir[i];
        expandir.targetModal = modal;
        expandir.addEventListener('click', function() {
            let valorIDImg = this.dataset['idImg'];
            let modal = this.targetModal;
            abrirModal(modal, valorIDImg);
        })
    }
}


function abrirModal(modal, idImg) {
    modal.style.display = "block";
    var stickyBar = document.getElementsByClassName('navbar')[0];
    stickyBar.style.display = "none";

    modal.posicion = modal.listaIds.findIndex(id => id == idImg);

    mostrarImgSliderModal(modal, idImg);
}

function mostrarImgSliderModal(modal, idImg) {

    var imgModal = modal.getElementsByClassName('img-modal')[0];
    imgModal.setAttribute('src', imagenes[idImg].url);

    let usernameElem = modal.getElementsByClassName('user')[0];
    usernameElem.textContent = imagenes[idImg].username;

    let tituloElem = modal.getElementsByClassName('titulo-GIFO')[0];
    tituloElem.textContent = imagenes[idImg].title;

    if (imagenes[idImg].username == "") {
        usernameElem.textContent = "Usuario no encontrado";
    }

    let botonFav = modal.getElementsByClassName('boton-favorito')[0];
    botonFav.dataset['idImg'] = idImg;
    if(esFavorito(idImg)) {
        botonFav.classList.add('favoritos-active');
    } else {
        botonFav.classList.remove('favoritos-active');
    }
}
