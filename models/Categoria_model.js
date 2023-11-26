const connection = require('../config/conexion');
const { Respuesta, validarClass } = require('./metodos');

class Categoria {
    constructor(idModalidad, nombre_categoria, descripcion, reglas, premio) {
        this.idModalidad = idModalidad;
        this.nombre_categoria = nombre_categoria;
        this.descripcion = descripcion;
        this.reglas = reglas;
        this.premio = premio;
    }
}

class CategoriaModel {
    ver_categorias() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `categorias`', function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(500, err, err));
                } else if (rows) {
                    if (rows.length == 0) {
                        reject(new Respuesta(404, 'No existen equipos registrados', rows));
                    } else {
                        resolve(rows)
                    }
                }
            })
        })
    }
    buscar_categoria(id_cat_URI, nom_cat_body) {//Para buscar la categoría por una propiedad
        return new Promise((resolve, reject) => {
            if (nom_cat_body == null) { console.log('No por body'); resolve(id_cat_URI) }
            if (id_cat_URI == null && typeof nom_cat_body == "object" && Object.keys(nom_cat_body).length > 0) {
                let consulta = connection.query('SELECT * FROM `categorias` WHERE ?', nom_cat_body, function (error, results, fields) {
                    if (error) {
                        //console.error("Error SQL: ", error);
                        reject(new Respuesta(500, error, error));
                        return
                    };
                    if (results.length > 0) {
                        //console.log("ENCONTRADO", results);
                        console.log('ID ENCONTRADO:', results[0].id_categoria);
                        resolve(results[0].id_categoria);
                    } else {
                        //console.error("Error: No se encontraron coincidencias", results);
                        reject(new Respuesta(404, "No se encontraron categorías con esas propiedades", results));
                    };
                });
                //console.log(consulta.sql)
            } else {
                reject(new Respuesta(400, 'Error: No ingresó ningún dato', null));
            }
        })
    }
    buscar_categoria_id(id_cat) {//Para mostrar la categoria actualizada
        return new Promise((resolve, reject) => {
            if (isNaN(Number(id_cat))) reject(new Respuesta(400, 'Ingresó un ID inválido: ' + id_cat, null));
            connection.query('SELECT * FROM `categorias` WHERE ?', { id_categoria: id_cat }, function (error, results, fields) {
                if (error) {
                    console.error("Error SQL: ", error);
                    reject(new Respuesta(500, error, error));
                    return
                } else if (results && results.length > 0) {
                    //console.log("ENCONTRADO", results);
                    resolve(results);
                    //resolve(results[0].id_categoria);
                } else {
                    //console.error("Error: No se encontraron coincidencias", results);
                    reject(new Respuesta(404, "Error: No se encontraron coincidencias", results));
                };
            });
        })


    }
    ver_equipos_por_categoria(id_cat, nom_cat) {
        console.log('CAT models:', id_cat, nom_cat);
        return new Promise(async (resolve, reject) => {
            try {
                let id = await this.buscar_categoria(id_cat, nom_cat);
                console.log('CAT buscar:', id);
                if (isNaN(Number(id))) reject(new Respuesta(400, "Error! Se introdujo un ID inválido: " + id, id));
                connection.query('SELECT `nombre_categoria`,`id_equipo`,`representante`, `email`, `telefono`, `nombre_de_equipo`, `participantes`, `comentario` FROM `inscripciones` JOIN `categorias` ON `id_categoria` = `idCategoria` JOIN `equipos` ON `id_equipo` = `idEquipo` WHERE `id_categoria` = ?', id, function (err, rows, fields) {
                    if (err) {
                        reject(new Respuesta(500, err, err));
                    } else {
                        //console.log('RESULTADOS',rows, rows.length)
                        if (rows.length < 1) {
                            //console.log('VACIO')
                            reject(new Respuesta(404, 'No se encontraron equipos inscritos en la categoría indicada', rows));
                        }
                        resolve(rows);
                    }
                })
            } catch (error) {
                console.error(error.codigo);
                reject(new Respuesta(error.codigo, error.mensaje, error.resultado));
            }
        })
    }
    ingresar_categoria(categoria) {
        return new Promise((resolve, reject) => {
            let Nueva_categoria = new Categoria(categoria.idModalidad, categoria.nombre_categoria, categoria.descripcion, categoria.reglas, categoria.premio)
            if (validarClass(Nueva_categoria, reject, [], 400) !== true) return;
            connection.query('INSERT INTO `categorias` SET ?', Nueva_categoria, function (err, rows, fields) {
                if (err) {
                    if (err.errno == 1062) { reject(new Respuesta(400, err.sqlMessage.substring(16).replace('for key', 'ya existe como'), err)); }
                    else if (err.errno == 1048) { reject(new Respuesta(400, "No ingresó nungún dato en: " + err.sqlMessage.substring(7).replace(' cannot be null', ''), err)); }
                    else { reject(new Respuesta(500, err, err)) }
                } else if (rows) {
                    console.table(rows);
                    resolve(rows);
                }
            })
        })
    }
    editar_categoria(id, categoria) {
        const buscar = async (id_cat_up, bien, mal) => {
            try {
                bien(await this.buscar_categoria_id(id_cat_up));
            } catch (error) {
                mal(error);
            }
        }
        return new Promise((resolve, reject) => {
            //console.log("en models", id, categoria);
            let act_categoria = new Categoria(categoria.idModalidad, categoria.nombre_categoria, categoria.descripcion, categoria.reglas, categoria.premio);
            if (validarClass(act_categoria, reject, [], 400) !== true) return;
            let query = connection.query('UPDATE `categorias` SET ? WHERE id_categoria = ?', [act_categoria, id], function (error, results, fields) {
                if (error) { reject(new Respuesta(500, error, error)); return };
                //console.log('\n ACTUALIZAR: '); console.table(results);
                if (!results) { reject(new Respuesta(500, "Error!", results)); return }
                else if (results.affectedRows < 1) {
                    console.error('El equipo "' + id + '" no existe');
                    reject(new Respuesta(404, 'No existe ninguna categoría con el ID indicado: ' + id, results));
                } else if (results.changedRows > 0) {
                    console.log("Actualizado");
                    buscar(id, resolve, reject);
                    //resolve(new Respuesta(200, "Se ha actualizado exitosamente", results));
                    //resolve('Se ha modificado la categoría "' + id + '" (' + actualizar.nombre_categoria + ')');
                } else {
                    resolve("No se modificó la categoría '" + id + "', debido a que los datos ingresados son iguales.");
                }
            });
            //console.log("consulta", query.sql);
        })
    }
    modificar_categoria(id, actualizar) {
        const buscar = async (id_cat_up, bien, mal) => {
            try {
                bien(await this.buscar_categoria_id(id_cat_up));
            } catch (error) {
                mal(error);
            }
        }
        return new Promise((resolve, reject) => {
            //console.log("en models", id, actualizar);
            if (validarClass(actualizar, reject, [], 400) !== true) return;
            if (typeof actualizar != "object" || Object.keys(actualizar).length < 1) { reject(new Respuesta(400, "No se ingresaron datos para actualizar", actualizar)); return };
            let query = connection.query('UPDATE `categorias` SET ? WHERE id_categoria = ?', [actualizar, id], function (error, results, fields) {
                if (error) { reject(new Respuesta(500, error, error)); return };
                //console.log('ACTUALIZAR: \n', results);
                if (!results) { reject(new Respuesta(500, "Error!", results)); return }
                else if (results.affectedRows < 1) {
                    console.log('La categoría "' + id + '" no existe');
                    reject(new Respuesta(404, 'No existe ninguna categoría con el ID indicado: ' + id, results));
                } else if (results.changedRows < 1) {
                    resolve("No se modificó la categoría '" + id + "', debido a que los datos ingresados son iguales.");
                }
                //resolve('Se ha modificado la categoría "' + id + '" (' + actualizar.nombre_categoria + ')');
                console.log("Actualizado");
                buscar(id, resolve, reject);
            });
            //console.log("consulta", query.sql);
        })
    }
    eliminar_categoria(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `categorias` WHERE `id_categoria` = ?', id, function (err, rows, fields) {
                if (err) {
                    reject(new Respuesta(400, err, err))
                } else if (rows) {
                    if (rows.affectedRows > 0) {
                        resolve(new Respuesta(200, "Se ha eliminado exitosamente", rows));
                    } else {
                        reject(new Respuesta(404, 'No se eliminó la categoría "' + id + '". Es posible de que ya no exista.', rows));
                    }
                }
            })
        })
    }
}

module.exports = new CategoriaModel();