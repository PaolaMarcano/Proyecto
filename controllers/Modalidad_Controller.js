const Modalidad_Model = require('../models/Modalidad_model');
const { Respuesta } = require('../models/metodos');

class ModalidadController {
    ver_modalidad() {
        //console.log('controlers GET')
        return new Promise((resolve, reject) => {
            Modalidad_Model.ver_modalidad()
                .then((resultado) => { resolve(resultado) })
                .catch((error) => { reject(error); })
        })
    }
    ver_modalidad_y_categoria(id) {
        return new Promise((resolve, reject) => {
            if (isNaN(Number(id))) return reject(new Respuesta(400, 'Formato inválido', null));
            Modalidad_Model.ver_modalidad_y_categoria(id).then((retorno) => { resolve(retorno) }).catch((error) => { reject(error) });
        })
    }
    ver_modalidadYcat_viewsPublic() {
        return new Promise((resolve, reject) => {
            Modalidad_Model.ver_modalidad()
                .then(async (resultado) => {
                    let modalidades = resultado.resultado;
                    for (const modalidad of modalidades) {
                        //console.debug('Estamos en: ', modalidad.nombre_modalidad)
                        try {
                            modalidad.Categorias = [];
                            const categorias = await Modalidad_Model.buscar_categoria_por_modalidad(modalidad.id_modalidad);
                            //console.debug(categorias.resultado);
                            if (categorias.codigo == 200 && categorias.resultado && Array.isArray(categorias.resultado)) {
                                modalidad.Categorias = categorias.resultado;
                            }
                            delete modalidad.id_modalidad;
                            for (const categoria of modalidad.Categorias) {
                                delete categoria['ID'];
                            }
                        } catch (error) {
                            console.error("Error al buscar categorías:", modalidad.nombre_modalidad);
                            //if (error.mensaje) { console.error(error.mensaje) } else { console.error(error) }
                        }
                    }
                    resolve(modalidades)
                })
                .catch((error) => { reject(error); })
        })
    }
    ingresar_modalidad(modalidad) {
        console.log("en controller", modalidad);
        return new Promise((resolve, reject) => {
            if (modalidad == undefined) return reject(new Respuesta(400, 'No se recibió información', null));
            if (typeof modalidad !== "object") return reject(new Respuesta(400, 'Formato inválido', null));
            if (Object.keys(modalidad).length === 0) return reject(new Respuesta(400, 'No se ingresó información', null));

            Modalidad_Model.ingresar_modalidad(modalidad)
                .then(() => { resolve(Modalidad_Model.ver_modalidad()) })
                .catch((error) => { reject(error); })
        })
    }
    poder_inscribir() {
        return new Promise((resolve, reject) => {
            Modalidad_Model.poder_inscribir().then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
        })
    }
}

module.exports = new ModalidadController();