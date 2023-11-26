var express = require('express');
var router = express.Router();
const UsuarioController = require('../controllers/Usuario_Controller');
const { checkLogin, checkAdmin, checkRoot, checkDatetime } = require('../auth/auth');

/* GET user. */
router.get('/', checkLogin, function (req, res, next) {
  UsuarioController.ver_usuarios().then((resultados) => {
    res.json(resultados);
  }).catch((error) => {
    if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
    else { res.status(500).send(error) }
  })
});

router.get('/:index', function (req, res, next) {
  UsuarioController.encontrar_usuario(req.params.index).then((resultado) => {
    res.json(resultado);
  }).catch((error) => {
    if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
    else { res.status(500).send(error) }
  })
});

/* POST new user. */
router.post('/crear', function (req, res, next) {
  UsuarioController.registrar_usuario(req.body).then((resultado) => { //token
    //res.send(token)
    console.log(req.body)
    res.send(resultado)
  }).catch((error) => {
    if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
    else { res.status(500).send(error) }
  })
});

router.post('/login', function (req, res, next) {
  UsuarioController.login(req.body).then((token) => {
    res.send(token)
  }).catch((error) => {
    if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
    else { res.status(500).send(error) }
  })
});

/* PUT user. */
router.put('/:index', checkLogin, function (req, res, next) {
  UsuarioController.modificar_usuario(req.params.index, req.body).then((token) => {
    res.send(token)
  }).catch((error) => {
    if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
    else { res.status(500).send(error) }
  })
});

/* DELETE user. */
router.delete('/:index', checkAdmin, function (req, res, next) {
  UsuarioController.borrar_usuario(req.params.index).then((resultado) => {
    res.send(resultado)
  }).catch((error) => {
    if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
    else { res.status(500).send(error) }
  })
});

/* PATCH user. */
router.patch('/user_manager', checkRoot, function (req, res, next) {
  console.log('en routes', req.body);
  UsuarioController.cambiar_rol(req.body)
    .then((resultados) => {
      res.send(resultados);
    })
    .catch((error) => {
      //EDITAR COD ERROR
      if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
      else { res.status(500).send(error) }
    })
});




/*Views */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
