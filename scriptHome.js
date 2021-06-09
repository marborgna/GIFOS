//BARRA DE BUSQUEDA

var busquedas = function(callback){
    
    console.log("Hola, hubo un callback de busqueda");
}

let boton = document.getElementById('search');
boton.addEventListener("input", busquedas);




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


    }).catch(error => {
        console.log(error);
    });
};

function crearElementosGIFOS (listaUrls) {
    imagenes = document.getElementById('slider');
    for(idElement in listaUrls) {
        let unaUrl = listaUrls[idElement];
        addElement(unaUrl);
    }
}


function addElement (url) {
    let nuevoDiv = document.createElement("div");
    let nuevaImg = document.createElement("img");
    nuevoDiv.appendChild(nuevaImg);

    nuevaImg.setAttribute("src", url);

    let currentDiv = document.getElementById("slider");
    currentDiv.appendChild(nuevoDiv);
}

pedirGIFO();


//--->carousel

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
