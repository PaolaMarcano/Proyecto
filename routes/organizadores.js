var express = require('express');
var router = express.Router();
const Organizador_Controller = require('../controllers/Organizadores_Controller');
const Eventos_Controller = require('../controllers/Eventos_Controller');
const { checkLogin, checkAdmin, checkRoot, checkDatetime } = require('../auth/auth');
const { checkAdminView } = require('../auth/authViews');
const responderErr = require('./respuestas');
const Organizador_model = require('../models/Organizador_model');

/* GET modalidades */
router.get('/', checkAdminView, function (req, res, next) {
    console.log('route GET')
    Organizador_Controller.ver_organizador()
        .then((resultados) => {
            console.log('route bien'); console.table(resultados.resultado);
            //res.send(resultados.resultado);
            res.render('./viewsOrganizadores/verOrganizador', { mainTitle: "UVM|Robotica|Organizadores", title: "Organizadores", tabla: resultados.resultado, subtitulos: "nombre" })
        })
        .catch((error) => {
            console.log('route mal')
            responderErr(error, res);
        })
});

router.get('/ingresar', checkAdminView, function (req, res, next) {
    Eventos_Controller.ver_eventos_views().then((eventos) => {
        res.render('./viewsOrganizadores/nuevoOrganizador', { mainTitle: "UVM|Robotica|Organizadores", title: "Ingresar nuevo organizador", eventos: eventos })
    }).catch((error) => {
        responderErr(error, res);
    })
});

router.post('/ingresar', checkAdminView, function (req, res, next) {
    console.log('route POST'); console.log(req.body.eventos);
    if (!req.body.eventos) { res.render('error', { message: "Debe seleccionar un evento", error: { status: 400 } }); return }
    if (req.body.eventos.length == 1) req.body.eventos = [req.body.eventos];

    Organizador_Controller.ingresar_organizador(req.body)
        .then((resultados) => {
            //console.log('route bien'); console.table(resultados.resultado);
            //res.send(resultados.resultado);
            res.redirect('./');
        })
        .catch((error) => {
            console.log('route mal')
            responderErr(error, res);
        })
});

router.get('/eliminar', checkAdminView, function (req, res, next) {
    res.render('./viewsOrganizadores/idborrarOrganizador', { mainTitle: "UVM|Robotica|Organizadores", title: "Eliminar organizador" })
});

router.post('/eliminar', checkAdminView, function (req, res, next) {
    let idDEL = req.body.id_organizador;
    if (!idDEL || isNaN(Number(idDEL))) { res.render('error', { message: "No se ingresó un ID de organizador válido", error: { status: 400 } }) }
    else { res.redirect('./borrar/' + idDEL) }
});

router.get('/borrar/:index', checkAdminView, function (req, res, next) {
    Organizador_Controller.buscar_organizador(req.params.index)
        .then((resultado) => {
            console.log(resultado.resultado);
            res.render('./viewsOrganizadores/borrarOrganizador', {
                mainTitle: "UVM|Robotica|Organizadores",
                title: '¿Quiere eliminar este organizador?',
                organizador: resultado.resultado[0]
            });
        })
        .catch((error) => { responderErr(error, res); })
});

router.delete('/borrar/:index', checkAdminView, function (req, res, next) {
    Organizador_model.eliminar_organizador(req.params.index)
        .then((resultado) => {
            console.log(resultado.mensaje);
            res.redirect('../../');
        })
        .catch((error) => { responderErr(error, res); })
});


module.exports = router; 