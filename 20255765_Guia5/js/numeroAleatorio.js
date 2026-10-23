// Generamos un numero aleatorio en el rango del 1 al 25
const numeroAleatorio = Math.floor(Math.random() * 25) + 1;

// Cantidad maxima de intentos
const numeroIntentos = 3;

// Guarda el intento actual
let intentos = 1;

function generarNumeroAleatorio() {
    let mensaje;
    const parrafo = document.querySelector("#idParrafo");

    if (intentos <= numeroIntentos) {
        let numero = prompt(
            "¿Que número se ha generado (Intento " + intentos + ")?"
        );

        if (numero == numeroAleatorio) {
            mensaje = `Pudiste adivinar el numero oculto (${numeroAleatorio}).
            Refresque la página para volver a jugar.`;
        } else {
            // Indicamos si el numero oculto es mayor o menor
            if (numero < numeroAleatorio) {
                mensaje = "El numero que debes adivinar es más alto. ";
            } else {
                mensaje = "El numero que debes adivinar es más bajo. ";
            }

            if (intentos == numeroIntentos) {
                mensaje += `Su numero de intentos ha terminado.
                El numero oculto era: ${numeroAleatorio}.
                Refresque la página para volver a jugar.`;
            } else {
                mensaje += `Vuelve a intentar. Quedan ${
                    numeroIntentos - intentos
                } intentos.`;
            }
        }

        intentos++;
    } else {
        mensaje = `Su numero de intentos ha terminado.
        El numero oculto era: ${numeroAleatorio}.
        Refresque la página para volver a jugar.`;
    }

    parrafo.innerHTML = mensaje;
}