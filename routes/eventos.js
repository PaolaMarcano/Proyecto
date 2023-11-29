var express = require('express');
var router = express.Router();
const Eventos_Controller = require('../controllers/Eventos_Controller');
const { checkLogin, checkAdmin, checkRoot, checkDatetime } = require('../auth/auth');
const { checkLoginView, checkAdminView, checkRootView } = require('../auth/authViews')

/*GET */
router.get('/', function (req, res, next) {
    Eventos_Controller.ver_eventos().then((resultados) => {
        res.json(resultados);
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});
/* POST */
router.post('/', function (req, res, next) {
    Eventos_Controller.ingresar_evento(req.body).then(()=>{
        Eventos_Controller.ver_eventos().then((resultados)=>{
            res.json(resultados);
        }).catch((error)=>{
            res.status(500).send(error)
        })
    })
});
/* VIEWS*/ 
router.get('/nuevoEvento', function (req, res, next) { 
    Categoria_Controller.ver_categorias().then((resultados)=>{
        let nombre_categoria= resultados;
        res.render('./viewsEventos/nuevoEvento',{title: 'Crear un Evento',categorias:nombre_categoria});
    })
    .catch((error)=>{
        res.status(error.codigo).send(error.mensaje);
    })
});

/* VIEW POST */
router.post('/nuevoEvento', function (req, res, next) {
    Eventos_Controller.ingresar_evento(req.body).then((resultados) => {
            Eventos_Controller.ver_eventos().then((resultados)=>{
                res.render('./viewsEventos/nuevoEvento',{title:'Crear un Evento', sede:sede, fecha_del_evento:fecha_del_evento});
            }).catch((error) => {
                if (error.codigo && error.mensaje && error.mensaje.sqlMessage) { res.render('error', { message: error.mensaje.sqlMessage, error: { status: error.codigo } }) }
                else if (error.codigo && error.mensaje) { res.render('error', { message: error.mensaje, error: { status: error.codigo } }) }
                else { res.status(500).send(error) }
            })
           
        })
        .catch((error) => {
            res.status(error.codigo).send(error.mensaje);
        })

});
/* VIEW GET */
router.get('/verEvento', function (req, res, next) { 
         Eventos_Controller.ver_eventos_views().then((resultados) => {
                let eventos= resultados; 
                res.render('./viewsEventos/verEvento',{title:'Eventos',eventos:eventos});
         }).catch((error) => {
                res.status(error.codigo).send(error.mensaje);
         }) 
            
      
});

module.exports=router;