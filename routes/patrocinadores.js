var express = require('express');
var router = express.Router();
const Patrocinador_Controller = require('../controllers/Patrocinador_Controller');
const Equipos_Controller = require('../controllers/Equipos_Controller')
const { checkLogin, checkAdmin, checkRoot, checkDatetime } = require('../auth/auth');
const { checkLoginView, checkAdminView, checkRootView } = require('../auth/authViews')

/* GET patrocinantes. */

router.get('/', function (req, res, next) {
   Patrocinador_Controller.ver_patrocinador().then((resultados) => {
      res.json(resultados);
   }).catch((error) => {
      res.status(error.codigo).send(error.mensaje);
   })
});

/* POST */

router.post('/', checkAdmin, function (req, res, next) {
   if (req.body.idPatrocinio == 5) {
      if (req.body.idEquipo != "") {
         Patrocinador_Controller.ingresar_patrocinador(req.body).then((resultado) => {
            Patrocinador_Controller.ingresar_padrino(resultado).then(() => {
               Patrocinador_Controller.ver_patrocinador().then((resultados) => {
                  res.json(resultados);
               }).catch((error) => {
                  res.status(500).send(error)
               })
            }).catch((error) => {
               res.status(500).send(error)
            })
         }).catch((error) => {
            res.status(500).send(error)
         })
      } else {
         res.status(500).send("Para ser un padrino debe de patrocinar algún equipo")
      }
   } else {
      Patrocinador_Controller.ingresar_patrocinador(req.body).then(() => {
         Patrocinador_Controller.ver_patrocinador().then((resultados) => {
            res.json(resultados);
         }).catch((error) => {
            res.status(500).send(error)
         })
      }).catch((error) => {
         res.status(500).send(error)
      })
   }
});

/* DELETE */

router.delete('/:index', checkAdmin, function (req, res, next) {
   Patrocinador_Controller.eliminar_patrocinador(req.params.index).then((resultado) => {
      res.json(resultado);
   }).catch((error) => {
      res.status(500).send(error)
   })
})

/* PUT */
router.put('/:index', checkAdmin, function (req, res, next) {
   Patrocinador_Controller.buscar_patrocinador(req.params.index).then((resultado) => {
      Patrocinador_Controller.editar_patrocinador(resultado[0].idPatrocinio, req.params.index, req.body).then((resultado) => {
         res.json(resultado);
      }).catch((error) => {
         res.status(500).send(error)
      })
   }).catch((error) => {
      res.status(500).send(error)
   })

});

/* VIEWS */

router.get('/nuevoPatrocinador', checkAdminView, function (req, res, next) {
   Patrocinador_Controller.ver_patrocinios().then((resultados) => {
      Equipos_Controller.ver_equipos_sin_padrino().then((equipos) => {
         let patrocinios = resultados;
         let id_equipos = equipos
         res.render('./viewsPatrocinadores/nuevoPatrocinador', { title: 'Crear un Patrocinador', patrocinios: patrocinios, equipos: id_equipos });
      }).catch((error) => {
         if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
         else { res.status(500).send(error) }
      })
      //console.log(resultados)
   }).catch((error) => {
      if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
      else { res.status(500).send(error) }
   })
})

router.post('/nuevoPatrocinador', checkAdminView , function (req, res, next) {
   if (req.body.idPatrocinio == 5) {
      if (req.body.idEquipo) {
         Patrocinador_Controller.ingresar_patrocinador(req.body).then((resultado) => {
            Patrocinador_Controller.ingresar_padrino(resultado).then(() => {
               res.redirect('./todos')
            }).catch((error) => {
               if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
               else { res.status(500).send(error) }
            })
         }).catch((error) => {
            if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
            else { res.status(500).send(error) }
         })
      } else {
         res.status(404).send("Para ser un padrino debe de patrocinar algún equipo")
      }
   } else {
      Patrocinador_Controller.ingresar_patrocinador(req.body).then(() => {
         res.redirect('./todos')
      }).catch((error) => {
         if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
         else { res.status(500).send(error) }
      })
   }
});


/* GET patrocinantes Views. */

router.get('/ver', function (req, res, next) {
   Patrocinador_Controller.ver_patrocinador_viewsPublic().then((resultados) => {
      res.render('./viewsPatrocinadores/verPatrocinadores', { title: 'Patrocinadores del Evento', tabla: resultados, subtitulos: "Nombre comercial" });
   }).catch((error) => {
      if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
      else { res.status(500).send(error) }
   })
});

router.get('/todos', checkAdminView, function (req, res, next) {
   Patrocinador_Controller.ver_patrocinador_views().then((resultados) => {
      res.render('./viewsPatrocinadores/verPatrocinadores', { title: 'Patrocinadores del Evento', tabla: resultados, subtitulos: "Nombre comercial" });
   }).catch((error) => {
      if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
      else { res.status(500).send(error) }
   })
});

module.exports = router; 