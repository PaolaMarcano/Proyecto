class Respuesta {
    constructor(codigo, mensaje, resultado) {
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.resultado = resultado;
    }
}


function validarClass(clase, detener, excluir = [], codeError = 0) {
    if (!Array.isArray(excluir)) { excluir = []; console.error("No ingresó un array en 'excluir'") };
    let faltantes = "No ingresó ningún valor en: ";
    for (const propiedad in clase) {
        if (Object.hasOwnProperty.call(clase, propiedad)) {
            const elemento = clase[propiedad];
            if (!elemento && !excluir.includes(propiedad)) {
                //console.log("FOR. No ingresó ningún valor en: " + propiedad)
                faltantes += propiedad + "; ";
            }
        }
    }
    faltantes = faltantes.substring(0, faltantes.length - 2);
    if (faltantes.length > 26) {
        console.log("Error clase.", faltantes);
        if (codeError != 0) {
            detener(new Respuesta(codeError, faltantes, null))
            return faltantes;
        } else {
            detener(faltantes);
            return faltantes;
        }
    }
    console.log("Aprobado (clase).");
    return true;
}


module.exports.Respuesta = Respuesta;
module.exports.validarClass = validarClass;