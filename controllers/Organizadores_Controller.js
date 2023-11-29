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
}

module.exports = new OrganizadorController();