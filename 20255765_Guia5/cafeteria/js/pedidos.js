// Arreglo original de pedidos
const pedidos = [];

// null significa que no hay un filtro activo
let filtroActivo = null;

// Elementos del formulario
const formPedido = document.querySelector("#formPedido");
const inputProducto = document.querySelector("#producto");
const inputPrecio = document.querySelector("#precio");
const inputCantidad = document.querySelector("#cantidad");

// Elementos de los filtros y botones
const formFiltro = document.querySelector("#formFiltro");
const inputPrecioMaximo = document.querySelector("#precioMaximo");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnLimpiar = document.querySelector("#btnLimpiar");

// Elementos donde se muestran los resultados
const cuerpoTabla = document.querySelector("#cuerpoTabla");
const totalUnidades = document.querySelector("#totalUnidades");
const montoTotal = document.querySelector("#montoTotal");
const estadoTabla = document.querySelector("#estadoTabla");
const mensaje = document.querySelector("#mensaje");

// Gestionamos las interacciones sin eventos dentro del HTML
formPedido.addEventListener("submit", agregarPedido);
formFiltro.addEventListener("submit", aplicarFiltro);
btnMostrarTodos.addEventListener("click", mostrarTodos);
btnLimpiar.addEventListener("click", limpiarPedidos);


// --------------------------------------------------
// FUNCIONES PARA PROCESAR LOS DATOS
// --------------------------------------------------

// Valida los datos y devuelve un mensaje si existe un error
function validarPedido(producto, precio, cantidad) {
    if (producto.trim() === "") {
        return "El nombre del producto no puede estar vacío.";
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        return "El precio debe ser un número mayor que cero.";
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        return "La cantidad debe ser un número entero positivo.";
    }

    return "";
}

// Devuelve un nuevo arreglo sin modificar los pedidos originales
function filtrarPedidos(listaPedidos, precioMaximo) {
    return listaPedidos.filter(pedido => pedido.precio <= precioMaximo);
}

// Transforma los pedidos para incluir el subtotal de cada uno
function calcularSubtotales(listaPedidos) {
    return listaPedidos.map(pedido => ({
        producto: pedido.producto,
        precio: pedido.precio,
        cantidad: pedido.cantidad,
        subtotal: pedido.precio * pedido.cantidad
    }));
}

// Calcula las unidades y el monto total con reduce()
function calcularTotales(listaPedidos) {
    return listaPedidos.reduce(
        (totales, pedido) => ({
            unidades: totales.unidades + pedido.cantidad,
            monto: totales.monto + pedido.precio * pedido.cantidad
        }),
        { unidades: 0, monto: 0 }
    );
}


// --------------------------------------------------
// FUNCIONES PARA ACTUALIZAR EL HTML
// --------------------------------------------------

// Da formato de moneda a los valores
function formatearMoneda(valor) {
    return "$" + valor.toFixed(2);
}

// Muestra un mensaje de información o de error
function mostrarMensaje(texto, esError = false) {
    mensaje.textContent = texto;
    mensaje.classList.toggle("error", esError);
}

// Crea una fila utilizando los datos de un pedido
function crearFila(pedido) {
    const fila = document.createElement("tr");

    const celdaProducto = document.createElement("td");
    const celdaPrecio = document.createElement("td");
    const celdaCantidad = document.createElement("td");
    const celdaSubtotal = document.createElement("td");

    // textContent muestra el nombre como texto
    celdaProducto.textContent = pedido.producto;
    celdaPrecio.textContent = formatearMoneda(pedido.precio);
    celdaCantidad.textContent = pedido.cantidad;
    celdaSubtotal.textContent = formatearMoneda(pedido.subtotal);

    fila.append(
        celdaProducto,
        celdaPrecio,
        celdaCantidad,
        celdaSubtotal
    );

    return fila;
}

// Actualiza solamente las filas de la tabla
function actualizarTabla(listaPedidos) {
    cuerpoTabla.innerHTML = "";

    if (listaPedidos.length === 0) {
        cuerpoTabla.innerHTML = `
            <tr>
                <td colspan="4" class="fila-vacia">
                    ${
                        pedidos.length === 0
                            ? "Todavía no hay pedidos. Agrega tu primer antojo."
                            : "No hay pedidos que coincidan con el precio indicado."
                    }
                </td>
            </tr>
        `;

        return;
    }

    const pedidosConSubtotal = calcularSubtotales(listaPedidos);

    const filas = pedidosConSubtotal.map(pedido => crearFila(pedido));

    cuerpoTabla.append(...filas);
}

// Actualiza los indicadores de todos los pedidos registrados
function actualizarIndicadores() {
    const totales = calcularTotales(pedidos);

    totalUnidades.textContent = totales.unidades;
    montoTotal.textContent = formatearMoneda(totales.monto);
}

// Coordina la actualización de la tabla y los indicadores
function actualizarVista() {
    let pedidosVisibles = pedidos;

    if (filtroActivo !== null) {
        pedidosVisibles = filtrarPedidos(pedidos, filtroActivo);

        estadoTabla.textContent =
            `Mostrando ${pedidosVisibles.length} pedido(s) con precio unitario ` +
            `menor o igual a ${formatearMoneda(filtroActivo)}.`;
    } else {
        estadoTabla.textContent =
            `Mostrando todos los pedidos: ${pedidos.length}.`;
    }

    actualizarTabla(pedidosVisibles);
    actualizarIndicadores();
}


// --------------------------------------------------
// FUNCIONES QUE RESPONDEN A LAS INTERACCIONES
// --------------------------------------------------

function agregarPedido(evento) {
    // Evita que el formulario recargue la página
    evento.preventDefault();

    const producto = inputProducto.value.trim();
    const precio = Number(inputPrecio.value);
    const cantidad = Number(inputCantidad.value);

    const error = validarPedido(producto, precio, cantidad);

    if (error !== "") {
        mostrarMensaje(error, true);
        return;
    }

    // Cada objeto conserva exactamente la estructura solicitada
    const nuevoPedido = {
        producto: producto,
        precio: precio,
        cantidad: cantidad
    };

    pedidos.push(nuevoPedido);

    actualizarVista();
    formPedido.reset();
    inputProducto.focus();

    if (filtroActivo !== null && precio > filtroActivo) {
        mostrarMensaje(
            "Pedido agregado. Su precio supera el filtro activo; " +
            "presiona Mostrar todos para verlo."
        );
    } else {
        mostrarMensaje("Pedido agregado correctamente.");
    }
}

function aplicarFiltro(evento) {
    evento.preventDefault();

    const valorIngresado = inputPrecioMaximo.value.trim();
    const precioMaximo = Number(valorIngresado);

    if (
        valorIngresado === "" ||
        !Number.isFinite(precioMaximo) ||
        precioMaximo < 0
    ) {
        mostrarMensaje(
            "Ingresa un precio máximo válido, mayor o igual a cero.",
            true
        );
        return;
    }

    filtroActivo = precioMaximo;

    actualizarVista();
    mostrarMensaje("Filtro aplicado correctamente.");
}

function mostrarTodos() {
    filtroActivo = null;
    formFiltro.reset();

    actualizarVista();
    mostrarMensaje("Se muestran todos los pedidos registrados.");
}

function limpiarPedidos() {
    // Vacía el arreglo original
    pedidos.length = 0;
    filtroActivo = null;

    formPedido.reset();
    formFiltro.reset();

    actualizarVista();
    mostrarMensaje("Se han limpiado todos los pedidos.");
}

// Muestra el estado inicial de la aplicación
actualizarVista();