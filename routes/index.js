var express = require('express');
var router = express.Router();
const UsuarioController = require('../controllers/Usuario_Controller');
const { checkLogin, checkAdmin, decodificar } = require('../auth/auth');
const { checkLoginView, resDateTime } = require('../auth/authViews')



/* GET home page. */
router.get('/home', function (req, res, next) {
  res.render('index', { title: 'Campeonato UVM' });
});

router.get('/', function (req, res, next) {
  res.redirect('./home');
});

router.get('/home/register', function (req, res, next) {
  res.render('./userViews/register', { mainTitle: "Registrar Usuario" });
});

router.post('/home/register', function (req, res, next) {
  let data = req.body;
  if (data != null) {
    UsuarioController.registrar_usuario(req.body).then((token) => {
      res.cookie("jwt", token.token, { maxAge: 3600000 });
      res.redirect('./menu');
    })
      .catch((error) => {
        if (error.codigo && error.mensaje && error.mensaje.sqlMessage) { res.render('error', { message: error.mensaje.sqlMessage, error: { status: error.codigo } }) }
        else if (error.codigo && error.mensaje) { res.render('error', { message: error.mensaje, error: { status: error.codigo } }) }
        else { res.status(500).send(error) }
      })
  }
});


router.get('/home/login', function (req, res, next) {
  if (req.cookies.jwt && typeof decodificar(req.cookies.jwt) == "object") { res.redirect('./menu'); return };
  res.render('./userViews/login', { mainTitle: "Iniciar Sesión" });
});

router.post('/home/login', function (req, res, next) {
  UsuarioController.login(req.body).then((token) => {
    res.cookie("jwt", token.token, { maxAge: 3600000 });
    res.redirect('./menu');
  }).catch((error) => {
    if (error.codigo && error.mensaje && error.mensaje.sqlMessage) { res.render('error', { message: error.mensaje.sqlMessage, error: { status: error.codigo } }) }
    else if (error.codigo && error.mensaje) { res.render('error', { message: error.mensaje, error: { status: error.codigo } }) }
    else { res.status(500).send(error) }
  })
});

router.get('/home/menu', checkLoginView, function (req, res, next) {
  let decoded = decodificar(req.cookies.jwt);
  let timeExp = resDateTime(decoded);
  if (!decoded || !decoded.nombre) { res.status(400).send("Error al leer token"); return }
  console.log("decodificar", decoded.nombre)
  res.render('../views/userViews/UserHome', { mainTitle: 'Campeonato UVM', user: decoded.nombre, hora: timeExp });
});

//Editar usuario Views
router.get('/home/edit', checkLoginView, function (req, res, next) {
  let decoded = decodificar(req.cookies.jwt);
  UsuarioController.encontrar_usuario_views(decoded.id).then((usuario) => {
    res.render('./userViews/edit', { mainTitle: "Actualizar Usuario", user: usuario });
  }).catch((error) => {
    console.log(error);
    if (error.codigo && error.mensaje && error.mensaje.sqlMessage) { res.render('error', { message: error.mensaje.sqlMessage, error: { status: error.codigo } }) }
    else if (error.codigo && error.mensaje) { res.render('error', { message: error.mensaje, error: { status: error.codigo } }) }
    else { res.status(500).send(error) }
  })

});
//Hay que restringir de nuevo, Y HACER OTRA VEZ LOGIN AL ACTUALIZAR. FALTA CAMBIAR CONTRASEÑA
router.put('/home/edit/:index', function (req, res, next) {
  let data = req.body;
  if (data != null) {
    UsuarioController.editar_usuario(req.params.index, data)
      //FALTA HACER EXPIRAR EL VIEJO TOKEN
      .then((Resultado) => {
        //console.log(Resultado);
        res.redirect('../../menu');
      })
      .catch((error) => {
        //console.log(error);
        if (error.codigo && error.mensaje && error.mensaje.sqlMessage) { res.render('error', { message: error.mensaje.sqlMessage, error: { status: error.codigo } }) }
        else if (error.codigo && error.mensaje) { res.render('error', { message: error.mensaje, error: { status: error.codigo } }) }
        else { res.status(500).send(error) }
      })
  } else {
    res.render('error', { message: "Body vacío", error: { status: 400 } })
  }
});

module.exports = router;
