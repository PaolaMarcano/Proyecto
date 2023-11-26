var express = require('express');
var router = express.Router();
const UsuarioController = require('../controllers/Usuario_Controller');
const { checkLogin, checkAdmin, decodificar } = require('../auth/auth');



/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home/register', function(req, res, next) {
  res.render('./userViews/register', { title: 'Express' });
});

router.post('/home/register', function(req, res, next) {
  //res.render('./userViews/register', { title: 'Express' });
  let data = req.body;
  if (data != null) {
    UsuarioController.registrar_usuario(req.body).then(() => {
      res.render('./userViews/register', { title: 'Express' });
    })
    .catch((error) => {
      if (error.codigo && error.mensaje) { res.status(error.codigo).send(error.mensaje) }
      else { res.status(500).send(error) }
    })
  }
});


router.get('/home/login', function(req, res, next) {
  res.render('./userViews/login', { title: 'Express' });
});

router.post('/home/login', function(req, res, next) {
  //res.render('./userViews/login', { title: 'Express' });
  UsuarioController.login(req.body).then((token) => {
    res.cookie("jwt", token.token, { maxAge: 3600000 })
    res.render('../views/userViews/UserHome', { user: token.nombre_usuario })
  }).catch((error) => {
    if (error.codigo && error.mensaje) {
      res.status(error.codigo).send(error.mensaje)
    } else { res.status(500).send(error) }
  })
});




module.exports = router;
