/* =========================================================
   TalleresT — Interacciones compartidas
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  actualizarAnioFooter();
  inicializarNavegacionMovil();
  inicializarToast();
  inicializarBotonesConNotificacion();
  inicializarBarrasDeProgreso();
  inicializarFiltroInventario();
  inicializarSelectorPeriodo();
});

/* --- Año automático en el footer --- */
function actualizarAnioFooter() {
  const anioEl = document.querySelector('[data-anio-actual]');
  if (anioEl) {
    anioEl.textContent = new Date().getFullYear();
  }
}

/* --- Abrir / cerrar navegación en pantallas pequeñas --- */
function inicializarNavegacionMovil() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const sidebar = document.querySelector('[data-sidebar]');
  const overlay = document.querySelector('[data-sidebar-overlay]');

  if (!toggle || !sidebar || !overlay) return;

  const abrir = () => {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  const cerrar = () => {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const estaAbierto = sidebar.classList.contains('is-open');
    estaAbierto ? cerrar() : abrir();
  });

  overlay.addEventListener('click', cerrar);
}

/* --- Sistema de notificaciones breves (toast) --- */
let toastEl = null;
let toastTimeoutId = null;

function inicializarToast() {
  toastEl = document.querySelector('[data-toast]');
}

function mostrarNotificacion(mensaje) {
  if (!toastEl) return;

  toastEl.textContent = mensaje;
  toastEl.classList.add('is-visible');

  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toastEl.classList.remove('is-visible');
  }, 2600);
}

/* --- Botones que solo deben mostrar una respuesta visual --- */
function inicializarBotonesConNotificacion() {
  document.querySelectorAll('[data-notify]').forEach((boton) => {
    boton.addEventListener('click', () => {
      mostrarNotificacion(boton.getAttribute('data-notify'));
    });
  });
}

/* --- Animar barras de progreso al cargar --- */
function inicializarBarrasDeProgreso() {
  document.querySelectorAll('[data-progress]').forEach((barra) => {
    const valor = barra.getAttribute('data-progress');
    requestAnimationFrame(() => {
      setTimeout(() => {
        barra.style.width = valor + '%';
      }, 150);
    });
  });

  document.querySelectorAll('[data-bar-height]').forEach((barra) => {
    const valor = barra.getAttribute('data-bar-height');
    requestAnimationFrame(() => {
      setTimeout(() => {
        barra.style.height = valor;
      }, 150);
    });
  });
}

/* --- Filtro de inventario (búsqueda + estado) --- */
function inicializarFiltroInventario() {
  const buscador = document.querySelector('[data-inventario-buscar]');
  const filtroEstado = document.querySelector('[data-inventario-estado]');
  const filas = document.querySelectorAll('[data-inventario-fila]');
  const contador = document.querySelector('[data-inventario-contador]');

  if (!filas.length) return;

  const aplicarFiltro = () => {
    const texto = (buscador ? buscador.value : '').trim().toLowerCase();
    const estado = filtroEstado ? filtroEstado.value : 'todos';
    let visibles = 0;

    filas.forEach((fila) => {
      const nombre = (fila.getAttribute('data-nombre') || '').toLowerCase();
      const codigo = (fila.getAttribute('data-codigo') || '').toLowerCase();
      const filaEstado = fila.getAttribute('data-estado') || '';

      const coincideTexto = nombre.includes(texto) || codigo.includes(texto);
      const coincideEstado = estado === 'todos' || filaEstado === estado;

      const visible = coincideTexto && coincideEstado;
      fila.classList.toggle('row-hidden', !visible);
      if (visible) visibles += 1;
    });

    if (contador) {
      contador.textContent = visibles;
    }
  };

  if (buscador) buscador.addEventListener('input', aplicarFiltro);
  if (filtroEstado) filtroEstado.addEventListener('change', aplicarFiltro);

  aplicarFiltro();
}

/* --- Selector visual de período (finanzas) --- */
function inicializarSelectorPeriodo() {
  const tabs = document.querySelectorAll('[data-period-tab]');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.setAttribute('aria-pressed', 'false'));
      tab.setAttribute('aria-pressed', 'true');
      mostrarNotificacion('Mostrando datos de: ' + tab.textContent.trim());
    });
  });
}