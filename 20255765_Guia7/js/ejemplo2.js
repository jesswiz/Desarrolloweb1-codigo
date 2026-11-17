const formulario = document.forms["frmRegistro"];
const botonRegistro = formulario.elements["btnRegistro"];

const nombres = document.getElementById("idNombre");
const apellidos = document.getElementById("idApellidos");
const fechaNacimiento = document.getElementById("idFechaNac");
const correo = document.getElementById("idCorreo");
const contrasena = document.getElementById("idPassword");
const repetirContrasena = document.getElementById("idPasswordRepetir");
const pais = document.getElementById("idCmPais");
const avatar = document.getElementById("idArchivo");

const modal = new bootstrap.Modal(document.getElementById("idModal"));
const tituloModal = document.getElementById("modalLabel");
const cuerpoModal = document.getElementById("idBodyModal");

const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mostrarError(campo, mensaje) {
    alert(mensaje);
    campo.focus();
}

function mostrarRegistro(datos) {
    while (cuerpoModal.firstChild) {
        cuerpoModal.removeChild(cuerpoModal.firstChild);
    }

    const tabla = document.createElement("table");
    tabla.className = "table table-bordered mb-0";
    const cuerpoTabla = document.createElement("tbody");

    for (const [campo, valor] of datos) {
        const fila = document.createElement("tr");
        const encabezado = document.createElement("th");
        const celda = document.createElement("td");

        encabezado.setAttribute("scope", "row");
        encabezado.textContent = campo;
        celda.textContent = valor;

        fila.appendChild(encabezado);
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
    }

    tabla.appendChild(cuerpoTabla);
    cuerpoModal.appendChild(tabla);
    tituloModal.textContent = "Datos del registro";
    modal.show();
}

botonRegistro.type = "submit";
formulario.noValidate = true;

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const camposObligatorios = [
        [nombres, "Ingrese sus nombres."],
        [apellidos, "Ingrese sus apellidos."],
        [fechaNacimiento, "Ingrese su fecha de nacimiento."],
        [correo, "Ingrese su correo electrónico."],
        [contrasena, "Ingrese su contraseña."],
        [repetirContrasena, "Repita su contraseña."]
    ];

    for (const [campo, mensaje] of camposObligatorios) {
        if (campo.value.trim() === "") {
            mostrarError(campo, mensaje);
            return;
        }
    }

    const nacimiento = new Date(fechaNacimiento.value + "T00:00:00");
    if (nacimiento > new Date()) {
        mostrarError(fechaNacimiento, "La fecha de nacimiento no puede ser posterior a hoy.");
        return;
    }

    if (!formatoCorreo.test(correo.value.trim())) {
        mostrarError(correo, "Ingrese un correo electrónico válido.");
        return;
    }

    if (contrasena.value !== repetirContrasena.value) {
        mostrarError(repetirContrasena, "Las contraseñas deben coincidir.");
        return;
    }

    const intereses = formulario.querySelectorAll('input[type="checkbox"]:checked');
    if (intereses.length === 0) {
        mostrarError(document.getElementById("idCkProgramacion"), "Seleccione al menos un interés.");
        return;
    }

    const carrera = formulario.querySelector('input[name="idRdCarrera"]:checked');
    if (!carrera) {
        mostrarError(document.getElementById("idRdIng"), "Seleccione una carrera.");
        return;
    }

    if (pais.selectedIndex <= 0) {
        mostrarError(pais, "Seleccione un país de origen.");
        return;
    }

    if (avatar.files.length === 0) {
        mostrarError(avatar, "Seleccione una imagen para su avatar.");
        return;
    }

    const nombresIntereses = [];
    for (const interes of intereses) {
        nombresIntereses.push(interes.labels[0].textContent.trim());
    }

    mostrarRegistro([
        ["Nombres", nombres.value.trim()],
        ["Apellidos", apellidos.value.trim()],
        ["Fecha de nacimiento", fechaNacimiento.value],
        ["Correo electrónico", correo.value.trim()],
        ["Intereses", nombresIntereses.join(", ")],
        ["Carrera", carrera.labels[0].textContent.trim()],
        ["País de origen", pais.options[pais.selectedIndex].text.trim()],
        ["Avatar", avatar.files[0].name]
    ]);
});