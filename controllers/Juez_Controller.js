const Juez_model = require('../models/Juez_model');

class JuezController{
    ver_jueces(){
        return new Promise((resolve, reject) => {
            Juez_model.ver_jueces().then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    buscar_juez(id){
        return new Promise((resolve, reject) => {
            Juez_model.buscar_juez(id).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    ingresar_juez(juez) {
        return new Promise((resolve, reject) => {
            Juez_model.ingresar_juez(juez).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    ingresar_jurado(jurado){
        return new Promise((resolve, reject) => {
            Juez_model.ingresar_jurado(jurado).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    eliminar_juez(id) {
        return new Promise((resolve, reject) => {
            if (id != undefined && !isNaN(Number(id))) {
                Juez_model.eliminar_juez(id)
                    .then((resultados) => { resolve(resultados) })
                    .catch((error) => { reject(error) });
            } else {
                return reject(new Respuesta(400, 'No se ingresó un ID válido: ' + id, id));
            }
        })
    }
}

module.exports = new JuezController();