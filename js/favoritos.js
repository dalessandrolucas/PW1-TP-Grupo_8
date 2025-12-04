import items from "../data/items.json" with { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-favoritos');
    const activeUserEmail = localStorage.getItem('usuarioActivoEmail');
    let storageKey = 'favoritos_invitado';
    let tituloUsuario = "Invitado";

    if (activeUserEmail) {
        storageKey = `favoritos_${activeUserEmail}`;
        tituloUsuario = activeUserEmail;
    }

    let listaIds = JSON.parse(localStorage.getItem(storageKey)) || [];

    function cargarFavoritos() {
        contenedor.innerHTML = "";

        if (listaIds.length === 0) {
            contenedor.innerHTML = `
                <div class='aviso-vacio'>
                    <p>No tienes autos guardados en favoritos (${activeUserEmail ? 'Tu cuenta' : 'Modo Invitado'}).</p>
                    <a href="../index.html" style="font-size: 1rem; color: #0b47d1; text-decoration: underline;">Ir al catálogo</a>
                </div>
            `;
            return;
        }

        const autosFavoritos = items.filter(auto => listaIds.includes(auto.Id));

        autosFavoritos.forEach(auto => {
            const valorRating = parseInt(auto.Rating);
            const estrellas = '★'.repeat(valorRating) + '☆'.repeat(5 - valorRating);

            const tarjeta = document.createElement('article');
            tarjeta.classList.add('articulo-categoria');
            tarjeta.id = auto.Id;
            tarjeta.innerHTML = `
                <header class="header-articulo">
                   <i class="fa-solid fa-star icono-fav" id="btn-${auto.Id}" style="cursor:pointer; font-size: 1.5rem; float: right; margin: 10px; color: gold;"></i>
                   
                   <p class="item-valor-nombre" style="font-weight:bold; text-transform:uppercase; font-size: 1.1rem; margin-bottom: 5px;">${auto.Nombre}</p>
                   
                   <p class="item-valor-autor" style="font-weight:bold; font-size: 0.9rem; margin-bottom: 10px;">${auto.Autor}</p>
                   
                   <img class="item-valor-portada" src="${auto.Portada}" alt="${auto.Nombre}">
                   
                   <p class="item-valor-descripcion" style="margin-top: 10px;">${auto.Descripcion}</p>
                   
                   <p class="item-valor-rating" style="margin-top: 5px;">Rating: ${estrellas}</p>
                </header>
                
                <div class="detalle-articulo">
                    ${Object.keys(auto).filter(key => key.startsWith("personalizado_")).map(key => `
                        <h4 style="color: white; margin-bottom: 2px;">${key.split(".")[1]}</h4>
                        <p style="color:white; margin-bottom: 8px;">${auto[key]}</p>
                    `).join('')}
                </div>
            `;

            contenedor.appendChild(tarjeta);
            const btnEstrella = tarjeta.querySelector('.icono-fav');
            btnEstrella.addEventListener('click', () => {
                if (confirm("¿Sacar de favoritos?")) {
                    listaIds = listaIds.filter(id => id !== auto.Id);
                    localStorage.setItem(storageKey, JSON.stringify(listaIds));
                    cargarFavoritos();
                }
            });
        });

        agregarEventosTarjetas();
    }

    const agregarEventosTarjetas = () => {
        const tarjetas = document.querySelectorAll(".articulo-categoria");
        tarjetas.forEach((articulo) => {
            articulo.addEventListener("click", (e) => {
                if (e.target.classList.contains('icono-fav')) return;
                tarjetas.forEach(a => a.classList.remove("active"));
                articulo.classList.add("active");
            });
            articulo.addEventListener("mouseleave", () => {
                articulo.classList.remove("active");
            });
        });
    };
    cargarFavoritos();
});