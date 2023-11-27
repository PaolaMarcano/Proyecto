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


module.exports=router;