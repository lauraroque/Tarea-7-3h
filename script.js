// ==========================================
// 1. DATOS DE ENTRADA INICIALES
// ==========================================
// Se declara con let para permitir la reasignación en eliminaciones.
// Contiene 8 productos, 4 categorías distintas y productos agotados.
let inventario = [
  { id: 1, nombre: "Sartén antiadherente 24cm", categoria: "Cocina", cantidad: 3, precio: 22.50, agotado: false },
  { id: 2, nombre: "Juego de toallas de baño", categoria: "Baño", cantidad: 5, precio: 18.00, agotado: false },
  { id: 3, nombre: "Martillo", categoria: "Herramientas", cantidad: 2, precio: 65.00, agotado: false },
  { id: 4, nombre: "Lámpara de escritorio", categoria: "Iluminación", cantidad: 0, precio: 12.00, agotado: true },
  { id: 5, nombre: "Cafetera Black & Decker 6 tazas", categoria: "Cocina", cantidad: 4, precio: 28.00, agotado: false },
  { id: 6, nombre: "Organizador de ducha", categoria: "Baño", cantidad: 1, precio: 14.50, agotado: false },
  { id: 7, nombre: "Caja de destornilladores", categoria: "Herramientas", cantidad: 0, precio: 16.20, agotado: true },
  { id: 8, nombre: "Bombillos luz pack x4", categoria: "Iluminación", cantidad: 8, precio: 9.90, agotado: false }
];

// ==========================================
// 2. FUNCIONES REQUERIDAS
// ==========================================

/**
 * Genera identificadores únicos usando un cierre (closure).
 * Comienza en 100 para no coincidir con los IDs iniciales.
 */
function crearGeneradorId() {
  let contador = 100;
  return function () {
    const idGenerado = contador;
    contador++;
    return idGenerado;
  };
}

/**
 * Calcula el valor total de los productos (cantidad * precio) usando un bucle for.
 */
function calcularValorTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].cantidad * items[i].precio;
  }
  return total;
}

/**
 * Cuenta la suma total de unidades físicas de los productos usando un bucle for.
 */
function contarUnidades(items) {
  let suma = 0;
  for (let i = 0; i < items.length; i++) {
    suma += items[i].cantidad;
  }
  return suma;
}

/**
 * Agrupa y cuenta cuántos productos pertenecen a cada categoría.
 */
function contarPorCategoria(items) {
  const conteo = {};
  for (let i = 0; i < items.length; i++) {
    const categoria = items[i].categoria;
    if (conteo[categoria] !== undefined) {
      conteo[categoria]++;
    } else {
      conteo[categoria] = 1;
    }
  }
  return conteo;
}

/**
 * Crea un nodo <td> con el texto especificado. No utiliza innerHTML.
 */
function crearCelda(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

/**
 * Crea una fila <tr> con sus celdas, botones y atributos data-id correspondientes.
 */
function crearFila(item) {
  const tr = document.createElement("tr");

  if (item.agotado) {
    tr.classList.add("fila-agotado");
  }

  const subtotal = (item.cantidad * item.precio).toFixed(2);
  const textoEstado = item.agotado ? "Agotado" : "Disponible";

  tr.appendChild(crearCelda(item.nombre));
  tr.appendChild(crearCelda(item.categoria));
  tr.appendChild(crearCelda(item.cantidad));
  tr.appendChild(crearCelda(`$${item.precio.toFixed(2)}`));
  tr.appendChild(crearCelda(`$${subtotal}`));
  tr.appendChild(crearCelda(textoEstado));

  // Celda de acciones con botones
  const tdAcciones = document.createElement("td");

  const btnEstado = document.createElement("button");
  btnEstado.textContent = item.agotado ? "Marcar Disponible" : "Marcar Agotado";
  btnEstado.className = "btn-estado";
  btnEstado.setAttribute("data-id", item.id);

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.className = "btn-eliminar";
  btnEliminar.setAttribute("data-id", item.id);

  tdAcciones.appendChild(btnEstado);
  tdAcciones.appendChild(btnEliminar);
  tr.appendChild(tdAcciones);

  return tr;
}

/**
 * Limpia el tbody, recorre items con bucle for, inserta filas,
 * actualiza los cuatro indicadores y controla el mensaje de vacío.
 * NOTA DE COHERENCIA: Los indicadores reflejan el conjunto que se está visualizando
 * actualmente (filtrado o completo) para dar retroalimentación directa al usuario.
 */
function renderizar(items) {
  const tbody = document.getElementById("cuerpo-inventario");
  const mensajeVacio = document.getElementById("mensaje-vacio");

  // Limpiar tbody usando manipulación de nodos
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Insertar filas
  for (let i = 0; i < items.length; i++) {
    const fila = crearFila(items[i]);
    tbody.appendChild(fila);
  }

  // Contabilizar agotados visibles
  let agotados = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].agotado) {
      agotados++;
    }
  }

  // Actualizar indicadores
  document.getElementById("total-productos").textContent = items.length;
  document.getElementById("total-unidades").textContent = contarUnidades(items);
  document.getElementById("valor-total").textContent = calcularValorTotal(items).toFixed(2);
  document.getElementById("total-agotados").textContent = agotados;

  // Mostrar u ocultar mensaje vacío
  if (items.length === 0) {
    mensajeVacio.classList.remove("oculto");
  } else {
    mensajeVacio.classList.add("oculto");
  }
}

/**
 * Devuelve un nuevo array con los productos que pertenecen a la categoría dada.
 * Utiliza un bucle for y no muta el array original.
 */
function filtrarPorCategoria(categoria) {
  const filtrados = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].categoria.toLowerCase() === categoria.toLowerCase()) {
      filtrados.push(inventario[i]);
    }
  }
  return filtrados;
}

/**
 * Valida los datos del formulario. Lanza un Error con throw si no cumple las reglas.
 */
function validarProducto(datos) {
  if (!datos.nombre || datos.nombre.trim() === "") {
    throw new Error("El nombre del producto no puede estar vacío.");
  }
  if (!datos.categoria || datos.categoria.trim() === "") {
    throw new Error("La categoría no puede estar vacía.");
  }
  if (datos.cantidad === null || isNaN(datos.cantidad) || !Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
    throw new Error("La cantidad debe ser un número entero mayor que cero.");
  }
  if (datos.precio === null || isNaN(datos.precio) || datos.precio < 0) {
    throw new Error("El precio debe ser un número mayor o igual que cero.");
  }
}

/**
 * Elimina un producto por su id y retorna un nuevo array usando un bucle for.
 */
function eliminarProducto(id) {
  const nuevoInventario = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id !== id) {
      nuevoInventario.push(inventario[i]);
    }
  }
  return nuevoInventario;
}

/**
 * Alterna la propiedad 'agotado' del producto con el id correspondiente.
 */
function cambiarEstado(id) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      inventario[i].agotado = !inventario[i].agotado;
      break;
    }
  }
}

// ==========================================
// 3. GENERADOR DE ID Y UTILIDADES
// ==========================================
const obtenerSiguienteId = crearGeneradorId();

function actualizarOpcionesFiltro() {
  const select = document.getElementById("filtro-categoria");
  const valorActual = select.value;

  // Limpiar opciones preservando 'todas'
  while (select.children.length > 1) {
    select.removeChild(select.lastChild);
  }

  const categorias = contarPorCategoria(inventario);
  for (const cat in categorias) {
    const opcion = document.createElement("option");
    opcion.value = cat;
    opcion.textContent = cat;
    select.appendChild(opcion);
  }

  // Restaurar selección previa si aún existe
  select.value = valorActual || "todas";
}

function aplicarFiltroActual() {
  const selector = document.getElementById("filtro-categoria");
  const categoriaSeleccionada = selector.value;

  if (categoriaSeleccionada === "todas") {
    renderizar(inventario);
  } else {
    const listaFiltrada = filtrarPorCategoria(categoriaSeleccionada);
    renderizar(listaFiltrada);
  }
}

/**
 * Maneja el evento submit del formulario con bloque try...catch.
 */
function agregarProducto(event) {
  event.preventDefault();
  const mensajeError = document.getElementById("mensaje-error");
  mensajeError.classList.add("oculto");
  mensajeError.textContent = "";

  const form = event.target;
  const nombre = form.nombre.value.trim();
  const categoria = form.categoria.value.trim();
  const cantidad = Number(form.cantidad.value);
  const precio = parseFloat(form.precio.value);

  try {
    const datos = { nombre, categoria, cantidad, precio };
    validarProducto(datos);

    const nuevoProducto = {
      id: obtenerSiguienteId(),
      nombre: datos.nombre,
      categoria: datos.categoria,
      cantidad: datos.cantidad,
      precio: datos.precio,
      agotado: false
    };

    inventario.push(nuevoProducto);
    console.log(`[ALTA] Producto agregado exitosamente (ID: ${nuevoProducto.id}):`, nuevoProducto);

    actualizarOpcionesFiltro();
    aplicarFiltroActual();
    form.reset();
  } catch (error) {
    console.error("[ERROR DE VALIDACIÓN]:", error.message);
    mensajeError.textContent = error.message;
    mensajeError.classList.remove("oculto");
  }
}

// ==========================================
// 4. FLUJO PRINCIPAL Y EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  // 1. Mostrar estado inicial en consola
  console.log("Inventario inicial cargado:");
  console.table(inventario);

  console.log("Conteo de productos por categoría:");
  console.table(contarPorCategoria(inventario));

  // 2. Renderizar inventario inicial y poblar selector de categorías
  actualizarOpcionesFiltro();
  renderizar(inventario);

  // 3. Registrar evento submit
  const formulario = document.getElementById("formulario-producto");
  formulario.addEventListener("submit", agregarProducto);

  // 4. Delegación de eventos sobre #cuerpo-inventario para botones
  const cuerpoInventario = document.getElementById("cuerpo-inventario");
  cuerpoInventario.addEventListener("click", function (event) {
    const elemento = event.target;

    if (elemento.classList.contains("btn-eliminar")) {
      const id = Number(elemento.getAttribute("data-id"));
      inventario = eliminarProducto(id);
      console.log(`[BAJA] Producto con ID ${id} eliminado del inventario.`);
      actualizarOpcionesFiltro();
      aplicarFiltroActual();
    } else if (elemento.classList.contains("btn-estado")) {
      const id = Number(elemento.getAttribute("data-id"));
      cambiarEstado(id);
      console.log(`[CAMBIO DE ESTADO] Estado alternado para el producto con ID ${id}.`);
      aplicarFiltroActual();
    }
  });

  // 5. Registrar evento change para el selector de filtro
  const filtroCategoria = document.getElementById("filtro-categoria");
  filtroCategoria.addEventListener("change", function () {
    console.log(`[FILTRO] Filtrando por categoría: ${filtroCategoria.value}`);
    aplicarFiltroActual();
  });
});

