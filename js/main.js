
var body = document.querySelector("body");
body.addEventListener("load", traerLibrosIntro());
body.addEventListener("load", traerCategorias());

function verCategorias(){
    var selectCategorias = document.getElementById("categorias");
    var valorBuscado = document.getElementById("valor-buscado");
    var indexSelect = document.getElementById("select").selectedIndex;

    if (indexSelect === 3){
        selectCategorias.style.display ="inline-block";
        valorBuscado.setAttribute("disabled","disabled");
        valorBuscado.value = "";
    }
    else{
        selectCategorias.style.display ="none";
        valorBuscado.removeAttribute("disabled"); 
    }

}

function traerCategorias(){
    fetch("https://www.etnassoft.com/api/v1/get/?get_categories=all")
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        var resultados = data;
        var seccion = document.getElementById("seccion");
        var selectCategorias = document.getElementById("categorias");

        resultados.forEach(categoria =>{
            var optionSelect = document.createElement("option");
            optionSelect.value = categoria.category_id;
            optionSelect.appendChild(document.createTextNode(categoria.name));
            selectCategorias.appendChild(optionSelect);
        })
    })
    .catch(function (error) {
        swal("Error", "La llamada a la API falló", "error");
    });
}

function traerLibrosIntro() {

    fetch("https://www.etnassoft.com/api/v1/get/?category_id=205")
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            var resultados = data;
            resultados.forEach(libro => {
                html = `
                <img src=${libro.thumbnail} alt="foto-libro">
                <h3> ${libro.title}</h3>
                <h3> Autor: ${libro.author}</h3>
                <p>${libro.content_short}</p>
                <h4>Fecha de publicacion: ${libro.publisher_date} - Total Pags: ${libro.pages}</h4>
                <a href="${libro.url_download}" target=_blank>Ir al enlace</a>              
                 `;

                var seccion = document.getElementById("seccion");
                var articulo = document.createElement("article");
                articulo.className = "articulo";
                articulo.innerHTML = html;
                seccion.appendChild(articulo);

            });
        })
        .catch(function (error) {
            swal("Error", "La llamada a la API falló", "error");
        });




    fetch("https://www.etnassoft.com/api/v1/get/?category_id=205&criteria=most_viewed&num_items=3")
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            var resultados = data;
            resultados.forEach(libro => {
                html = ` 
                <a href="${libro.url_download}" target=_blank><img src=${libro.thumbnail} alt="foto-libro"></a>
                <h4> ${libro.title}</h4>
                `;

                var aside = document.querySelector(".lateral");
                var thumb = document.createElement("div");
                thumb.className = "thumb";
                thumb.innerHTML = html;
                aside.appendChild(thumb);

            });
        })
        .catch(function (error) {
            swal("Error", "La llamada a la API falló", "error");
        });

}


function traerLibrosTodos() {
    url = "https://www.etnassoft.com/api/v1/get/?";
    var valorBuscado = document.getElementById("valor-buscado").value;
    var indexSelect = document.getElementById("select").selectedIndex;
    var indexSelectCategorias = document.getElementById("categorias").value;

    // 0 es todos los campos
    // 1 es titulo de libro
    // 2 es autor 
    // 3 es categoria

    if (valorBuscado === "" && indexSelect !== 3) {
        swal("Atención", "Por favor complete el campo de búsqueda", "warning");
    }
    else {
        if (indexSelect === 0) {
            url += 'any_tags=[' + valorBuscado + ']';
        }
        if (indexSelect === 1) {
            url += 'book_title=' + valorBuscado + '';
        }
        if (indexSelect === 2) {
            url += 'book_author=' + valorBuscado + '';
        }
        if (indexSelect === 3) {
            url += 'category_id=' + indexSelectCategorias + '';
        }

        fetch(url)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            //borro el contenido anterior de los articulos centrales y del lateral
            var articulos = Array.from(document.getElementsByClassName("articulo"));

            for (articulo in articulos) {
                articulos[articulo].remove();
            }

            //traigo los datos
            var resultados = data;

            //sino hay datos muestra un error
            if (data.length === 0) {
                swal("No hay libros que coincidan con los criterios de búsqueda especificados");
            }
            else{
                resultados.forEach(libro => {
                    html = `
                    <img src=${libro.thumbnail} alt="foto-libro">
                    <h3> ${libro.title}</h3>
                    <h3> Autor: ${libro.author}</h3>
                    <p>${libro.content_short}</p>
                    <h4>Fecha de publicacion: ${libro.publisher_date} - Total Pags: ${libro.pages}</h4>
                    <a href="${libro.url_download}" target=_blank>Ir al enlace</a>
                    `;

                    var seccion = document.getElementById("seccion");
                    var articulo = document.createElement("article");
                    articulo.className = "articulo";
                    articulo.innerHTML = html;
                    seccion.appendChild(articulo);

                });
            }


        })
        .catch(function (error) {
            swal("Error", "La llamada a la API falló", "error");
        });

    }

}

function traerLibrosDestacados() {
    url = "https://www.etnassoft.com/api/v1/get/?";
    var valorBuscado = document.getElementById("valor-buscado").value;
    var indexSelect = document.getElementById("select").selectedIndex;
    var categorias = document.getElementById("categorias");
    var indexSelectCategorias = document.getElementById("categorias").value;
    var nameSelectCategorias = categorias.options[categorias.selectedIndex].text;

    // 0 es todos los campos
    // 1 es titulo de libro
    // 2 es autor 
    // 3 es categoria

    if (valorBuscado === "" && indexSelect !== 3) {
        swal("Atención", "Por favor complete el campo de búsqueda", "warning");
    }
    else {
        if (indexSelect === 0) {
            url += 'any_tags=[' + valorBuscado + ']&num_items=3&criteria=most_viewed';
        }
        if (indexSelect === 1) {
            url += 'book_title=' + valorBuscado + '&num_items=3&criteria=most_viewed';
        }
        if (indexSelect === 2) {
            url += 'book_author=' + valorBuscado + '&num_items=3&criteria=most_viewed';
        }
        if (indexSelect === 3) {
            valorBuscado = nameSelectCategorias;
            url += 'category_id=' + indexSelectCategorias + '&num_items=3&criteria=most_viewed';
        }

        fetch(url)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            var resultados = data;
            var thumbs = Array.from(document.getElementsByClassName("thumb"));
            var titulo = document.getElementById("titulo");

            for (thumb in thumbs) {
                thumbs[thumb].remove();
            }

            if (data.length === 0) {
                titulo.textContent = "No se encontraron resultados";
            }
            else {
                titulo.textContent = "Libros Destacados de " + valorBuscado;
                resultados.forEach(libro => {
                    html = `   
                    <a href="${libro.url_download}" target=_blank><img src=${libro.thumbnail} alt="foto-libro"></a>
                    <h4> ${libro.title}</h4>          
                    `;

                    var aside = document.querySelector(".lateral");
                    var thumb = document.createElement("div");
                    thumb.className = "thumb";
                    thumb.innerHTML = html;
                    aside.appendChild(thumb);

                });
            }


        })
        .catch(function (error) {
            swal("Error", "La llamada a la API falló", "error");
        });

    }
}


function buscarLibros() {

    traerLibrosTodos();
    traerLibrosDestacados();
    
}