function tempTime(fecha, alerta = false, avisar = 3) {
    fecha = fecha * 1000;
    let ahora = Date.now();
    console.log("Hora actual: ", ahora, new Date(ahora));
    console.log("Hora de exp: ", fecha, new Date(fecha));

    let restante = fecha - ahora;
    let aviso = (restante / 1000 / 60).toFixed(0);
    console.log("restante:", restante, aviso + " minutos");

    if (alerta) alert(`Su sesión caducará en ${aviso} minutos.`);

    if ((restante - (avisar * 60 * 1000)) > 0) {
        setTimeout(() => {
            alert(`Su sesión caducará en ${avisar} minutos.`);
            console.log("Faltan " + avisar + " minutos para que su seción expire");
        }, restante - (avisar * 60 * 1000));
    }

    setTimeout(() => {
        alert(`Su sesión ha caducado. Debe iniciar sesión de nuevo.`);
        console.log("Sesión caducada.");
    }, restante);
}

function cambiarAviso(fecha, idHTML) {
    fecha = fecha * 1000;
    let ahora = Date.now();
    let restante = fecha - ahora;
    let aviso = (restante / 1000 / 60).toFixed(0);
    document.getElementById(idHTML).innerHTML = `Su sesión expira a las: ${new Date(fecha).toLocaleTimeString('es-US')} \n<hr> Le quedan ${aviso} minutos.`;
    setInterval(() => {
        document.getElementById(idHTML).innerHTML = `Su sesión expira a las: ${new Date(fecha).toLocaleTimeString('es-US')} \n<hr> Le quedan ${aviso} minutos.`;
    }, 1000 * 60)
}