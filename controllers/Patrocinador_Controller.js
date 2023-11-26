const Patrocinador_Model = require('../models/Patrocinador_model');

class PatrocinadorController {
    ver_patrocinador() {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.ver_patrocinador().then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    ver_patrocinador_viewsPublic() {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.ver_patrocinador_viewsPublic().then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    ver_patrocinador_views() {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.ver_patrocinador_views().then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    ver_patrocinios() {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.ver_patrocinios().then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    ingresar_patrocinador(patrocinador) {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.ingresar_patrocinador(patrocinador).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    ingresar_padrino(patrocinador) {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.ingresar_padrino(patrocinador).then(() => { resolve() }).catch((error) => { reject(error) });
        })
    }
    eliminar_patrocinador(id) {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.eliminar_patrocinador(id).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    editar_patrocinador(idViejo, id, actualizar) {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.editar_patrocinador(idViejo, id, actualizar).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
    buscar_patrocinador(id) {
        return new Promise((resolve, reject) => {
            Patrocinador_Model.buscar_patrocinador(id).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
}

module.exports = new PatrocinadorController();