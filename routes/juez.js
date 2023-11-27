var express = require('express');
var router = express.Router();
const Juez_Controller = require('../controllers/Juez_Controller');
const { checkLoginView, checkAdminView, checkRootView } = require('../auth/authViews')

/*GET VIEWS*/

router.get('/verJueces', checkLoginView, function(req, res, next){
    Juez_Controller.ver_jueces().then((resultados) => {
        let jueces = resultados;
        res.render('./viewsJueces/verJueces', { title: 'Jueces', juez: jueces});
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
})


/*DELETE VIEWS*/

router.get('/eliminarJuez/:index', checkAdminView,function(req,res, next){
    Juez_Controller.buscar_juez(req.params.index).then((resultado) => {
        let juez_a_eliminar = resultado
        res.render('./viewsJueces/eliminarJuez', { title: '¿Quiere eliminar este juez?', juez: juez_a_eliminar });
     }).catch((error) => {
        if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
        else { res.status(500).send(error) }
     })
});

router.delete('/eliminarJuez/:index', checkAdminView,function(req,res, next){
    Juez_Controller.eliminar_juez(req.params.index).then((resultado) => {
        res.send("Eliminado con exito");
    }).catch((error) => {
        res.status(500).send(error)
    })
});

module.exports = router; 