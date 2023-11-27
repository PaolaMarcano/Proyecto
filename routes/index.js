var express = require('express');
var router = express.Router();
const UsuarioController = require('../controllers/Usuario_Controller');
const { checkLogin, checkAdmin, decodificar } = require('../auth/auth');
const { checkLoginView, resDateTime } = require('../auth/authViews')



/* GET home page. */
router.get('/home', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home/register', function (req, res, next) {
  res.render('./userViews/register', { title: 'Express' });
});

router.post('/home/register', function (req, res, next) {
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


router.get('/home/login', function (req, res, next) {
  if (req.cookies.jwt && typeof decodificar(req.cookies.jwt) == "object") { res.redirect('./menu'); return };
  res.render('./userViews/login', { title: 'Express' });
});

router.post('/home/login', function (req, res, next) {
  //res.render('./userViews/login', { title: 'Express' });
  UsuarioController.login(req.body).then((token) => {
    res.cookie("jwt", token.token, { maxAge: 3600000 });
    res.redirect('./menu');
  }).catch((error) => {
    if (error.codigo && error.mensaje) {
      res.status(error.codigo).send(error.mensaje)
    } else { res.status(500).send(error) }
  })
});

router.get('/home/menu', checkLoginView, function (req, res, next) {
  let decoded = decodificar(req.cookies.jwt);
  let timeExp = resDateTime(decoded);
  if (!decoded || !decoded.nombre) { res.status(400).send("Error al leer token"); return }
  console.log("decodificar", decoded.nombre)
  res.render('../views/userViews/UserHome', { mainTitle: 'Campeonato UVM', user: decoded.nombre, hora: timeExp });
});




module.exports = router;
