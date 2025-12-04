document.addEventListener("DOMContentLoaded", () => {
    const inputBuscador = document.querySelector(".buscador input");
    const tabs = document.querySelectorAll(".tab-categoria");
    const seccionCategoria = document.getElementById("seccion-categoria");

    const mensajeNoResultados = document.createElement("div");
    mensajeNoResultados.id = "mensaje-sin-resultados";
    mensajeNoResultados.innerText = "No se encontraron resultados";
    mensajeNoResultados.style = `
        text-align: center;
        padding: 40px;
        font-size: 28px;
        color: gray;
        display: none;
    `;
    seccionCategoria.appendChild(mensajeNoResultados);

    const aplicarFiltro = () => {
        const termino = inputBuscador.value.toLowerCase().trim();
        const articulos = document.querySelectorAll(".articulo-categoria");
        let hayResultados = false;

        if (termino.length < 3) {
            articulos.forEach(articulo => {
                articulo.style.display = "flex";
            });
            mensajeNoResultados.style.display = "none";
            return;
        }

        articulos.forEach(articulo => {
            const nombre = articulo.querySelector(".item-valor-nombre")?.innerText.toLowerCase() || "";
            const autor = articulo.querySelector(".item-valor-autor")?.innerText.toLowerCase() || "";
            const descripcion = articulo.querySelector(".item-valor-descripcion")?.innerText.toLowerCase() || "";

            if (nombre.includes(termino) || autor.includes(termino) || descripcion.includes(termino)) {
                articulo.style.display = "flex";
                hayResultados = true;
            } else {
                articulo.style.display = "none";
            }
        });


        mensajeNoResultados.style.display = hayResultados ? "none" : "block";
    };


    if (inputBuscador) {
        inputBuscador.addEventListener("input", aplicarFiltro);
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            setTimeout(() => {
                aplicarFiltro();
            }, 50);
        });
    });
});