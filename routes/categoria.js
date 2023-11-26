var express = require('express');
var router = express.Router();
const Categoria_Controller = require('../controllers/Categoria_Controller');
const Modalidad_Controller = require('../controllers/Modalidad_Controller');
const { checkLogin, checkAdmin, checkRoot, checkDatetime } = require('../auth/auth');
const { checkLoginView, checkAdminView, checkRootView } = require('../auth/authViews')

/* GET  */
router.get('/', function (req, res, next) {
    Categoria_Controller.ver_categorias().then((resultados) => {
        res.json(resultados);
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

/* POST */
router.post('/', checkAdmin, function (req, res, next) {
    Categoria_Controller.ingresar_categoria(req.body)
        .then(() => {
            Categoria_Controller.ver_categorias()
                .then((resultados) => {
                    res.json(resultados);
                })
                .catch((error) => {
                    res.status(error.codigo).send(error.mensaje);
                })
        })
        .catch((error) => {
            res.status(error.codigo).send(error.mensaje);
        })
});

router.get('/equipos/:index', checkAdmin, function (req, res, next) {
    //console.log('CAT ROUTER:', req.params.index, req.body);
    Categoria_Controller.ver_equipos_por_categoria(req.params.index, null).then((resultados) => {
        res.json(resultados);
        
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

router.get('/participantes', checkAdmin, function (req, res, next) {
    //console.log('CAT ROUTER:', req.params.index, req.body);
    Categoria_Controller.ver_equipos_por_categoria(null, req.body).then((resultados) => {
        res.json(resultados);
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

/* router.put('/:editar', checkAdmin, function (req, res, next) {
    //console.log('en routes', req.params.editar, req.body);
    Categoria_Controller.editar_categoria(req.params.editar, req.body)
        .then((resultados) => {
            //console.info(resultados);
            res.json(resultados);
        })
        .catch((error) => {
            //console.info(error);
            res.status(error.codigo).send(error.mensaje);
        })
}); */

router.patch('/:editar', checkAdmin, function (req, res, next) {
    //console.log('en routes', req.params.editar, req.body);
    Categoria_Controller.modificar_categoria(req.params.editar, req.body)
        .then((resultados) => {
            //console.info(resultados);
            res.send(resultados);
        })
        .catch((error) => {
            //console.info(error);
            res.status(error.codigo).send(error.mensaje);
        })
});
/* DELETE */
router.delete('/:index', checkAdmin, function (req, res, next) {
    Categoria_Controller.eliminar_categoria(req.params.index).then((resultados)=>{
        res.status(resultados.codigo).send(resultados.mensaje);
    }).catch((error)=>{
        res.status(error.codigo).send(error.mensaje);
    }) 
}); 


/*VIEWS*/

router.get('/nuevaCategoria', checkAdminView,function(req,res, next){
    Modalidad_Controller.ver_modalidad()
    .then((resultados) => {
        let modalidades = resultados.mensaje
        res.render('./viewsCategorias/nuevaCategoria',{title: 'Crear una Categoría', modalidades: modalidades});
    })
    .catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

router.post('/nuevaCategoria', checkAdminView, function (req, res, next) {
    Categoria_Controller.ingresar_categoria(req.body)
    .then(() => {
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
            if (error.codigo && error.mensaje && error.mensaje.sqlMessage) { res.render('error', { message: error.mensaje.sqlMessage, error: { status: error.codigo } }) }
            else if (error.codigo && error.mensaje) { res.render('error', { message: error.mensaje, error: { status: error.codigo } }) }
            else { res.status(500).send(error) }
        })
    })
    .catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

/* PUT VIEWS */

router.get('/editarCategoria/:index', checkAdminView,function(req,res, next){
    Modalidad_Controller.ver_modalidad()
    .then((resultados) => {
        Categoria_Controller.buscar_categoria_id(req.params.index) .then((resultado) => {
            let modalidades = resultados.mensaje;
            let categoria_a_editar = resultado;
            console.log(categoria_a_editar)
            res.render('./viewsCategorias/editarCategoria',{title: 'Editar una Categoría', modalidades: modalidades, categoria: categoria_a_editar});
        })
        .catch((error) => {
            res.status(error.codigo).send(error.mensaje);
        })
    })
    .catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

router.put('/editarCategoria/:index', checkAdminView,function(req,res, next){
    Categoria_Controller.editar_categoria(req.params.index, req.body)
    .then(() => {
        Modalidad_Controller.ver_modalidadYcat_viewsPublic().then((resultados) => {
            res.render('./viewsModalidades/verModalidades', {
                title: 'Modalidades y Categorías',
                tabla: resultados,
                subtitulos: "nombre_modalidad",
                array: "Categorias",
                subtitulos2: "nombre_categoria"
            });
        }).catch((error) => {
            if (error.codigo && error.mensaje && error.mensaje.sqlMessage) { res.render('error', { message: error.mensaje.sqlMessage, error: { status: error.codigo } }) }
            else if (error.codigo && error.mensaje) { res.render('error', { message: error.mensaje, error: { status: error.codigo } }) }
            else { res.status(500).send(error) }
        })
    })
    .catch((error) => {
        //console.info(error);
        res.status(error.codigo).send(error.mensaje);
    })
});

/* DELETE VIEWS */

router.get('/eliminarCategoria/:index', checkAdminView,function(req,res, next){
    Categoria_Controller.buscar_categoria_id(req.params.index) .then((resultado) => {
        let categoria_a_eliminar = resultado;
        console.log(categoria_a_eliminar)
        res.render('./viewsCategorias/eliminarCategoria',{title: '¿Quiere Eliminar está categoría?',categoria: categoria_a_eliminar});
    })
    .catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

router.delete('/eliminarCategoria/:index', checkAdminView,function(req,res, next){
   Categoria_Controller.eliminar_categoria(req.params.index).then((resultados)=>{
        res.send("Eliminado correctamente")
    }).catch((error)=>{
        res.status(error.codigo).send(error.mensaje);
    }) 
});

module.exports = router; 