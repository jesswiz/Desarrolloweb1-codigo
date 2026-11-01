//Accediendo a los elementos html
const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const botonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
// Componente de Bootstrap
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

//Componente modal
const idModal = document.getElementById("idModal");

//Arreglo global de pacientes
// Recuperamos los pacientes guardados
let arrayPaciente = JSON.parse(localStorage.getItem("pacientes")) || [];

// -1 significa que estamos registrando un paciente nuevo
let indiceEditar = -1;

// Guarda el arreglo en LocalStorage
function guardarPacientes() {
    localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
}
/*
Creando una funcion para que limpie el formulario
siempre que se cargue la pagina o cuando se presione
el boton limpiar del formulario
*/

const limpiarForm = () => {
    inputNombre.value = "";
    inputApellido.value = "";
    inputFechaNacimiento.value = "";
    inputRdMasculino.checked = false;
    inputRdFemenino.checked = false;
    cmbPais.value = 0;
    inputDireccion.value = "";
    inputNombrePais.value = "";
    indiceEditar = -1;

    buttonAgregarPaciente.innerHTML =
        '<i class="bi bi-person-plus-fill"></i> Guardar Datos';

    inputNombre.focus();
};

/*
 Funcion para validar el ingreso del paciente
*/

const addPaciente = function () {
    let nombre = inputNombre.value;
    let apellido = inputApellido.value;
    let fechaNacimiento = inputFechaNacimiento.value;
    let sexo =
        inputRdMasculino.checked == true
            ? "Hombre"
            : inputRdFemenino.checked == true
                ? "Mujer"
                : "";
    let pais = cmbPais.value;
    let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
    let direccion = inputDireccion.value;

    if (
        nombre != "" &&
        apellido != "" &&
        fechaNacimiento != "" &&
        sexo != "" &&
        pais != 0 &&
        direccion != ""
    ) {
        // Creamos el arreglo con los datos del paciente
let paciente = new Array(
    nombre,
    apellido,
    fechaNacimiento,
    sexo,
    labelPais,
    direccion
);

if (indiceEditar == -1) {
    // Registrar un paciente nuevo
    arrayPaciente.push(paciente);
    mensaje.innerHTML = "Se ha registrado un nuevo paciente";
} else {
    // Actualizar el paciente seleccionado
    arrayPaciente[indiceEditar] = paciente;
    mensaje.innerHTML = "Se han actualizado los datos del paciente";
}

// Guardamos los cambios y actualizamos la tabla
guardarPacientes();
imprimirPacientes();
        //Llamando al componente de Bootstrap
        toast.show();

        //Limpiando formulario
        limpiarForm();
    } else {
        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Faltan campos por completar";
        //Llamando al componente de Bootstrap
        toast.show();
    }
};

//Funcion que imprime la ficha de los pacientes registrados
function imprimirFilas() {
    let $fila = "";
    let contador = 1;

    arrayPaciente.forEach((element) => {
        $fila += `<tr>
            <td scope="row" class="text-center fw-bold">${contador}</td>
            <td>${element[0]}</td>
            <td>${element[1]}</td>
            <td>${element[2]}</td>
            <td>${element[3]}</td>
            <td>${element[4]}</td>
            <td>${element[5]}</td>
            <td>
                <button id="idBtnEditar${contador}" type="button"
                    class="btn btn-primary"
                    onclick="editarPaciente(${contador - 1})"
                    aria-label="Editar paciente">
                    <i class="bi bi-pencil-square"></i>
                </button>

                <button id="idBtnEliminar${contador}" type="button"
                    class="btn btn-danger"
                    onclick="eliminarPaciente(${contador - 1})"
                    aria-label="Eliminar paciente">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </td>
        </tr>`;
        contador++;
    });
    return $fila;
}

const imprimirPacientes = () => {
    let $table = `<div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
            <tr>
                <th scope="col" class="text-center" style="width:5%">#</th>
                <th scope="col" class="text-center" style="width:15%">Nombre</th>
                <th scope="col" class="text-center" style="width:15%">Apellido</th>
                <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
                <th scope="col" class="text-center" style="width:10%">Sexo</th>
                <th scope="col" class="text-center" style="width:10%">Pais</th>
                <th scope="col" class="text-center" style="width:25%">Dirección</th>
                <th scope="col" class="text-center" style="width:10%">Opciones</th>
            </tr>
            ${imprimirFilas()}
        </table>
    </div>
    `;
    document.getElementById("idTablaPacientes").innerHTML = $table;
};
// Coloca los datos del paciente en el formulario para editarlos
function editarPaciente(indice) {
    let paciente = arrayPaciente[indice];

    inputNombre.value = paciente[0];
    inputApellido.value = paciente[1];
    inputFechaNacimiento.value = paciente[2];
    inputRdMasculino.checked = paciente[3] == "Hombre";
    inputRdFemenino.checked = paciente[3] == "Mujer";
    inputDireccion.value = paciente[5];

    // Buscamos el país por su nombre
    let opcionEncontrada = false;

    for (let opcion of cmbPais.options) {
        if (opcion.text == paciente[4]) {
            cmbPais.value = opcion.value;
            opcionEncontrada = true;
            break;
        }
    }

    // Si era un país agregado antes de recargar la página,
    // lo incorporamos nuevamente al select
    if (!opcionEncontrada) {
        let opcion = document.createElement("option");
        opcion.textContent = paciente[4];
        opcion.value = cmbPais.options.length;
        cmbPais.appendChild(opcion);
        cmbPais.value = opcion.value;
    }

    indiceEditar = indice;

    buttonAgregarPaciente.innerHTML =
        '<i class="bi bi-pencil-square"></i> Actualizar Datos';

    inputNombre.focus();
}

// Elimina el paciente seleccionado
function eliminarPaciente(indice) {
    if (confirm("¿Desea eliminar este paciente?")) {
        arrayPaciente.splice(indice, 1);

        guardarPacientes();
        imprimirPacientes();

        // Reiniciamos la edición porque las posiciones pueden cambiar
        limpiarForm();

        mensaje.innerHTML = "Paciente eliminado correctamente";
        toast.show();
    }
}

// Contador global de los option correspondiente
// al select (cmb) pais
let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
    let paisNew = inputNombrePais.value;

    if (paisNew != "") {
        // Creando nuevo option con la API DOM
        let option = document.createElement("option");
        option.textContent = paisNew;
        option.value = contadorGlobalOption + 1;

        //Agregando el nuevo option en el select
        cmbPais.appendChild(option);

        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Pais agregado correctamente";
        //Llamando al componente de Bootstrap
        toast.show();
    } else {
        //Asignando un mensaje a nuestra notificacion
        mensaje.innerHTML = "Faltan campos por completar";
        //Llamando al componente de Bootstrap
        toast.show();
    }
};

// Agregando eventos a los botones y utilizando funciones tipo flecha
buttonLimpiarPaciente.onclick = () => {
    limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
    addPaciente();
};

buttonMostrarPaciente.onclick = () => {
    imprimirPacientes();
};

botonAgregarPais.onclick = () => {
    addPais();
};

// Se agrega el focus en el campo nombre pais del modal
idModal.addEventListener("shown.bs.modal", () => {
    inputNombrePais.value = "";
    inputNombrePais.focus();
});

//Ejecutar funcion al momento de cargar la pagina HTML
limpiarForm();

// Mostramos los pacientes recuperados de LocalStorage
imprimirPacientes();