const connection = require('../config/conexion');
const { Respuesta, validarClass } = require('./metodos');

class Modalidad {
    constructor(nombre) {
        this.nombre_modalidad = nombre;
    }
}

class OrganizadorModel {
    ver_organizador() {
        //console.log('en models')
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_organizador` AS ID, `nombre`, `email`, `telefono`, `cargo` FROM `organizadores`', function (error, results, fields) {
                if (error) {
                    reject(new Respuesta(500, error, error));
                } else {
                    if (results.length == 0) {
                        reject(new Respuesta(404, 'No existen organizadores registrados', results));
                    } else {
                        resolve(new Respuesta(200, results, results));
                    }
                };
                //console.log('models', results);
            });
        })
    }
    
}

module.exports = new OrganizadorModel();