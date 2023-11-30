var express = require('express');
var router = express.Router();
const Modalidad_Controller = require('../controllers/Modalidad_Controller');
const { checkLogin, checkAdmin, checkRoot, checkDatetime } = require('../auth/auth');
const { checkAdminView } = require('../auth/authViews');
const responderErr = require('./respuestas');

/* GET modalidades */
router.get('/', function (req, res, next) {
    //console.log('router GET')
    Modalidad_Controller.ver_modalidad()
        .then((resultados) => {
            //console.log('router bien')
            res.send(resultados.resultado);
        })
        .catch((error) => {
            //console.log('router mal')
            res.status(error.codigo).send(error.mensaje);
        })
});

router.get('/verModalidadYCategoria/:index', function (req, res, next) {
    Modalidad_Controller.ver_modalidad_y_categoria(req.params.index)
        .then((resultados) => {
            res.send(resultados.resultado);
        })
        .catch((error) => {
            res.status(error.codigo).send(error.mensaje);
        })
});

router.post('/', checkAdmin, function (req, res, next) {
    //console.log('en routes', req.body);
    Modalidad_Controller.ingresar_modalidad(req.body)
        .then((resultados) => {
            res.send(resultados.resultado);
        })
        .catch((error) => {
            res.status(error.codigo).send(error.mensaje);
        })
});


/* VIEWS */

router.get('/ver', function (req, res, next) {
    Modalidad_Controller.ver_modalidadYcat_viewsPublic().then((resultados) => {
        //console.log(resultados)
        res.render('./viewsModalidades/verModalidades', {
            title: 'Modalidades y Categorías',
            tabla: resultados,
            subtitulos: "nombre_modalidad",
            array: "Categorias",
            subtitulos2: "nombre_categoria"
        });
    }).catch((error) => {
        responderErr(error, res);
    })
});

/* VIEWS POST */

router.get('/nuevaModalidad', checkAdminView, function (req, res, next) {
    Modalidad_Controller.ver_modalidad().then((resultados) => {
        let nombre_modalidad = resultados;
        res.render('./viewsModalidades/nuevaModalidad', { title: 'Crear una Modalidad', nombre_modalidad: nombre_modalidad });
    }).catch((error) => {
        responderErr(error, res);
    })

});

router.post('/nuevaModalidad', checkAdminView, function (req, res, next) {
    //console.log('en routes', req.body);
    Modalidad_Controller.ingresar_modalidad(req.body)
        .then((resultados) => {
            res.redirect('./ver')
        })
        .catch((error) => {
            responderErr(error, res);
        })
});


/*DELETE VIEWS*/

router.get('/eliminarModalidad/:index', checkAdminView,function(req,res, next){
    Modalidad_Controller.buscar_modalidad(req.params.index).then((resultado) => {
        let modalidad_a_eliminar = resultado;
        res.render('./viewsModalidades/eliminarModalidad',{title: '¿Quiere Eliminar esta modalidad?',modalidad: modalidad_a_eliminar});
    })
    .catch((error) => {
        responderErr(error, res);
    })
});

router.delete('/eliminarModalidad/:index', checkAdminView,function(req,res, next){
    Modalidad_Controller.eliminar_modalidad(req.params.index).then((resultado) => {
        res.send("Eliminada con exito");
    }).catch((error) => {
        responderErr(error, res);
    })
});

module.exports = router; 