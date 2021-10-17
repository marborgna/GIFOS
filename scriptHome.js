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


//BARRA BUSQUEDA

function askSearchSuggestions(inputBusqueda) {
    async function getSearch(inputBusqueda) {
        valueInput = inputBusqueda.value;

        let url = `https://api.giphy.com/v1/tags/related/${valueInput}?api_key=${apiKeyGIPHY}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    let info = getSearch(inputBusqueda);
    info.then(response => {
        console.log(response);
        listaSugerencias = inputBusqueda.parentNode.getElementsByClassName('lista-search')[0];
        listaSugerencias.textContent = '';
        
        if (response.data.length != 0){
            separador = inputBusqueda.parentNode.getElementsByClassName('separador-lista')[0];
            separador.style.display = "flex";
        } else {
            separador.style.display = "none";
        }


        for(indiceElement in response.data) {
            let element = response.data[indiceElement];
            let nameDelElemento = element.name;
            addUlSuggestions(listaSugerencias, inputBusqueda, nameDelElemento);
        }

    }).catch(error => {
        console.log(error);
    });



}

inputBusqueda = document.getElementsByClassName('search');
for (var i = 0; i < inputBusqueda.length; ++i) {
    inputBusqueda[i].addEventListener('input', (e) => {
        askSearchSuggestions(e.target);
    });
}

function addUlSuggestions(listaSugerencias, inputBusqueda, sugerencia) {
    let division = document.createElement('div'); //LO CREA CANTIDAD DE VECES COMO LI HAY
    let nuevaSugerencia = document.createElement('li');
    listaSugerencias.appendChild(division)
    listaSugerencias.appendChild(nuevaSugerencia);

    nuevaSugerencia.innerHTML = sugerencia;

    nuevaSugerencia.sugerencia = sugerencia;
    nuevaSugerencia.inputBusqueda = inputBusqueda;
    nuevaSugerencia.addEventListener('click', function() {
        this.inputBusqueda.textContent = this.sugerencia;
        buscar(this.sugerencia);
    })

    let img = document.createElement("img");
    img.src = "img/icon-search.svg";

    nuevaSugerencia.appendChild(img);
}


// Resultados

var busqueda = "";
var resultadosTraidos = 0;
var resultados = document.getElementsByClassName("resultados")[0];
var containerResultados = document.getElementsByClassName("container-resultados")[0];
var tituloResultados = document.getElementsByClassName("titulo-resultado")[0];
var verMas = document.getElementsByClassName("ver-mas")[0];
var contenidoVacio = document.getElementsByClassName("vacio")[0];

function buscar(palabra) {
    busqueda = palabra;
    resultadosTraidos = 0;
    tituloResultados.textContent = palabra;
    resultados.style.display = "flex";
    containerResultados.innerHTML = "";
    contenidoVacio.style.display = "none";
    
    buscarMas();
}

barraBusqueda = document.getElementsByClassName('barra');
for (var i = 0; i < barraBusqueda.length; ++i) {
    barraBusqueda[i].addEventListener('submit', (e) => {
        e.preventDefault();
        inputBusqueda = e.target.getElementsByClassName("search")[0];
        buscar(inputBusqueda.value);
    });
}

function buscarMas() {
    async function getRes() {
        let url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKeyGIPHY}&q=${busqueda}&limit=12&offset=${resultadosTraidos}`;
        const resp = await fetch(url);
        const info = await resp.json();
        resultadosTraidos += 12;
        return info;
    }

    let info = getRes();
    info.then(response =>{
        console.log("Respuesta busqueda resultados", response);

        if(response.data.length == 0 && resultadosTraidos == 12) {
            contenidoVacio.style.display = "flex";
        }
        if(response.data.length < 12) {
            verMas.style.display = "none";
        }

        var listaIds = [];

        for(idGifo in response.data) {
            let gifo = response.data[idGifo];
            let urlDelElemento = gifo.images.original.url;
            let idDelElemento = gifo.id;
            listaIds.push(idDelElemento);
            let username = gifo.username;
            let title = gifo.title;
            insertarImagenListaResultados(urlDelElemento, idDelElemento);

            imagenes[idDelElemento] = {
                "username": username,
                "title": title,
                "url": urlDelElemento,
            };
        }

        var container = document.getElementsByClassName('container-resultados')[0];
        var modal = document.getElementsByClassName('modalResultados')[0];
        modal.listaIds = listaIds;
        modal.posicion = 0;

        registrarBotonFav(container);
        registrarBotonFav(modal);
        registrarBotonExpandir(modal, container);

    }).catch(error => {
        console.log(error);
    });
}

function insertarImagenListaResultados(url, id) {
    let nuevoDiv = document.createElement("div");
    let nuevoHover = document.createElement("div");
    let nuevaImg = document.createElement("img");
    nuevoDiv.appendChild(nuevaImg);
    nuevoDiv.appendChild(nuevoHover);

    nuevoHover.classList.add("fondoHover");

    nuevaImg.setAttribute("src", url);

    let currentDiv = document.getElementsByClassName("container-resultados")[0];
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
    buscarMas();
})

// Trending endpoint


function pedirTrendingSearchTerms() {
    async function getInfo() {
        let url = `https://api.giphy.com/v1/trending/searches?api_key=${apiKeyGIPHY}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    var response;
    var listaTrending = [];
    var listaTags = [];
    var palabrasSugeridas = document.getElementsByClassName("sugerencia");

    let info = getInfo();
    info.then(response => {
        console.log(response);

        for (var element in response.data) {
            console.log(response.data[element]);
            listaTrending.push(response.data[element]);
            var elementCaptured = response.data[element];
            listaTags.push(elementCaptured);
        }
    
        console.log(listaTrending.length);

        for (var i = 0; i < listaTrending.length; i++) {
            palabrasSugeridas[i].tag = listaTags[i];
            palabrasSugeridas[i].addEventListener('click', function() {
                buscar(this.tag);
            })
            
            console.log(i);
            
            if(i == 4) { 
                palabrasSugeridas[i].innerHTML = listaTrending[i];
                break; 

            } else {
                palabrasSugeridas[i].innerHTML = listaTrending[i] + ",";
            }
        }

    }).catch(error => {
        console.log(error);
    });
   
    
    
}

pedirTrendingSearchTerms();

// SLIDER
getInfoImgSlider();

// MODAL 
initModal()




