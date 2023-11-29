const Eventos_model = require('../models/Eventos_model');
const { Respuesta } = require('../models/metodos');

class EventoController{
  ver_eventos() {
    return new Promise((resolve, reject) => {
        Eventos_model.ver_eventos()
            .then((resultado) => { resolve(resultado) })
            .catch((error) => { reject(error) });
            
    })
  }
  ver_eventos_views(){
    return new Promise((resolve, reject) => {
      Eventos_model.ver_eventos_views()
          .then((resultado) => { resolve(resultado) })
          .catch((error) => { reject(error) });     
    })
  }
  ingresar_evento(evento){
    return new Promise((resolve,reject)=>{
        Eventos_model.ingresar_evento(evento).then((resultado)=> { resolve(resultado)}).catch((error)=>{reject (error)});
    })
}
}
module.exports = new EventoController();