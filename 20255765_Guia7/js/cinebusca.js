const URL_WORKER = "https://cinebusca-api.jess-kgonzalezc.workers.dev/";

const formulario = document.getElementById("form-busqueda");
const campoTitulo = document.getElementById("titulo-busqueda");
const botonBuscar = document.getElementById("boton-buscar");
const estadoBusqueda = document.getElementById("estado-busqueda");
const resultados = document.getElementById("resultados");

const ventana = document.getElementById("ventana-detalle");
const tituloDetalle = document.getElementById("titulo-detalle");
const estadoDetalle = document.getElementById("estado-detalle");
const contenidoDetalle = document.getElementById("contenido-detalle");

let numeroConsultaDetalle = 0;

async function consultarAPI(ruta, parametros = {}) {
    const url = new URL(ruta, URL_WORKER);
    url.search = new URLSearchParams(parametros).toString();

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        const datos = await respuesta.json().catch(() => null);
        throw new Error(
            datos?.error || `No se pudo completar la consulta (${respuesta.status}).`
        );
    }

    return await respuesta.json();
}

function crearTexto(etiqueta, texto) {
    const elemento = document.createElement(etiqueta);
    elemento.textContent = texto;
    return elemento;
}

function mostrarResultados(titulos) {
    for (const ficha of titulos) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        const portada = ficha.imageSet?.verticalPoster?.w240;
        if (portada) {
            const imagen = document.createElement("img");
            imagen.src = portada;
            imagen.alt = "";
            imagen.loading = "lazy";
            tarjeta.appendChild(imagen);
        }

        const tipo = ficha.showType === "series" ? "Serie" : "Película";
        const anio = ficha.releaseYear ?? ficha.firstAirYear ?? "Año sin datos";

        const boton = crearTexto("button", "Ver ficha");
        boton.type = "button";
        boton.setAttribute("aria-label", `Ver ficha de ${ficha.title}`);
        boton.addEventListener("click", () => cargarDetalle(ficha));

        tarjeta.append(
            crearTexto("h2", ficha.title),
            crearTexto("p", `${tipo} · ${anio}`),
            boton
        );

        resultados.appendChild(tarjeta);
    }
}

async function cargarDetalle(ficha) {
    const detalle = await consultarAPI(
    `/shows/${encodeURIComponent(ficha.imdbId || ficha.id)}`
);

    const consulta = ++numeroConsultaDetalle;
    tituloDetalle.textContent = ficha.title;
    contenidoDetalle.replaceChildren();
    estadoDetalle.textContent = "Cargando ficha…";
    ventana.showModal();

    try {
       const detalle = await consultarAPI(
    `/shows/${encodeURIComponent(ficha.imdbId || ficha.id)}`
);

        if (consulta !== numeroConsultaDetalle || !ventana.open) {
            return;
        }

        const generos = (detalle.genres ?? []).map(genero => genero.name).join(", ");
        const puntuacion = detalle.rating == null
            ? "Sin datos"
            : `${detalle.rating}/100`;

        tituloDetalle.textContent = detalle.title ?? ficha.title;
        contenidoDetalle.append(
            crearTexto("p", detalle.overview || "Sin sinopsis disponible."),
            crearTexto("p", `Géneros: ${generos || "Sin datos"}`),
            crearTexto("p", `Puntuación: ${puntuacion}`)
        );
        estadoDetalle.textContent = "";
    } catch (error) {
        if (consulta === numeroConsultaDetalle && ventana.open) {
            estadoDetalle.textContent = error.message;
        }
    }
}

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    
    const titulo = campoTitulo.value.trim();

    if (!titulo) {
        estadoBusqueda.textContent = "Escribe el título de una película o serie";
        return;
    }

    botonBuscar.disabled = true;
    resultados.replaceChildren();
    estadoBusqueda.textContent = "Buscando películas y series…";

    try {
       const titulos = await consultarAPI("/shows/search/title", { title: titulo });
        if (!Array.isArray(titulos)) {
            throw new Error("La API devolvió un formato de búsqueda inesperado.");
        }

        if (titulos.length === 0) {
            estadoBusqueda.textContent = "No encontramos títulos para esa búsqueda.";
            return;
        }

        mostrarResultados(titulos);
        estadoBusqueda.textContent = titulos.length === 1
            ? "1 resultado"
            : `${titulos.length} resultados`;
    } catch (error) {
        estadoBusqueda.textContent = error.message;
    } finally {
        botonBuscar.disabled = false;
    }
});