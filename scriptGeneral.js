// LOCAL STORAGE

function cargarFavoritos() {
    var listaImg = window.localStorage.getItem('favoritos');
    if (listaImg == null) {
        listaImg = [];
    } else {
        listaImg = JSON.parse(listaImg);
    }
    return listaImg;
}

function agregarFavorito(urlImg) {
    var listaImg = cargarFavoritos();
    listaImg.push(urlImg);
    guardarFavoritos(listaImg);
}

function guardarFavoritos(lista) {
    window.localStorage.setItem('favoritos', JSON.stringify(lista));
}

let url = `https://api.giphy.com/v1/trending/searches?api_key=${apiKeyGIPHY}?gif_id=${}`;