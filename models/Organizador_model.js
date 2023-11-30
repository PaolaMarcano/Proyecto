const connection = require('../config/conexion');
const { Respuesta, validarClass } = require('./metodos');

class Organizador {
    constructor(nombre, cedula, email, telefono, cargo, comentario) {
        this.nombre = nombre;
        this.cedula = cedula;
        this.email = email;
        this.telefono = telefono;
        this.cargo = cargo;
        this.comentario = comentario
    }
}

class Personal {
    constructor(idEvento, idOrganizador) {
        this.idEvento = idEvento;
        this.idOrganizador = idOrganizador;
    }
}

class OrganizadorModel {
    ver_organizador() {
        //console.log('en models')
        return new Promise((resolve, reject) => {
            connection.query('SELECT `nombre`, `id_organizador` AS ID, `cedula`, `email`, `telefono`, `cargo`, `comentario` FROM `organizadores`', function (error, results, fields) {
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
    buscar_organizador(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `organizadores` WHERE `id_organizador` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen organizadores con el ID: ' + id, rows))
                    } else {
                        resolve(new Respuesta(200, rows, rows))
                    }
                }
            })
        })
    }
    ingresar_organizador(persona) {
        return new Promise((resolve, reject) => {
            console.log("en models", persona);
            let Nuevo_organizador = new Organizador(persona.nombre, persona.cedula, persona.email, persona.telefono, persona.cargo, persona.comentario);
            if (validarClass(Nuevo_organizador, reject, ['comentario'], 400) !== true) return;
            let query = connection.query('INSERT INTO `organizadores` SET ?', Nuevo_organizador, function (error, results, fields) {
                if (error) {
                    if (error.errno == 1062) { reject(new Respuesta(400, error.sqlMessage.substring(16).replace('for key', 'ya existe como'), error)); }
                    else if (error.errno == 1048) { reject(new Respuesta(400, "No ingresó nungún dato en: " + error.sqlMessage.substring(7).replace(' cannot be null', ''), error)); }
                    else { reject(new Respuesta(500, error, error)) }
                } else if (results) {
                    console.log('ID CREADO:', results.insertId);
                    resolve(new Respuesta(200, results, results));
                }
            });
            //console.log(query.sql);
        })
    }
    ingresar_personal(eventos, idDelOrganizador) {
        return new Promise((resolve, reject) => {
            for (const idDeEvento of eventos) {
                let Nuevo_personal = new Personal(idDeEvento, idDelOrganizador);
                //console.log("Ingresando personal", Nuevo_personal)
                if (validarClass(Nuevo_personal, reject, [], 400) !== true) return;
                connection.query('INSERT INTO `personal` SET ?', Nuevo_personal, function (errFinal, rowsFinal, fieldsFinals) {
                    if (errFinal) {
                        reject(new Respuesta(500, errFinal, errFinal));
                    } else if (rowsFinal) {
                        //console.log("Personal ingresado:"); console.table(rowsFinal)
                        if (rowsFinal.affectedRows < 1) return reject(new Respuesta(500, `No pudo ingresar el organizador al evento indicado (${idDeEvento})`, rowsFinal))
                        console.log("Ingresado con éxito el evento", rowsFinal.insertId);
                    }
                })
            }
            resolve()
        })
    }
    eliminar_organizador(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `organizadores` WHERE `id_organizador` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.affectedRows > 0) {
                        resolve(new Respuesta(200, "Se ha eliminado exitosamente", rows));
                    } else {
                        reject(new Respuesta(404, 'No se eliminó el organizador "' + id + '". Es posible de que ya no exista.', rows));
                    }
                }
            })
        })
    }
}

module.exports = new OrganizadorModel();