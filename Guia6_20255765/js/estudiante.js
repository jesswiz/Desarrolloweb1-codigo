const formulario = document.getElementById("formEstudiante");
const resultadoValidacion = document.getElementById("resultadoValidacion");

// Expresiones regulares para validar los campos
const regexCarnet = /^[A-Za-z]{2}\d{3}$/;
const regexNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?: +[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
const regexDui = /^\d{8}-\d$/;
const regexNit = /^\d{4}-\d{6}-\d{3}-\d$/;
const regexFecha = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/[1-9]\d{3}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexEdad = /^\d+$/;

// Además del formato, comprobamos que la fecha exista
function fechaValida(texto) {
    if (!regexFecha.test(texto)) {
        return false;
    }

    let partes = texto.split("/");
    let dia = Number(partes[0]);
    let mes = Number(partes[1]);
    let anio = Number(partes[2]);

    let fecha = new Date(anio, mes - 1, dia);
    let hoy = new Date();

    return (
        fecha.getFullYear() == anio &&
        fecha.getMonth() == mes - 1 &&
        fecha.getDate() == dia &&
        fecha <= hoy
    );
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let carnet = document.getElementById("carnet").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let dui = document.getElementById("dui").value.trim();
    let nit = document.getElementById("nit").value.trim();
    let fecha = document.getElementById("fecha").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let edad = document.getElementById("edad").value.trim();

    let errores = [];

    if (!regexCarnet.test(carnet)) {
        errores.push("El carnet debe tener dos letras y tres números. Ejemplo: AB001.");
    }

    if (!regexNombre.test(nombre)) {
        errores.push("Ingrese el nombre completo con letras y espacios, sin números ni caracteres especiales.");
    }

    if (!regexDui.test(dui)) {
        errores.push("El DUI debe tener el formato 12345678-9.");
    }

    if (!regexNit.test(nit)) {
        errores.push("El NIT debe tener el formato 1234-123456-123-4.");
    }

    if (!fechaValida(fecha)) {
        errores.push("Ingrese una fecha existente, que no sea futura, con formato día/mes/año.");
    }

    if (!regexCorreo.test(correo)) {
        errores.push("Ingrese un correo válido. Ejemplo: estudiante@correo.com.");
    }

    if (!regexEdad.test(edad)) {
        errores.push("La edad debe contener únicamente números enteros.");
    }

    if (errores.length > 0) {
        resultadoValidacion.className = "alert alert-danger mt-4";

        let lista = "<strong>Revisa los siguientes campos:</strong><ul>";

        for (let error of errores) {
            lista += `<li>${error}</li>`;
        }

        lista += "</ul>";
        resultadoValidacion.innerHTML = lista;
    } else {
        resultadoValidacion.className = "alert alert-success mt-4";
        resultadoValidacion.textContent =
            "Todos los campos de la ficha son válidos.";
    }
});

formulario.addEventListener("reset", function () {
    resultadoValidacion.className = "mt-4";
    resultadoValidacion.textContent = "";
});