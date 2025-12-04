import items from "../data/items.json" with { type: "json" };

let indice = 0;
let autoRotar;

const carrusel = document.getElementById("carrusel");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");

function obtenerItemsAleatorios() {
   return items.sort(() => Math.random() - 0.5).slice(0, 5);
}

function crearCarrusel() {
   carrusel.innerHTML = "";
   const itemsAleatorios = obtenerItemsAleatorios();

   itemsAleatorios.forEach((item) => {
      const div = document.createElement("div");
      div.className = "carrusel-item";
      div.innerHTML = `
         <img src="${item.Portada}" alt="${item.Nombre}">
         <h3>${item.Nombre}</h3>
      `;
      carrusel.appendChild(div);
   });
}

crearCarrusel();
const totalItems = 5;

function cambiarSlide(nuevo) {
   indice = nuevo;
   carrusel.style.transform = `translateX(${-indice * 100}%)`;
   reiniciarAutoRotar();
}

function iniciarAutoRotar() {
   autoRotar = setInterval(() => {
      indice = (indice + 1) % totalItems;
      carrusel.style.transform = `translateX(${-indice * 100}%)`;

      if (indice === 0) {
         crearCarrusel();
      }
   }, 4000);
}

function reiniciarAutoRotar() {
   clearInterval(autoRotar);
   iniciarAutoRotar();
}

btnAnterior.addEventListener("click", () => {
   cambiarSlide((indice - 1 + totalItems) % totalItems);
});

btnSiguiente.addEventListener("click", () => {
   cambiarSlide((indice + 1) % totalItems);
});

iniciarAutoRotar();