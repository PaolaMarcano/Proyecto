const connection = require('../config/conexion');
const { Respuesta, validarClass } = require('./metodos');

class Modalidad {
    constructor(nombre) {
        this.nombre_modalidad = nombre;
    }
}

class ModalidadModel {
    ver_modalidad() {
        //console.log('en models')
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `modalidades`', function (error, results, fields) {
                if (error) {
                    reject(new Respuesta(500, error, error));
                } else {
                    if (results.length == 0) {
                        reject(new Respuesta(404, 'No existen modalidades registradas', results));
                    } else {
                        resolve(new Respuesta(200, results, results));
                    }
                };

                //console.log('models', results);
            });
        })
    }
    ingresar_modalidad(modalidad) {
        return new Promise((resolve, reject) => {
            console.log("en models", modalidad);
            let Nueva_modalidad = new Modalidad(modalidad.nombre_modalidad);
            if (validarClass(Nueva_modalidad, reject, [], 400) !== true) return;
            let query = connection.query('INSERT INTO modalidades SET ?', Nueva_modalidad, function (error, results, fields) {
                if (error) {
                    if (error.errno == 1062) { reject(new Respuesta(400, error.sqlMessage.substring(16).replace('for key', 'ya existe como'), error)); }
                    else if (error.errno == 1048) { reject(new Respuesta(400, "No ingresó nungún dato en: " + error.sqlMessage.substring(7).replace(' cannot be null', ''), error)); }
                    else { reject(new Respuesta(500, error, error)) }
                } else if (results) {
                    console.log('ID CREADO:', results.insertId);
                    resolve(new Respuesta(200, results, results));
                }
            });
            console.log(query.sql);
        })
    }
    ver_modalidad_y_categoria(id) {
        return new Promise((resolve, reject) => {
            if (isNaN(Number(id))) {
                reject("Ingresó un ID inválido: " + id);
            }
            connection.query('SELECT `id_modalidad`,`nombre_modalidad`,`id_categoria`,`nombre_categoria` FROM `categorias` JOIN `modalidades` ON `id_modalidad` = `idModalidad` WHERE `id_modalidad`=?', id, function (error, results, fields) {
                if (error) {
                    reject(new Respuesta(500, error, error));
                } else {
                    if (results.length == 0) {
                        reject(new Respuesta(404, 'No se encontraron modalidades', results));
                    } else {
                        resolve(new Respuesta(200, results, results));
                    }
                }
            })
        })
    }
    poder_inscribir() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_modalidad`,`nombre_modalidad`,`id_categoria`,`nombre_categoria` FROM `categorias` JOIN `modalidades` ON `id_modalidad` = `idModalidad`', function (error, results, fields) {
                if (error) {
                    reject(new Respuesta(500, error, error));
                } else {
                    resolve(results);
                }
            })
        })
    }
    buscar_categoria_por_modalidad(id) {
        return new Promise((resolve, reject) => {
            if (isNaN(Number(id))) { reject(new Respuesta(400, 'Ingresó un ID inválido', id)); return }
            connection.query('SELECT `id_categoria` AS "ID", `nombre_categoria`, `descripcion` AS "Descripción", `reglas` AS "Reglas", `premio` AS "Premio" FROM `categorias` WHERE `idModalidad` = ?', [id], function (error, results, fields) {
                if (error) {
                    reject(new Respuesta(500, error, error));
                } else {
                    if (results.length == 0) {
                        reject(new Respuesta(404, 'No existen modalidades registradas', results));
                    } else {
                        resolve(new Respuesta(200, results, results));
                    }
                };

                //console.log('models', results);
            });
        })
    }
    buscar_modalidad(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `modalidades` WHERE `id_modalidad` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen modalidades así registradas', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    eliminar_modalidad(id){
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `modalidades` WHERE `id_modalidad` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(400, err, err))
                } else if (rows) {
                    if (rows.affectedRows > 0) {
                        resolve(new Respuesta(200, "Se ha eliminado exitosamente", rows));
                    } else {
                        reject(new Respuesta(404, 'No se eliminó la modalidad "' + id + '". Es posible de que ya no exista.', rows));
                    }
                }
            })
        })
    }
}

module.exports = new ModalidadModel();