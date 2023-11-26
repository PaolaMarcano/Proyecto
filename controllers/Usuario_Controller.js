const Usuario_model = require('../models/Usuario_model');

class UsuarioController{
  ver_usuarios(){
    return new Promise((resolve, reject)=>{ 
      Usuario_model.mostrar_usuarios().then((resultado)=>{resolve(resultado)}).catch((error)=>{reject(error)});  
    })  
  } 
  encontrar_usuario(id){
    return new Promise((resolve, reject)=>{
      Usuario_model.buscar_usuario(id).then((resultado)=>{resolve(resultado)}).catch((error)=>{reject(error)})
    }) 
  }
  registrar_usuario(nuevo_usuario){
    return new Promise((resolve, reject)=>{
      Usuario_model.guardar_usuario(nuevo_usuario).then((resultado)=>{//token
        //resolve(token)
        resolve(resultado)
      }).catch((error)=>{reject(error)});    
    })  
  }
  login(usuario){
    return new Promise((resolve, reject)=>{
      Usuario_model.login(usuario).then((token)=>{
        resolve(token)
      }).catch((error)=>{reject(error)});    
    })  
  }
  modificar_usuario(id, actualizar){
    return new Promise((resolve, reject)=>{
      Usuario_model.modificar_usuario(id, actualizar).then((resultado)=>{resolve(resultado)}).catch((error)=>{reject(error)})
    }) 
  }
  borrar_usuario(id){
    return new Promise((resolve, reject)=>{
      Usuario_model.eliminar_usuario(id).then((resultado)=>{resolve(resultado)}).catch((error)=>{reject(error)})
    }) 
  }
  cambiar_rol(usuario){ 
    return new Promise((resolve, reject)=>{
      Usuario_model.cambiar_rol(usuario).then((resultado)=>{resolve(resultado)}).catch((error)=>{reject(error)})
    }) 
  }
}

module.exports = new UsuarioController();