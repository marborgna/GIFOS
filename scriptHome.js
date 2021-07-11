//--SLIDER--//

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


//--->carousel

function inicioSlider() {
    let slider = document.querySelector("#slider");
    let sliderSection = document.querySelectorAll(".slider-section");
    let sliderSectionLast = sliderSection[sliderSection.length -1];

    const btnLeft = document.querySelector("#btn-left");
    const btnRight = document.querySelector("#btn-right");

    slider.insertAdjacentElement('afterbegin', sliderSectionLast);

    //boton derecha
    function next() {
        let sliderSectionFirst = document.querySelectorAll(".slider-section")[0];
        slider.style.marginLeft = "-200%";
        slider.style.transition = "all 0.5s"; 
        setTimeout(function() {
            slider.style.transition = "none";
            slider.insertAdjacentElement('beforeend', sliderSectionFirst); 
        }, 500);
    }

    btnRight.addEventListener('click', function() {
        next();
    });

    //boton izquierda
    function prev() {
        let sliderSection = document.querySelectorAll(".slider-section");
        let sliderSectionLast = sliderSection[sliderSection.length -1];
        slider.style.marginLeft = "0%";
        slider.style.transition = "all 0.5s"; 
        setTimeout(function() {
            slider.style.transition = "none";
            slider.insertAdjacentElement('afterend', sliderSectionLast); 
            slider.style.marginLeft= "-100%";
        }, 500); 
    }

    btnLeft.addEventListener('click', function() {
        prev();
    });

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
}
