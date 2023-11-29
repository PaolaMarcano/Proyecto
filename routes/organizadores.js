var express = require('express');
var router = express.Router();
const Organizador_Controller = require('../controllers/Organizadores_Controller');
const { checkLogin, checkAdmin, checkRoot, checkDatetime } = require('../auth/auth');
const { checkAdminView } = require('../auth/authViews');

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
            if (error.codigo && error.mensaje && error.mensaje.sqlMessage) { res.render('error', { message: error.mensaje.sqlMessage, error: { status: error.codigo } }) }
            else if (error.codigo && error.mensaje) { res.render('error', { message: error.mensaje, error: { status: error.codigo } }) }
            else { res.status(500).send(error) }
        })
});

module.exports = router; 