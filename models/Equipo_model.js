const connection = require('../config/conexion');
const { Respuesta, validarClass } = require('./metodos');

class Equipo {
    constructor(representante, email, telefono, nombre_de_equipo, participantes, comentario, idtok, verificado) {
        this.representante = representante;
        this.email = email;
        this.telefono = telefono;
        this.nombre_de_equipo = nombre_de_equipo;
        this.participantes = participantes;
        this.comentario = comentario;
        this.id_user = idtok;
        this.verificado = verificado
    }
}

class Inscripcion {
    constructor(idCategoria, idEquipo) {
        this.idCategoria = idCategoria;
        this.idEquipo = idEquipo;
    }
}

class EquipoModel {
    ver_equipos() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `equipos`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen equipos registrados', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    ver_cat_equipos(idTeam) {
        //console.log("Id Recibido", idTeam);
        return new Promise((resolve, reject) => {
            let query = connection.query('SELECT `id_equipo`, `nombre_de_equipo`, `nombre_categoria`, `nombre_modalidad` FROM `inscripciones` INNER JOIN `categorias` ON `id_categoria` = `idCategoria` INNER JOIN `modalidades` ON `id_modalidad` = `idModalidad` INNER JOIN `equipos` ON `id_equipo` = `idEquipo` WHERE `id_equipo` = ?;', [idTeam], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length == 0) {
                        reject(null);
                    } else {
                        //console.table(rows);
                        resolve(rows);
                    }
                }
            })
            //console.log(query.sql)
        })
    }
    ver_equipos_views() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_equipo` AS ID, `nombre_de_equipo`, `representante`, `email`, `telefono`,  `participantes`, `comentario` FROM `equipos`', function (err, rows, fields) {
                if (err) {
                    reject(err)
                } else {
                    if (rows.length == 0) {
                        resolve(null)
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    seleccionarEquipoByID(id) {
        return new Promise((resolve, reject) => {
            if (isNaN(Number(id))) { reject(new Respuesta(500, 'No se ingresó un ID de token válido', id)); return }
            connection.query('SELECT `id_equipo` AS ID, `nombre_de_equipo`, `representante`, `email`, `telefono`,  `participantes`, `comentario` FROM `equipos` WHERE id_user = ?', [id], function (err, rows, fields) {
                if (err) {
                    reject(err)
                } else {
                    if (rows.length == 0) {
                        resolve(null)
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    ver_padrinos() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_equipo`,`representante`,`participantes`,`nombre_de_equipo`,`id_patrocinador`, `nombre_comercial`, `persona_de_contacto` FROM `padrinos` JOIN `equipos` ON `id_equipo` = `idEquipo` JOIN `patrocinadores` ON `id_patrocinador` = `idPatrocinador`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) { reject(new Respuesta(404, 'No existen equipo con padrinos registrados', rows)) }
                    else { resolve(rows) }
                }
            })
        })
    }
    ver_equipos_sin_padrino() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_equipo`,`participantes`,`nombre_de_equipo` FROM `equipos` WHERE NOT EXISTS( SELECT * FROM `padrinos` WHERE `idEquipo` = `id_equipo`)', function (err, rows, fields) {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
    ingresar_equipo(equipo) {
        return new Promise((resolve, reject) => {
            equipo.verificado = "por verificar";
            let Nuevo_equipo = new Equipo(equipo.representante, equipo.email, equipo.telefono, equipo.nombre_de_equipo, equipo.participantes, equipo.comentario, equipo.id_user, equipo.verificado);
            if (validarClass(Nuevo_equipo, reject, ["comentario"], 400) !== true) return;
            connection.query('INSERT INTO `equipos` SET ?', Nuevo_equipo, function (err, rows, fields) {
                if (err) {
                    if (err.errno == 1062) { reject(new Respuesta(400, err.sqlMessage.substring(16).replace('for key', 'ya existe como'), err)); }
                    else if (err.errno == 1048) { reject(new Respuesta(400, "No ingresó nungún dato en: " + err.sqlMessage.substring(7).replace(' cannot be null', ''), err)); }
                    else { reject(new Respuesta(500, err, err)) }
                } else {
                    let retorna = { categorias: equipo.categorias, idDelEquipo: rows.insertId }
                    resolve(retorna)
                }
            })
        })
    }
    ingresar_inscripcion(inscripcion) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < inscripcion.categorias.length; i++) { //Insertar varias inscripciones
                let idDeCategoria = inscripcion.categorias[i];
                let Nueva_inscripcion = new Inscripcion(idDeCategoria, inscripcion.idDelEquipo);
                if (validarClass(Nueva_inscripcion, reject, [], 400) !== true) return;
                connection.query('INSERT INTO `inscripciones` SET ?', Nueva_inscripcion, function (errFinal, rowsFinal, fieldsFinals) {
                    if (errFinal) {
                        reject(new Respuesta(500, errFinal, errFinal));
                    } else if (rowsFinal) {
                        if (rowsFinal.affectedRows > 0) console.log("Inscripcion exitosa", rowsFinal.insertId);
                    }
                })
            }
            resolve()
        })
    }
    editar_equipo(id, equipo) {
        return new Promise((resolve, reject) => {
            let Editar_equipo = new Equipo(equipo.representante, equipo.email, equipo.telefono, equipo.nombre_de_equipo, equipo.participantes, equipo.comentario, equipo.id_user, equipo.verificado);
            if (validarClass(Editar_equipo, reject, ["comentario"], 400) !== true) return;
            connection.query('UPDATE `equipos` SET ? WHERE id_equipo = ?', [Editar_equipo, id], function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err));
                } else if (rows) {
                    if (rows.affectedRows < 1) {
                        console.error('El equipo "' + id + '" no existe');
                        reject(new Respuesta(404, 'No existe ningún equipo con el ID indicado: ' + id, rows))
                    } else if (rows.changedRows > 0) {
                        resolve(new Respuesta(200, "Se ha actualizado exitosamente", rows));
                    } else {
                        resolve(new Respuesta(200, 'No se modificó el equipo "' + id + '", debido a que los datos ingresados son iguales.', rows));
                    }
                }
            })
        })
    }
    eliminar_equipo(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `equipos` WHERE `id_equipo` = ?', id, function (err, rows, fields) {
                //console.log(rows);
                if (err) {
                    reject(new Respuesta(400, err, err));
                } else if (rows) {
                    if (rows.affectedRows > 0) {
                        resolve(new Respuesta(200, "Se ha eliminado exitosamente", rows));
                    } else {
                        reject(new Respuesta(404, 'No se eliminó el equipo "' + id + '". Es posible de que ya no exista.', rows));
                    }
                }
            })
        })
    }
    eliminar_categoria_inscrita(idEquipo, idCategoria) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `inscripciones` WHERE `idEquipo` = ? AND `idCategoria` = ?', [idEquipo, idCategoria], function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(400, err, err));
                    console.table(err)
                } else if (rows) {
                    if (rows.affectedRows > 0) {
                        console.table(rows)
                        resolve(new Respuesta(200, "Se ha eliminado exitosamente", rows));
                    } else {
                        reject(new Respuesta(404, rows, rows));
                    }
                }
            })
        })
    }
    buscar_equipo(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `equipos` WHERE `id_equipo` = ?', [id], function (err, rows, fields) {
                if (err) {
                    reject(err)
                } else {
                    if (rows.length == 0) {
                        reject("No hay resultados")
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    ver_cat_equipos_con_id(idTeam) {
        return new Promise((resolve, reject) => {
            let query = connection.query('SELECT `id_equipo`, `id_categoria`, `nombre_de_equipo`, `nombre_categoria`, `nombre_modalidad` FROM `inscripciones` INNER JOIN `categorias` ON `id_categoria` = `idCategoria` INNER JOIN `modalidades` ON `id_modalidad` = `idModalidad` INNER JOIN `equipos` ON `id_equipo` = `idEquipo` WHERE `id_equipo` = ?;', [idTeam], function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length == 0) {
                        reject("No hay resultados");
                    } else {
                        resolve(rows);
                    }
                }
            })
        })
    }
}

module.exports = new EquipoModel(); 