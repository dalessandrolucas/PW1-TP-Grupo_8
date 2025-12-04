import items from "../data/items.json" with { type: 'json' };
import configuracion from "../config/configuracion.json" with { type: 'json' };

const tabCategoria1 = document.getElementById("tab-categoria-1");
let linksCategorias = document.querySelectorAll("a.tab-categoria");

// =========================================================
//                  LÓGICA DE FAVORITOS
// =========================================================
const toggleFavorito = (idAuto, icono) => {
   const emailActivo = localStorage.getItem('usuarioActivoEmail');
   const storageKey = `favoritos_${emailActivo}`;

   let favoritos = JSON.parse(localStorage.getItem(storageKey)) || [];

   if (favoritos.includes(idAuto)) {
      favoritos = favoritos.filter(id => id !== idAuto);
      icono.classList.remove('fa-solid');
      icono.classList.add('fa-regular');
      icono.style.color = "white";
   } else {
      favoritos.push(idAuto);
      icono.classList.remove('fa-regular');
      icono.classList.add('fa-solid');
      icono.style.color = "gold";
   }

   localStorage.setItem(storageKey, JSON.stringify(favoritos));
};

document.querySelectorAll('.btn-favorito').forEach(btn => {
   btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const isSessionActive = localStorage.getItem('sesionActiva') === 'true';

      if (!isSessionActive) {
         alert("Debes iniciar sesión para agregar vehículos a favoritos.");
         window.location.href = 'html/login.html';
         return;
      }

      const articuloPadre = btn.closest('article');
      const idAuto = articuloPadre.id;

      toggleFavorito(idAuto, btn);
   });
});

// =========================================================
//               LOGICA DE CARGA DE DATOS
// =========================================================
linksCategorias.forEach((linkCategoria) => {
   linkCategoria.addEventListener("click", (e) => {

      if (e) e.preventDefault();
      linksCategorias.forEach(link => link.classList.remove('tab-activa'));
      linkCategoria.classList.add('tab-activa');

      const isSessionActive = localStorage.getItem('sesionActiva') === 'true';
      const emailActivo = localStorage.getItem('usuarioActivoEmail');
      let favoritosGuardados = [];
      if (isSessionActive && emailActivo) {
         favoritosGuardados = JSON.parse(localStorage.getItem(`favoritos_${emailActivo}`)) || [];
      }

      items.forEach((item) => {
         const { Categoria, Id, Nombre, Autor, Portada, Descripcion, Rating } = item;

         if (linkCategoria.innerText != Categoria) return;

         const articuloContenedor = document.querySelector("article." + Id.split("-")[1]);

         if (articuloContenedor) {
            articuloContenedor.getElementsByClassName("item-valor-nombre")[0].innerText = Nombre;
            articuloContenedor.getElementsByClassName("item-valor-autor")[0].innerText = Autor;
            articuloContenedor.getElementsByClassName("item-valor-portada")[0].src = Portada;
            articuloContenedor.getElementsByClassName("item-valor-portada")[0].alt = Nombre;
            articuloContenedor.getElementsByClassName("item-valor-descripcion")[0].innerText = Descripcion;

            const personalizados = Object.keys(item).filter(key => key.startsWith("personalizado_"));
            personalizados.forEach((personalizado, index) => {
               const campo = articuloContenedor.getElementsByClassName(`item-campo-personalizado_${index + 1}`)[0];
               const valor = articuloContenedor.getElementsByClassName(`item-valor-personalizado_${index + 1}`)[0];
               if (campo && valor) {
                  campo.innerText = personalizado.split(".")[1];
                  valor.innerText = item[personalizado];
               }
            });

            articuloContenedor.id = Id;
            const iconoEstrella = articuloContenedor.querySelector('.btn-favorito');
            if (iconoEstrella) {
               if (favoritosGuardados.includes(Id)) {
                  iconoEstrella.classList.remove('fa-regular');
                  iconoEstrella.classList.add('fa-solid');
                  iconoEstrella.style.color = "gold";
               } else {
                  iconoEstrella.classList.remove('fa-solid');
                  iconoEstrella.classList.add('fa-regular');
                  iconoEstrella.style.color = "white";
               }
            }

            const rating = articuloContenedor.getElementsByClassName("item-valor-rating")[0];
            const valorRating = parseInt(Rating);
            const estrellas = '★'.repeat(valorRating) + '☆'.repeat(5 - valorRating);
            rating.innerHTML = `Rating: ${estrellas}`;
         }
      });
   });
});

document.querySelectorAll(".articulo-categoria").forEach((articulo) => {
   articulo.addEventListener("click", (e) => {
      if (e.target.classList.contains('btn-favorito')) return;
      document.querySelectorAll(".articulo-categoria").forEach(a => a.classList.remove("active"));
      articulo.classList.add("active");
   });
});

document.querySelectorAll(".articulo-categoria").forEach((articulo) => {
   articulo.addEventListener("mouseleave", () => {
      if (!articulo.classList.contains("active")) {
         articulo.classList.remove("active");
      }
   });
});

if (configuracion["modo-test-prod"] === "prod") {
   tabCategoria1.click();
};