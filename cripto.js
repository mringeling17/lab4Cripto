// ==UserScript==
// @name         Descifrar y mostrar mensajes cifrados con Triple DES y CryptoJS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Intenta descifrar y mostrar mensajes ocultos en la página web usando Triple DES y CryptoJS
// @author       TuNombre
// @match        https://cripto.tiiny.site/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para descifrar un mensaje cifrado en Base64 con Triple DES y CryptoJS
    function descifrarMensaje(cadenaBase64, clave) {
        try {
            const bytesDescifrados = CryptoJS.TripleDES.decrypt(cadenaBase64, CryptoJS.enc.Utf8.parse(clave), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            const mensajeDescifrado = bytesDescifrados.toString(CryptoJS.enc.Utf8);
            return mensajeDescifrado;
        } catch (error) {
            console.error('Error al descifrar con Triple DES:', error);
            return '';
        }
    }

    // Función para mostrar el mensaje descifrado en la página
    function mostrarMensajeEnPagina(mensaje) {
        const p = document.createElement('p');
        p.textContent = mensaje;
        document.body.appendChild(p);
    }

    // Obtener la clave de las letras mayúsculas del texto de la página
    const textoDeLaPagina = document.body.innerText || document.body.textContent;
    const letrasMayusculas = textoDeLaPagina.match(/[A-Z]/g);
    const clave = letrasMayusculas.join('');
    console.log('La llave es:', clave);

    // Obtener los IDs de los divs que tienen clase con el formato M{i}
    function obtenerIDsConClaseM() {
        const IDsConClaseM = [];
        for (let i = 1; ; i++) {
            const div = document.querySelector(`.M${i}`);
            if (!div) {
                break; // Salir del bucle si no se encuentra el div con la clase M{i}
            }
            const id = div.id;
            IDsConClaseM.push(id);
        }
        return IDsConClaseM;
    }

    const IDsConClaseM = obtenerIDsConClaseM();
    console.log('Los mensajes cifrados son: ', IDsConClaseM.length);

    // Descifrar y mostrar los mensajes cifrados
    IDsConClaseM.forEach((idBase64, index) => {
        const mensajeDescifrado = descifrarMensaje(idBase64, clave);
        console.log(` ${idBase64} ${mensajeDescifrado}`);
        if (mensajeDescifrado) {
            mostrarMensajeEnPagina(mensajeDescifrado);
        }
    });
})();
