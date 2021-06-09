
//LLamo los elementos con los que voy a trabajar
const slider = document.querySelector("#slider");
let sliderSection = document.querySelectorAll(".slider-section");
let sliderSectionLast = sliderSection[sliderSection.length -1];

const btnLeft = document.querySelector("#btn-left");
const btnRight = document.querySelector("#btn-right");

//pondre el ultimo elemnto al inicio con metodo insert
slider.insertAdjacentElement('afterbegin', sliderSectionLast);

//funciones movimiento izq y derec
//derecha
function next() {
    let sliderSectionFirst = document.querySelectorAll(".slider-section")[0];
    slider.style.marginLeft = "-200%";
    slider.style.transition = "all 0.5s"; //tarda 0.5 en mvoer
    setTimeout(function() {
        slider.style.transition = "none";
        slider.insertAdjacentElement('beforeend', sliderSectionFirst); //antes de terminar
    }, 500); //medio segundo
}

btnRight.addEventListener('click', function() {
    next();
});

//izquierda
function prev() {
    let sliderSection = document.querySelectorAll(".slider-section");
    let sliderSectionLast = sliderSection[sliderSection.length -1];
    slider.style.marginLeft = "0%";
    slider.style.transition = "all 0.5s"; //tarda 0.5 en mvoer
    setTimeout(function() {
        slider.style.transition = "none";
        slider.insertAdjacentElement('afterend', sliderSectionLast); //despues de terminar
        slider.style.marginLeft= "-100%";
    }, 500); //medio segundo
}

btnLeft.addEventListener('click', function() {
    prev();
});

//hacerlo AUTOMATICO

setInterval(function() {
    next();
}, 5000); //cada cinco segundos se va a mover  la derecha