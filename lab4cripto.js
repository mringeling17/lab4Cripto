// ==UserScript==
// @name         Descifrar y mostrar mensajes cifrados con Triple DES y CryptoJS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Intenta descifrar y mostrar mensajes ocultos en la página web usando Triple DES y CryptoJS
// @author       Matias Ringeling
// @match        https://lab4cripto.tiiny.site/
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

    // Extraer la clave de las letras mayúsculas del texto de la página
    const textoDeLaPagina = document.body.innerText || document.body.textContent;
    const letrasMayusculas = textoDeLaPagina.match(/[A-Z]/g);
    const clave = letrasMayusculas.join('');
    console.log('KEY:', clave);

    // Obtener todos los divs con un ID y descifrar su contenido
    const divsConID = Array.from(document.querySelectorAll('div[id]'));
    console.log(`Los mensajes cifrados son: ${divsConID.length}`);
    divsConID.forEach((div, index) => {
        const idBase64 = div.id;
        const mensajeDescifrado = descifrarMensaje(idBase64, clave);
        console.log(idBase64, ' ', mensajeDescifrado);
        if (mensajeDescifrado) {
            mostrarMensajeEnPagina(mensajeDescifrado);
        }
    });
})();
