const connection = require('../config/conexion');
const { Respuesta, validarClass } = require('./metodos');

class Juez {
    constructor(nombre, email, telefono) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
    }
}

class Jurado{
    constructor(idEvento, idJuez){
        this.idEvento = idEvento;
        this.idJuez = idJuez;
    }
}

class JuezModel{
    ver_jueces(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `jueces`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen jueces registrados', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    buscar_juez(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `jueces` WHERE `id_juez` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen jueces así registrados', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    ingresar_juez(juez){
        return new Promise((resolve, reject) => {
            let Nuevo_juez = new Juez(juez.nombre, juez.email, juez.telefono)
            if (validarClass(Nuevo_juez, reject, [], 400) !== true) return;
            connection.query('INSERT INTO `jueces` SET ?', Nuevo_juez, function (err, rows, fields) {
                if (err) {
                    if (err.errno == 1062) { reject(new Respuesta(400, err.sqlMessage.substring(16).replace('for key', 'ya existe como'), err)); }
                    else if (err.errno == 1048) { reject(new Respuesta(400, "No ingresó nungún dato en: " + err.sqlMessage.substring(7).replace(' cannot be null', ''), err)); }
                    else { reject(new Respuesta(500, err, err)) }
                } else {
                    let retorna = { eventos: juez.eventos, idDelJuez: rows.insertId }
                    resolve(retorna)
                }
            })
        })
    }
    ingresar_jurado(jurado){
        return new Promise((resolve, reject) => {
            for (let i = 0; i < jurado.eventos.length; i++) { //Insertar varias inscripciones
                let idDeEvento = jurado.eventos[i];
                let Nuevo_jurado = new Jurado(idDeEvento, jurado.idDelJuez);
                if (validarClass(Nuevo_jurado, reject, [], 400) !== true) return;
                connection.query('INSERT INTO `jurado` SET ?', Nuevo_jurado, function (errFinal, rowsFinal, fieldsFinals) {
                    if (errFinal) {
                        reject(new Respuesta(500, errFinal, errFinal));
                    } else if (rowsFinal) {
                        if (rowsFinal.affectedRows > 0) console.log("Ingresado al evento", rowsFinal.insertId);
                    }
                })
            }
            resolve()
        })
    }
    eliminar_juez(id){
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `jueces` WHERE `id_juez` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(400, err, err))
                } else if (rows) {
                    if (rows.affectedRows > 0) {
                        resolve(new Respuesta(200, "Se ha eliminado exitosamente", rows));
                    } else {
                        reject(new Respuesta(404, 'No se eliminó el juez "' + id + '". Es posible de que ya no exista.', rows));
                    }
                }
            })
        })
    }
}

module.exports = new JuezModel();