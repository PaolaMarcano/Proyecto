const connection = require('../config/conexion');
var jwt = require('jsonwebtoken');
const result = require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Respuesta, validarClass } = require('./metodos');

if (!result.parsed.JWT_SECRET) {
    let error_dotenv_JWT = 'No se ha encontrado la variable de entorno: "JWT_SECRET". \n';
    throw error_dotenv_JWT //Error al leer variable JWT_SECRET en .env
}

class UsuarioModel {
    mostrar_usuarios() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_usuario`, `cedula_usuario`, `nombre_usuario`, `rol_usuario` FROM `usuarios`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen usuarios registrados', rows))
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    buscar_usuario(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_usuario`, `cedula_usuario`, `nombre_usuario` FROM `usuarios` WHERE `id_usuario` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    resolve(rows)
                }
            })
        })
    }
    buscar_usuario_cedula(cedula) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `id_usuario`, `cedula_usuario`, `nombre_usuario`, `correo_usuario`, `rol_usuario` FROM `usuarios` WHERE `cedula_usuario` = ?', [cedula], function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err));
                } else if (rows.length > 0) {
                    resolve(rows);
                } else {
                    reject(new Respuesta(404, "No se ha encontrado ningún usuario con la cédula indicada", rows));
                }
            })
        })
    }
    guardar_usuario(nuevo) {
        return new Promise((resolve, reject) => {
            //if (nuevo.rol_user) delete nuevo.rol_user; 
            if (validarClass(nuevo, reject, [], 400) !== true) return;
            if (!nuevo.rol_usuario) nuevo.rol_usuario = "editor";
            if (!nuevo.clave_usuario) reject("Ingrese una contraseña válida");
            nuevo.clave_usuario = bcrypt.hashSync(nuevo.clave_usuario, saltRounds);
            //console.log("clave: ", nuevo.clave_usuario)
            connection.query('INSERT INTO usuarios SET ?', nuevo, function (error, results, fields) {
                if (error) {
                    if (error.errno == 1062) reject("La cédula '" + nuevo.cedula_usuario + "' ya existe");
                    if (error.errno == 1048) reject("No ingresó nungún dato en: " + error.sqlMessage.substring(7).replace(' cannot be null', ''));
                    reject(error);
                    console.error("Error SQL: ", error.sqlMessage);
                }
                if (results) {
                    console.log('ID CREADO:', results.insertId);
                    resolve("Registro exitoso");
                }
            })
        })
    }
    login(usuario) {
        return new Promise((resolve, reject) => {
            //usuario.clave_usuario = bcrypt.hashSync(usuario.clave_usuario, saltRounds);
            //console.log(usuario.clave_usuario)
            if (validarClass(usuario, reject, [], 400) !== true) return;
            connection.query('SELECT * FROM `usuarios` WHERE cedula_usuario = ?', usuario.cedula_usuario, function (error, results, fields) {
                if (error) { reject(error); return };
                if (results[0]) {
                    console.log('Login de usuario:', results);
                    if (results[0].nombre_usuario == usuario.nombre_usuario) {
                        if (bcrypt.compareSync(usuario.clave_usuario, results[0].clave_usuario)) {
                            //Roles
                            let rol = 'editor'
                            if (results[0].rol_usuario) rol = results[0].rol_usuario;

                            var token = jwt.sign({ nombre: results[0].nombre_usuario, id: results[0].cedula_usuario, rol: rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
                            console.log(token);
                            //results[1] = token;
                            let retorna = { id_usuario: results[0].id_usuario, nombre_usuario: results[0].nombre_usuario, cedula_usuario: results[0].cedula_usuario, rol_usuario: results[0].rol_usuario, token: token }
                            resolve(retorna);
                        } else {
                            console.log('Clave errada');
                            reject('Clave errada');
                        }
                    } else {
                        reject("Dato errado");
                    }
                } else {
                    console.log('Usuario no existe');
                    reject('No existe ningún usuario con la cédula indicada: ' + usuario.cedula_usuario);
                }
            })
        })
    }
    modificar_usuario(id, actualizar) {
        return new Promise((resolve, reject) => {
            if (validarClass(actualizar, reject, [], 400) !== true) return;
            //  Almacena el hash en tu base de datos de contraseña.
            actualizar.clave_usuario = bcrypt.hashSync(actualizar.clave_usuario, saltRounds);
            if (actualizar.rol_usuario) {
                reject(new Respuesta(400, 'No puedes cambiarte de rol a ti mismo'))
            } else {
                connection.query('UPDATE `usuarios` SET ? WHERE `id_usuario` = ?', [actualizar, id], function (err, rows, fields) {
                    if (err) {
                        if (err.errno == 1048) reject("No ingresó nungún dato en: " + err.sqlMessage.substring(7).replace(' cannot be null', ''));
                        reject(new Respuesta(500, err, err));
                    } else {
                        if (rows.affectedRows < 1) {
                            console.error('El usuario "' + id + '" no existe');
                            reject(new Respuesta(404, 'No existe ningún usuario con el ID indicado: ' + id, rows))
                        } else if (rows.changedRows > 0) {
                            resolve(new Respuesta(200, "Se ha actualizado exitosamente", rows));
                        } else {
                            reject(new Respuesta(200, 'No se modificó el usuario "' + id + '", debido a que los datos ingresados son iguales.', rows));
                        }
                    }
                })
            }
        })
    }
    modificar_usuario_views(id, actualizar) {
        return new Promise((resolve, reject) => {
            if (validarClass(actualizar, reject, [], 400) !== true) return;
            if (actualizar.rol_usuario) {
                reject(new Respuesta(400, 'No puedes cambiarte de rol a ti mismo'))
            } else {
                connection.query('UPDATE `usuarios` SET ? WHERE `id_usuario` = ?', [actualizar, id], function (err, rows, fields) {
                    if (err) {
                        if (err.errno == 1048) reject("No ingresó nungún dato en: " + err.sqlMessage.substring(7).replace(' cannot be null', ''));
                        reject(new Respuesta(500, err, err));
                    } else {
                        if (rows.affectedRows < 1) {
                            console.error('El usuario "' + id + '" no existe');
                            reject(new Respuesta(404, 'No existe ningún usuario con el ID indicado: ' + id, rows))
                        } else if (rows.changedRows > 0) {
                            resolve(new Respuesta(200, "Se ha actualizado exitosamente", rows));
                        } else {
                            reject(new Respuesta(200, 'No se modificó el usuario "' + id + '", debido a que los datos ingresados son iguales.', rows));
                        }
                    }
                })
            }
        })
    }
    eliminar_usuario(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `usuarios` WHERE `id_usuario` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err))
                } else {
                    if (rows.affectedRows > 0) {
                        resolve(new Respuesta(200, "Se ha eliminado exitosamente", rows));
                    } else {
                        reject(new Respuesta(404, 'No se eliminó el usuario "' + id + '". Es posible de que ya no exista.', rows));
                    }
                }
            })
        })
    }
    cambiar_rol(usuario) {
        return new Promise((resolve, reject) => {
            if (validarClass(usuario, reject, [], 400) !== true) return;
            connection.query('UPDATE `usuarios` SET rol_usuario = ? WHERE cedula_usuario = ?', [usuario.rol_usuario, usuario.cedula_usuario], function (error, results, fields) {
                if (error) reject(error);
                if (results.affectedRows > 0) {
                    console.log('consulta:', results);
                    if (results.changedRows > 0) {
                        resolve('Se ha modificado el usuario "' + usuario.cedula_usuario + '" a tipo "' + usuario.rol_usuario + '"');
                    } else {
                        resolve('El usuario "' + usuario.cedula_usuario + '"  ya es de tipo "' + usuario.rol_usuario + '"');
                    }
                } else {
                    console.log('Usuario no existe');
                    reject('No existe ningún usuario con la cédula indicada: ' + usuario.cedula_usuario);
                }
            })
        })
    }
}

module.exports = new UsuarioModel();