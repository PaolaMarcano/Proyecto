var express = require('express');
var router = express.Router();
const Organizador_Controller = require('../controllers/Organizadores_Controller');
const Eventos_Controller = require('../controllers/Eventos_Controller');
const { checkLogin, checkAdmin, checkRoot, checkDatetime } = require('../auth/auth');
const { checkAdminView } = require('../auth/authViews');
const responderErr = require('./respuestas');

/* GET modalidades */
router.get('/', function (req, res, next) {
    console.log('router GET')
    Organizador_Controller.ver_organizador()
        .then((resultados) => {
            console.log('router bien'); console.table(resultados.resultado);
            //res.send(resultados.resultado);
            res.render('./viewsOrganizadores/verOrganizador', { mainTitle: "UVM|Robotica|Organizadores", title: "Organizadores", tabla: resultados.resultado, subtitulos: "nombre" })
        })
        .catch((error) => {
            console.log('router mal')
            responderErr(error, res);
        })
});

router.get('/ingresar', function (req, res, next) {
    Eventos_Controller.ver_eventos_views().then((eventos) => {
        res.render('./viewsOrganizadores/nuevoOrganizador', { mainTitle: "UVM|Robotica|Organizadores", title: "Ingresar nuevo organizador", eventos: eventos })
    }).catch((error) => {
        responderErr(error, res);
    })

});

router.post('/ingresar', function (req, res, next) {
    console.log('router POST')
    if (!req.body.eventos) { res.render('error', { message: "Debe seleccionar un evento", error: { status: 400 } }) }
    console.log(req.body.eventos);
    if (req.body.eventos.length == 1) req.body.eventos = [req.body.eventos];

    Organizador_Controller.ingresar_organizador(req.body)
        .then((resultados) => {
            //console.log('router bien'); console.table(resultados.resultado);
            //res.send(resultados.resultado);
            res.redirect('./');
        })
        .catch((error) => {
            console.log('router mal')
            responderErr(error, res);
        })
});

module.exports = router; 