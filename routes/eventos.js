var express = require('express');
var router = express.Router();
const Eventos_Controller = require('../controllers/Eventos_Controller');
const Categoria_Controller = require('../controllers/Categoria_Controller')
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
router.get('/nuevoEvento', checkAdminView, function (req, res, next) { 
    Categoria_Controller.ver_categorias().then((resultados)=>{
        let nombre_categoria= resultados;
        res.render('./viewsEventos/nuevoEvento',{title: 'Crear un Evento',categorias:nombre_categoria});
    })
    .catch((error)=>{
        res.status(error.codigo).send(error.mensaje);
    })
});

/* VIEW POST */
router.post('/nuevoEvento', checkAdminView, function (req, res, next) {
    Eventos_Controller.ingresar_evento(req.body).then((resultados) => {
            res.redirect('./verEvento')
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