// LOCAL STORAGE

var favoritosTraidos = 0;
var verMas = document.getElementsByClassName("ver-mas")[0];
var contenidoVacio = document.getElementsByClassName("vacio")[0];

function checkearSiHayContenido() {
    if (cargarFavoritos().length == 0) {
        contenidoVacio.style.display = "flex"
        verMas.style.display = "none";
    } else {
        traerFavoritos();
    }
}

function traerFavoritos(urlImg) {

    async function getFavs() {
        var listaIds = cargarFavoritos();
        listaIds.slice(favoritosTraidos, favoritosTraidos+12);
        favoritosTraidos += 12;
        if(favoritosTraidos >= listaIds.length) {
            verMas.style.display = "none";
        }
        let ids = listaIds.join();
        let url = `https://api.giphy.com/v1/gifs?api_key=${apiKeyGIPHY}&ids=${ids}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    let info = getFavs();
    info.then(response =>{
        console.log("Respuesta imagenes favoritos", response);

        var listaIds = [];

        for(idGifo in response.data) {
            let gifo = response.data[idGifo];
            let urlDelElemento = gifo.images.original.url;
            let idDelElemento = gifo.id;
            listaIds.push(idDelElemento);
            let username = gifo.username;
            let title = gifo.title;
            insertarImagenListaFavs(urlDelElemento, idDelElemento);

            imagenes[idDelElemento] = {
                "username": username,
                "title": title,
                "url": urlDelElemento,
            };
        }

        var container = document.getElementsByClassName('container-favoritos')[0];
        var modal = document.getElementsByClassName('modalFavoritos')[0];
        modal.listaIds = listaIds;
        modal.posicion = 0;

        registrarBotonFav(container);
        registrarBotonFav(modal);
        registrarBotonExpandir(modal, container);

    }).catch(error => {
        console.log(error);
    });
}

function insertarImagenListaFavs(url, id) {
    let nuevoDiv = document.createElement("div");
    let nuevoHover = document.createElement("div");
    let nuevaImg = document.createElement("img");
    nuevoDiv.appendChild(nuevaImg);
    nuevoDiv.appendChild(nuevoHover);

    nuevoHover.classList.add("fondoHover");

    nuevaImg.setAttribute("src", url);

    let currentDiv = document.getElementsByClassName("container-favoritos")[0];
    currentDiv.appendChild(nuevoDiv);
    nuevoDiv.classList.add('img-favorito');

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

verMas.addEventListener('click', () => {
    traerFavoritos();
})



// SLIDER
getInfoImgSlider();

// MODAL 
initModal()

