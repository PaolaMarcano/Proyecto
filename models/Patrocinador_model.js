const connection = require('../config/conexion');
const { Respuesta, validarClass } = require('./metodos');

class Patrocinador {
    constructor(nombre_comercial, persona_de_contacto, telefono, idPatrocinio, comentario) {
        this.nombre_comercial = nombre_comercial;
        this.persona_de_contacto = persona_de_contacto;
        this.telefono = telefono;
        this.idPatrocinio = idPatrocinio;
        this.comentario = comentario
    }
}

class Padrino {
    constructor(idEquipo, idPatrocinador) {
        this.idEquipo = idEquipo,
            this.idPatrocinador = idPatrocinador
    }
}

class PatrocinadorModel {
    ver_patrocinador() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_patrocinador`,`nombre_comercial`,`persona_de_contacto`,`telefono`,`nombre_patrocinio`,`monto`, `comentario` FROM `patrocinadores` JOIN `patrocinios` ON `idPatrocinio` = `id_patrocinio`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen patrocinadores registrados', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    ver_patrocinador_viewsPublic() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `nombre_comercial` AS "Nombre comercial", `telefono` AS "Teléfono" FROM `patrocinadores` JOIN `patrocinios` ON `idPatrocinio` = `id_patrocinio`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen patrocinadores registrados', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    ver_patrocinador_views() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_patrocinador` AS ID, `nombre_comercial` AS "Nombre comercial",`persona_de_contacto` AS "Persona de contacto",`telefono` AS "Teléfono",`nombre_patrocinio` AS "Tipo de patrocinio",`monto` AS Monto, `comentario` AS Comentario FROM `patrocinadores` JOIN `patrocinios` ON `idPatrocinio` = `id_patrocinio`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen patrocinadores registrados', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    ver_patrocinios() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `patrocinios`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        resolve('No se encontró la información solicitada')
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    ingresar_patrocinador(patrocinador) {
        return new Promise((resolve, reject) => {
            let Nuevo_patrocinador = new Patrocinador(patrocinador.nombre_comercial, patrocinador.persona_de_contacto, patrocinador.telefono, patrocinador.idPatrocinio, patrocinador.comentario)
            if (validarClass(Nuevo_patrocinador, reject, ["comentario", "idEquipo"], 400) !== true) return;
            connection.query('INSERT INTO `patrocinadores` SET ?', Nuevo_patrocinador, function (err, rows, fields) {
                if (err) {
                    if (err.errno == 1062) { reject(new Respuesta(400, err.sqlMessage.substring(16).replace('for key', 'ya existe como'), err)); }
                    else if (err.errno == 1048) { reject(new Respuesta(400, "No ingresó nungún dato en: " + err.sqlMessage.substring(7).replace(' cannot be null', ''), err)); }
                    else { reject(new Respuesta(500, err, err)) }
                } else {
                    if (patrocinador.idPatrocinio == 5) {
                        let retorna = { idEquipo: patrocinador.idEquipo, idPatrocinador: rows.insertId }
                        resolve(retorna)
                    } else {
                        resolve()
                    }
                }
            })
        })
    }
    ingresar_padrino(patrocinador) {
        return new Promise((resolve, reject) => {
            let Nuevo_padrino = new Padrino(patrocinador.idEquipo, patrocinador.idPatrocinador)
            if (validarClass(Nuevo_padrino, reject, [], 400) !== true) return;
            connection.query('INSERT INTO `padrinos` SET ?', Nuevo_padrino, function (errFinal, rowsFinal, fieldsFinal) {
                if (errFinal) {
                    reject(new Respuesta(500, errFinal, errFinal));
                }
                if (rowsFinal) {
                    if (rowsFinal.affectedRows > 0) console.log("Patrocinio exitoso", rowsFinal.insertId);
                    resolve()
                }
            })
        })
    }
    eliminar_patrocinador(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `patrocinadores` WHERE `id_patrocinador` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(400, err, err))
                } else if (rows) {
                    if (rows.affectedRows > 0) {
                        resolve(new Respuesta(200, "Se ha eliminado exitosamente", rows));
                    } else {
                        reject(new Respuesta(404, 'No se eliminó el patrocinador "' + id + '". Es posible de que ya no exista.', rows));
                    }
                }
            })
        })
    }
    editar_patrocinador(idViejo, id, actualizar) {
        return new Promise((resolve, reject) => {
            if (idViejo == 5 && actualizar.idPatrocinio != 5) {
                reject("No puedes cambiar tu modo de patrocinio porque estás financiando a un equipo")
            } else {
                let Actualizar_patrocinador = new Patrocinador(actualizar.nombre_comercial, actualizar.persona_de_contacto, actualizar.telefono, actualizar.idPatrocinio, actualizar.comentario)
                if (validarClass(Actualizar_patrocinador, reject, ["comentario", "idEquipo"], 400) !== true) return;
                connection.query('UPDATE `patrocinadores` SET ? WHERE `id_patrocinador` = ?', [Actualizar_patrocinador, id], function (err, rows, fields) {
                    if (err) {
                        reject(new Respuesta(500, err, err));
                    } else if (rows) {
                        if (rows.affectedRows < 1) {
                            console.error('El patrocinador "' + id + '" no existe');
                            reject(new Respuesta(404, 'No existe ningún patrocinador con el ID indicado: ' + id, rows))
                        } else if (rows.changedRows > 0) {
                            resolve(new Respuesta(200, "Se ha actualizado exitosamente", rows));
                        } else {
                            reject(new Respuesta(200, 'No se modificó el patrocinador "' + id + '", debido a que los datos ingresados son iguales.', rows));
                        }
                    }
                })
            }
        })
    }
    buscar_patrocinador(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `patrocinadores` WHERE `id_patrocinador` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen patrocinadores registrados', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
}

module.exports = new PatrocinadorModel();