let carrito = [];
let productoSeleccionado = null;

// Cargar carrito desde localStorage
if (localStorage.getItem('carrito')) {
  carrito = JSON.parse(localStorage.getItem('carrito'));
  actualizarCarrito();
}

const productos = [
  { id: 1, nombre: "Tenis sport grises", precios: { unidad: 1200, media: 6500, docena: 12000 }, imagen: "img/card1.png" },
  { id: 2, nombre: "Tenis sport azules", precios: { unidad: 1100, media: 6000, docena: 11000 }, imagen: "img/card4.png" },
  { id: 3, nombre: "Burros de trabajo", precios: { unidad: 1300, media: 7000, docena: 12500 }, imagen: "img/card3.png" },
  { id: 4, nombre: "Zapato formal", precios: { unidad: 1000, media: 5500, docena: 10500 }, imagen: "img/card2.png" },
  { id: 5, nombre: "Tenis sport grises", precios: { unidad: 1150, media: 6200, docena: 11800 }, imagen: "img/card1.png" }
];









const tallasDisponibles = [37, 38, 39, 40, 41, 42];

const contenedor = document.getElementById("productos-container");

productos.forEach(producto => {
  const col = document.createElement("div");
  col.className = "col s6 m4";
  col.setAttribute("data-aos", "fade-up");
  
  col.innerHTML = `
    <div class="card hoverable" style="border-radius:10px;">
      <div class="card-image">
        <img src="${producto.imagen}" style="height:auto; border-radius:10px; object-fit:cover;">
      </div>
      <div class="card-content center-align">
        <span class="card-title">${producto.nombre}</span>
        <p>
          Unidad: L.${producto.precios.unidad}<br>
          1/2 Docena: L.${producto.precios.media}<br>
          Docena: L.${producto.precios.docena}
        </p>
      </div>
      <div class="card-action center teal darken-1" style="border-radius:10px;">
        <a href="#!" class="white-text" onclick="abrirPersonalizacion(${producto.id})">Agregar al carrito</a>
      </div>
    </div>`;
  contenedor.appendChild(col);
});

// Abrir modal de personalización
function abrirPersonalizacion(id) {
  productoSeleccionado = productos.find(p => p.id === id);
  
  document.getElementById("modalProductoNombre").innerText = productoSeleccionado.nombre;
  document.getElementById("modalProductoImagen").innerHTML = `<img src="${productoSeleccionado.imagen}" style="width:120px; height:120px; object-fit:cover; border-radius:10px;">`;

  // Presentaciones
  let htmlPresentaciones = '';
  for (const pres in productoSeleccionado.precios) {
    htmlPresentaciones += `
      <label style="margin-right:10px;">
        <input name="modalPresentacion" type="radio" value="${pres}">
        <span>${pres.charAt(0).toUpperCase() + pres.slice(1)}</span>
      </label>`;
  }
  document.getElementById("modalPresentaciones").innerHTML = htmlPresentaciones;

  // Tallas
  let htmlTallas = '';
  tallasDisponibles.forEach(talla => {
    htmlTallas += `
      <label style="margin-right:5px;">
        <input name="modalTalla" type="radio" value="${talla}">
        <span>${talla}</span>
      </label>`;
  });
  document.getElementById("modalTallas").innerHTML = htmlTallas;

  const modal = M.Modal.getInstance(document.getElementById('personalizarModal'));
  modal.open();
}

// Confirmar personalización
document.getElementById("confirmarPersonalizacion").addEventListener('click', () => {
  const presentacionRadio = document.querySelector('input[name="modalPresentacion"]:checked');
  const tallaRadio = document.querySelector('input[name="modalTalla"]:checked');

  if (!presentacionRadio || !tallaRadio) {
    Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      text: 'Selecciona presentación y talla',
      timer: 1800,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
    return;
  }

  const presentacion = presentacionRadio.value;
  const talla = tallaRadio.value;
  const precioSeleccionado = productoSeleccionado.precios[presentacion];
  const cantidad = 1;

  const existente = carrito.find(item => item.id === productoSeleccionado.id && item.presentacion === presentacion && item.talla === talla);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      precio: precioSeleccionado,
      imagen: productoSeleccionado.imagen,
      presentacion,
      talla,
      cantidad
    });
  }

  actualizarCarrito();
  Swal.fire({
    icon: 'success',
    title: '¡Agregado!',
    text: `${productoSeleccionado.nombre} (${presentacion}, Talla: ${talla})`,
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    background: '#28a745',
    color: 'white'
  });

  // Cerrar modal
  const modal = M.Modal.getInstance(document.getElementById('personalizarModal'));
  modal.close();
});

// Funciones de carrito, eliminar, WhatsApp y modal carrito igual que antes
function actualizarCarrito() {
  const cont = document.getElementById("carrito-items");
  cont.innerHTML = "";
  let total = 0;

  carrito.forEach((item, i) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    cont.innerHTML += `
      <div class="carrito-item" style="
        display:flex; 
        align-items:center; 
        gap:12px; 
        background:#f9f9f9; 
        border-radius:12px; 
        padding:10px 15px; 
        margin-bottom:10px; 
        box-shadow:0 2px 6px rgba(0,0,0,0.1);
      ">
        <img src="${item.imagen}" alt="${item.nombre}" style="
          width:60px; 
          height:60px; 
          object-fit:cover; 
          border-radius:8px;
        ">
        <div style="flex:1; font-size:14px; color:#333;">
          <strong style="font-size:15px;">${item.nombre}</strong><br>
          <span style="color:#555;">Presentación: ${item.presentacion} | Talla: ${item.talla} | Cantidad: ${item.cantidad}</span><br>
          <span style="color:#777;">L.${item.precio} c/u</span><br>
          <span style="font-weight:bold; color:#222;">Subtotal: L.${subtotal}</span>
        </div>
        <button onclick="eliminarDelCarrito(${i})" style="
          background:#ff4d4d; 
          border:none; 
          color:white; 
          border-radius:50%; 
          width:28px; 
          height:28px; 
          cursor:pointer; 
          font-weight:bold; 
          font-size:14px;
        ">×</button>
      </div>`;
  });

  document.getElementById("cartTotal").innerHTML = `<div style="margin-top:10px; padding:10px; text-align:right; font-size:16px; font-weight:bold; color:#222;">Total: L.${total}</div>`;
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function eliminarDelCarrito(i) {
  carrito.splice(i, 1);
  actualizarCarrito();
}

function abrirCarrito() {
  document.getElementById("cartModal").style.display = "block";
}
function cerrarCarrito() {
  document.getElementById("cartModal").style.display = "none";
}

function cotizarWhatsApp() {
  if (carrito.length === 0) {
    Swal.fire({icon:'info',title:'Carrito vacío',text:'Agrega productos antes de cotizar',timer:1500,showConfirmButton:false,toast:true,position:'top-end'});
    return;
  }

  let mensaje = "¡Hola! Me interesa cotizar los siguientes productos:%0A%0A";
  carrito.forEach(item => {
    mensaje += `- ${item.nombre} | Presentación: ${item.presentacion} | Talla: ${item.talla} | Cantidad: ${item.cantidad} | Precio: L.${item.precio} c/u | Subtotal: L.${item.precio * item.cantidad}%0A`;
  });
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  mensaje += `%0ATotal: L.${total}`;
  window.open(`https://wa.me/50498174113?text=${mensaje}`, "_blank");
}

// Inicializar Materialize y AOS
document.addEventListener('DOMContentLoaded', function () {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Modal.init(document.querySelectorAll('.modal'));
  AOS.init({ duration: 1000, once: true });
});
