var express = require('express');
var router = express.Router();
const Juez_Controller = require('../controllers/Juez_Controller');
const Eventos_Controller = require('../controllers/Eventos_Controller');
const { checkLoginView, checkAdminView, checkRootView } = require('../auth/authViews');
const responderErr = require('./respuestas');

/*GET VIEWS*/

router.get('/verJueces', checkLoginView, function(req, res, next){
    Juez_Controller.ver_jueces().then((resultados) => {
        let jueces = resultados;
        res.render('./viewsJueces/verJueces', { title: 'Jueces', juez: jueces});
    }).catch((error) => {
        responderErr(error, res);
    })
})


/* POST VIEWS */

router.get('/nuevoJuez', checkLoginView,function(req,res, next){
    Eventos_Controller.ver_eventos_views().then((resultados) => {
        let eventos = resultados;
        res.render('./viewsJueces/nuevoJuez', { title: 'Ingresar un Juez', eventos: eventos});
    }).catch((error) => {
        responderErr(error, res);
    })
});

router.post('/nuevoJuez', checkLoginView,function(req,res, next){
    if (req.body.eventos) {
        if (req.body.eventos.length == 1) {
            req.body.eventos = [req.body.eventos]
        }
        let juez = req.body
        Juez_Controller.ingresar_juez(juez).then((jurado) => {
            Juez_Controller.ingresar_jurado(jurado).then(() => {
                res.redirect('./verJueces')
             }).catch((error) => {
                responderErr(error, res);
             })
        }).catch((error) => {
            responderErr(error, res);
        })
    } else {
        res.status(400).send("Participa en algún evento")
    } 
});


/*DELETE VIEWS*/

router.get('/eliminarJuez/:index', checkAdminView,function(req,res, next){
    Juez_Controller.buscar_juez(req.params.index).then((resultado) => {
        let juez_a_eliminar = resultado
        res.render('./viewsJueces/eliminarJuez', { title: '¿Quiere eliminar este juez?', juez: juez_a_eliminar });
     }).catch((error) => {
        responderErr(error, res);
     })
});

router.delete('/eliminarJuez/:index', checkAdminView,function(req,res, next){
    Juez_Controller.eliminar_juez(req.params.index).then((resultado) => {
        res.send("Eliminado con exito");
    }).catch((error) => {
        responderErr(error, res);
    })
});

module.exports = router; 