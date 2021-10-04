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


function pedirTrendingSearchTerms() {
    async function getInfo() {
        let url = `https://api.giphy.com/v1/trending/searches?api_key=${apiKeyGIPHY}`;
        const resp = await fetch(url);
        const info = await resp.json();
        return info;
    }

    var response;
    var listaTrending = [];
    var listaUrl = [];
    var palabrasSugeridas = document.getElementsByClassName("sugerencia");

    let info = getInfo();
    info.then(response => {
        console.log(response);

        for (var element in response.data) {
            console.log(response.data[element]);
            listaTrending.push(response.data[element]);
            var elementCaptured = response.data[element].replaceAll(" ", "-");
            listaUrl.push("https://giphy.com/search/" + elementCaptured); //DIRECCIONA A LINKD E CADA ELEMENTO
        }
    
        console.log(listaTrending.length);

        for (var i = 0; i < listaTrending.length; i++) {
            palabrasSugeridas[i].setAttribute("href", listaUrl[i]);
            
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




