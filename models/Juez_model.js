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