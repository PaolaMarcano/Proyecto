const connection = require('../config/conexion');
const { Respuesta, validarClass } = require('./metodos');

class Evento{
    constructor( idCategoria, fecha_del_evento, sede){
      this.idCategoria = idCategoria;
      this.fecha_del_evento = fecha_del_evento;
      this.sede = sede;
    }
}

class EventoModel{
  ver_eventos(){
      return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM `eventos`', function (err, rows, fields){
          if (err){
            reject (new Respuesta(500,err,err));
          } else if(rows){
            if (rows.length==0){
              reject (new Respuesta (404, 'No existen eventos registrados', rows));
            } else{
              resolve(rows)
            }

          }

        })

      })
  }
  ver_eventos_views(){
    return new Promise((resolve, reject)=>{
      connection.query('SELECT `id_evento`, `nombre_modalidad`, `nombre_categoria`, `fecha_del_evento`, `sede` FROM `eventos`JOIN `categorias` ON `id_categoria` = `idCategoria` JOIN `modalidades` ON `id_modalidad` = `idModalidad`', function (err, rows, fields){
        if (err){
          reject (new Respuesta(500,err,err));
        } else if(rows){
          if (rows.length==0){
            reject (new Respuesta (404, 'No existen eventos registrados', rows));
          } else{
            resolve(rows)
          }

        }

      })
    })
  }
}
module.exports = new EventoModel();