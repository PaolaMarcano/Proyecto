const Usuario_model = require('../models/Usuario_model');
const { Respuesta } = require('../models/metodos');

class UsuarioController {
  ver_usuarios() {
    return new Promise((resolve, reject) => {
      Usuario_model.mostrar_usuarios().then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) });
    })
  }
  encontrar_usuario(id) {
    return new Promise((resolve, reject) => {
      Usuario_model.buscar_usuario(id).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) })
    })
  }
  encontrar_usuario_views(cedula) {
    return new Promise((resolve, reject) => {
      Usuario_model.buscar_usuario_cedula(cedula).then((usuario) => {
        console.log("Resultado de la búsqueda por C.I:", usuario);
        resolve(usuario[0]);
      }).catch((error) => { reject(error) })
    })
  }
  registrar_usuario(nuevo_usuario) {
    return new Promise((resolve, reject) => {
      const relogin = Object.assign({}, nuevo_usuario);
      delete relogin.correo_usuario;
      delete relogin.rol_usuario;
      Usuario_model.guardar_usuario(nuevo_usuario).then((resultado) => {
        console.log(resultado, "\n Ingresando al sistema.");
        Usuario_model.login(relogin).then((token) => { resolve(token) }).catch((error) => { reject(error) });
      }).catch((error) => { reject(error) });
    })
  }
  login(usuario) {
    return new Promise((resolve, reject) => {
      Usuario_model.login(usuario).then((token) => {
        resolve(token)
      }).catch((error) => { reject(error) });
    })
  }
  modificar_usuario(id, actualizar) {
    return new Promise((resolve, reject) => {
      Usuario_model.modificar_usuario(id, actualizar).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) })
    })
  }
  editar_usuario(id, actualizar) {
    return new Promise((resolve, reject) => {
      if (id != undefined && !isNaN(Number(id))) {
        Usuario_model.modificar_usuario_views(id, actualizar).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) })
      } else {
        return reject(new Respuesta(400, 'No se ingresó un ID válido: ' + id, id));
      }
    })
  }
  cambiar_clave(id, actualizar) {
    return new Promise((resolve, reject) => {
      if (id != undefined && !isNaN(Number(id))) {
        if (actualizar.nueva != actualizar.confirmar) return reject(new Respuesta(400, 'No repitió correctamente su nueva contraseña. Intente de nuevo.', actualizar));
        if (actualizar.nueva == actualizar.anterior) return reject(new Respuesta(400, 'Ingresó la misma contraseña que la anterior. Verifique.', actualizar));
        Usuario_model.cambiar_clave_views(id, actualizar)
          .then((resultado) => { resolve(resultado) })
          .catch((error) => { reject(error) })
      } else {
        return reject(new Respuesta(400, 'No se ingresó un ID válido: ' + id, id));
      }
    })
  }
  borrar_usuario(id) {
    return new Promise((resolve, reject) => {
      Usuario_model.eliminar_usuario(id).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) })
    })
  }
  cambiar_rol(usuario) {
    return new Promise((resolve, reject) => {
      Usuario_model.cambiar_rol(usuario).then((resultado) => { resolve(resultado) }).catch((error) => { reject(error) })
    })
  }
}

module.exports = new UsuarioController();