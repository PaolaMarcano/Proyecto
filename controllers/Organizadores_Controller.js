const Organizador_Model = require('../models/Organizador_model');
const { Respuesta } = require('../models/metodos');

class OrganizadorController {
    ver_organizador() {
        //console.log('controlers GET')
        return new Promise((resolve, reject) => {
            Organizador_Model.ver_organizador()
                .then((resultado) => { resolve(resultado) })
                .catch((error) => { reject(error); })
        })
    }
    buscar_organizador(id) {
        return new Promise((resolve, reject) => {
            if (!id || isNaN(Number(id))) { reject(new Respuesta(400, "No se ingresó un ID válido", id)) }
            else { Organizador_Model.buscar_organizador(id).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) }); }
        })
    }
    ingresar_organizador(persona) {
        return new Promise((resolve, reject) => {
            if (persona.eventos == undefined) return reject(new Respuesta(400, "No se ingresaron eventos", persona));
            const eventosIn = persona.eventos;
            delete persona.eventos;
            Organizador_Model.ingresar_organizador(persona)
                .then((resultado) => {
                    //console.log("en controller JURADO"); console.table(resultado);
                    if (resultado.resultado.affectedRows > 0 && resultado.resultado.insertId) {
                        //console.log("Ingresar", eventosIn, resultado.resultado.insertId);
                        Organizador_Model.ingresar_personal(eventosIn, resultado.resultado.insertId)
                            .then(() => { resolve(resultado) }).catch((error) => { reject(error) })
                    } else {
                        console.log("error"); console.table(resultado);
                        reject(new Respuesta(500, "No se registró ningún organizador", resultado));
                    }
                })
                .catch((error) => { reject(error) })
        })
    }
    eliminar_organizador(id) {
        console.log('id', id)
        return new Promise((resolve, reject) => {
            if (!id || isNaN(Number(id))) { reject(new Respuesta(400, "No se ingresó un ID válido", id)) }
            else { Organizador_Model.eliminar_organizador(id).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) }); }
        })
    }
}

module.exports = new OrganizadorController();