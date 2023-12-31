var express = require('express');
var router = express.Router();
const Equipos_Controller = require('../controllers/Equipos_Controller')
const Modalidad_Controller = require('../controllers/Modalidad_Controller');
const Categoria_Controller = require('../controllers/Categoria_Controller')
const { checkLogin, checkAdmin, decodificar } = require('../auth/auth');
const { checkLoginView, checkAdminView, checkRootView } = require('../auth/authViews')
const responderErr = require('./respuestas');

/* GET */

router.get('/', checkAdmin, function (req, res, next) {
    Equipos_Controller.ver_equipos().then((resultados) => {
        res.json(resultados);
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});


/* POST */
router.post('/', checkLogin, function (req, res, next) {
    let decoded = decodificar(req.headers.authorization);
    if (!decoded || isNaN(decoded.id)) { res.status(400).send("Error al leer token"); return }
    let equipo = req.body;
    equipo.id_user = decoded.id;
    Equipos_Controller.ingresar_equipo(req.body).then((inscripcion) => {
        Equipos_Controller.ingresar_inscripcion(inscripcion).then(() => {
            Equipos_Controller.ver_equipos().then((resultados) => {
                res.json(resultados);
            }).catch((error) => {
                res.status(error.codigo).send(error.mensaje);
            })
        }).catch((error) => {
            res.status(error.codigo).send(error.mensaje);
        })
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

/* DELETE */
router.delete('/:index', checkAdmin, function (req, res, next) {
    Equipos_Controller.eliminar_equipo(req.params.index).then((resultados) => {
        res.status(resultados.codigo).send(resultados.mensaje);
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});


/*Ver padrinos*/
router.get('/padrinos', checkAdmin, function (req, res, next) {
    Equipos_Controller.ver_padrinos().then((resultados) => {
        res.json(resultados);
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});

/*Eliminar categoria inscrita*/
router.delete('/sin_categoria/:index/:index2', checkLogin, function (req, res, next) {
    Equipos_Controller.eliminar_categoria_inscrita(req.params.index, req.params.index2).then((resultados) => {
        res.status(resultados.codigo).send(resultados.mensaje);
    }).catch((error) => {
        res.status(error.codigo).send(error.mensaje);
    })
});


/*Editar equipo*/
router.put('/editar_equipo/:editar', checkLogin, function (req, res, next) {
    let decoded = decodificar(req.headers.authorization);
    if (!decoded || isNaN(decoded.id)) { res.status(400).send("Error al leer token"); return }
    let equipo = req.body;
    equipo.verificado = "verificado";
    equipo.id_user = decoded.id;
    Equipos_Controller.editar_equipo(req.params.editar, req.body)
        .then((resultados) => {
            res.status(resultados.codigo).send(resultados.mensaje);
        })
        .catch((error) => {
            res.status(error.codigo).send(error.mensaje);
        })
    console.table(req.body)
});



/* Views */

router.get('/verEquipo', checkAdminView, function (req, res, next) {
    Equipos_Controller.ver_equipos_views().then((resultados) => {
        if (resultados == null) { res.status(404).send("No se han registrado equipos") }
        else {
            res.render('./viewsEquipos/verEquipos', { title: 'Equipos Participantes', tabla: resultados, subtitulos: "nombre_de_equipo" });
        };
    }).catch((error) => {
        responderErr(error,res);
    })
});

/*Ver equipos usuarioEditor*/

router.get('/verEquipoUser', checkLoginView, function (req, res, next) {
    let decoded = decodificar(req.cookies.jwt);
    if (!decoded && isNaN(decoded.id)) { res.status(400).send("Error al leer token"); return }
    console.log("decodificar",decoded.id)
    Equipos_Controller.seleccionarEquipoByID(decoded.id).then((resultados) => {
        if (resultados == null) { res.render('error', { message: "No se han registrado equipos con tu usuario", error: { status: 404 } }) }
        else {
            res.render('./viewsEquipos/verEquipos', { title: 'Equipos Participantes', tabla: resultados, subtitulos: "nombre_de_equipo" });
        };
    }).catch((error) => {
        responderErr(error,res);
    })
});


/* VIEWS POST*/

router.get('/nuevoEquipo', checkLoginView, function (req, res, next) {
    Modalidad_Controller.poder_inscribir().then((resultados) => {
        let inscripciones = resultados
        res.render('./viewsEquipos/nuevoEquipo', { title: 'Crear un Equipo', categorias: inscripciones });
    }).catch((error) => {
        responderErr(error,res);
    })
})

router.post('/nuevoEquipo', checkLoginView, function (req, res, next) {
    let decoded = decodificar(req.cookies.jwt);
    if (!decoded || isNaN(decoded.id)) { res.status(400).send("Error al leer token"); return }
    if (req.body.categorias) {
        if (req.body.categorias.length == 1) {
            req.body.categorias = [req.body.categorias]
        }
        let equipo = req.body
        equipo.id_user = decoded.id
        Equipos_Controller.ingresar_equipo(equipo).then((inscripcion) => {
            Equipos_Controller.ingresar_inscripcion(inscripcion).then(() => {
               res.redirect('./verEquipoUser')
            }).catch((error) => {
                responderErr(error,res);
            })
        }).catch((error) => {
            responderErr(error,res);
        })
    } else {
        res.status(400).send("Inscribete en alguna categoría")
    }
})


/* VIEWS PUT*/

router.get('/editarEquipo/:index', checkLoginView,function(req,res, next){
    Equipos_Controller.buscar_equipo(req.params.index).then((resultado) => {
        let equipo_a_editar = resultado;
        res.render('./viewsEquipos/editarEquipo',{title: 'Equipo',equipo: equipo_a_editar});
    })
    .catch((error) => {
        responderErr(error,res);
    })
});

router.put('/editarEquipo/:index',checkLoginView,function(req,res, next){
    let decoded = decodificar(req.cookies.jwt);
    if (!decoded || isNaN(decoded.id)) { res.status(400).send("Error al leer token"); return }
    let equipo = req.body;
    equipo.id_user = decoded.id;
    equipo.verificado = "verificado";
    Equipos_Controller.editar_equipo(req.params.index, equipo)
    .then(() => {
        Equipos_Controller.ver_equipos_views().then((resultados) => {
            if (resultados == null) { res.status(404).send("No se han registrado equipos") }
            else {
                res.render('./viewsEquipos/verEquipos', { title: 'Equipos Participantes', tabla: resultados, subtitulos: "nombre_de_equipo" });
            };
        }).catch((error) => {
            responderErr(error,res);
        })
    })
    .catch((error) => {
        responderErr(error,res);
    })
});



/* VIEWS DELETE */

router.get('/eliminarEquipo/:index', checkAdminView,function(req,res, next){
    Equipos_Controller.buscar_equipo(req.params.index).then((resultado) => {
        let equipo_a_eliminar = resultado;
        res.render('./viewsEquipos/eliminarEquipo',{title: '¿Quiere Eliminar este equipo?',equipo: equipo_a_eliminar});
    })
    .catch((error) => {
        responderErr(error,res);
    })
});

router.delete('/eliminarEquipo/:index', checkAdminView,function(req,res, next){
    Equipos_Controller.eliminar_equipo(req.params.index).then((resultados) => {
        res.send("Eliminado correctamente")
    }).catch((error) => {
        responderErr(error,res);
    })
});

/* VIEWS GET PADRINOS */
router.get('/verPadrinos',checkAdminView,function (req, res, next) {
    Equipos_Controller.ver_padrinos().then((resultados) => {
        let equipos = resultados;
        res.render('./viewsEquipos/verEquiposyPadrinos',{title:'Equipos y sus padrinos',equipos:equipos});
    }).catch((error) => {
        responderErr(error,res);
    })
});
/* VIEWS GET CATEGORIAS INSCRITA EN EQUIPO */
router.get('/categoriaInscrita/:index',checkLoginView, function (req, res, next) {
    Equipos_Controller.ver_cat_equipos(req.params.index).then((resultados) => {
    let equipos = resultados;
    res.render('./viewsEquipos/verCategoria_deEquipo.ejs',{title:'Equipo y sus categorías',equipos:equipos, id_cat: null});
    }).catch((error) => {
        responderErr(error,res);
    })
});

/*Eliminar categorías de un equipo*/

router.get('/eliminarCategoriaInscrita/:index',checkLoginView,function (req, res, next) {
    Equipos_Controller.ver_cat_equipos_con_id(req.params.index).then((resultados) => {
    let equipos = resultados;
    res.render('./viewsEquipos/verCategoria_deEquipo.ejs',{title:'Equipo y sus categorías',equipos:equipos, id_cat: "presente"});
    }).catch((error) => {
        responderErr(error,res)
    })
});

router.get('/eliminarCategoriaInscrita/:index/:index2',checkLoginView, function (req, res, next) {
    Categoria_Controller.buscar_categoria_id(req.params.index2).then((resultados) => {
        let categoria = resultados;
        res.render('./viewsEquipos/eliminarInscripcion.ejs',{title:'¿Quiere dejar de participar en esta categoria?',id_equipo:req.params.index, categoria: categoria});
    }).catch((error) => {
        responderErr(error,res)
    })
}); 


router.delete('/eliminarCategoriaInscrita/:index/:index2',checkLoginView, function (req, res, next) {
    Equipos_Controller.eliminar_categoria_inscrita(req.params.index, req.params.index2).then((resultados) => {
        res.send("Inscripcion eliminada correctamente")
    
    }).catch((error) => {
        responderErr(error,res);
    })
    
}); 

module.exports = router; 