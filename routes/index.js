var express = require('express');
var router = express.Router();
const UsuarioController = require('../controllers/Usuario_Controller');
const { checkLogin, checkAdmin, decodificar } = require('../auth/auth');
const { checkLoginView, checkRootView, resDateTime } = require('../auth/authViews');
const responderErr = require('./respuestas');


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
        responderErr(error, res);
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
    responderErr(error, res);
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
    responderErr(error, res);
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
        responderErr(error, res);
      })
  } else {
    res.render('error', { message: "Body vacío", error: { status: 400 } })
  }
});



/*Para el usuario ROOT*/

router.get('/user_manager', checkRootView, function (req, res, next) {
  UsuarioController.ver_usuarios().then((resultados) => {
    let usuarios = resultados
    res.render('../views/userViews/operacionesRoot', { mainTitle: "Cambiar Rol", title: "Operación root", usuarios: usuarios});
  }).catch((error)=>{
    responderErr(error, res);
  }) 
});

/* PATCH user.(editar rol) */

router.get('/user_manager/rol/:index', checkRootView , function (req, res, next) {
  UsuarioController.encontrar_usuario_views(req.params.index).then((resultados)=>{
    let usuario_encontrado = resultados
    res.render('../views/userViews/cambiarRolForm', { mainTitle: "Cambiar Rol", title: "Operación root", usuario: usuario_encontrado});
  }).catch((error)=>{
    responderErr(error, res);
  }) 
});


router.patch('/user_manager/rol/:index', checkRootView, function (req, res, next) {
  let usuario_con_rol_nuevo = {rol_usuario: req.body.rol_usuario, cedula_usuario: req.params.index}
  UsuarioController.cambiar_rol(usuario_con_rol_nuevo).then(()=>{
    res.send("Actualizado correctamente")
  }).catch((error)=>{
    responderErr(error, res);
  }) 
}); 

/* DELETE user.(eliminar usuario) */

router.get('/user_manager/eliminar/:index', checkRootView, function (req, res, next) {
  UsuarioController.encontrar_usuario_views(req.params.index).then((resultados)=>{
    let usuario_encontrado = resultados
    res.render('../views/userViews/eliminarUsuario', { mainTitle: "Eliminar", title: "¿Quiere eliminar este usuario?", usuario: usuario_encontrado});
  }).catch((error)=>{
    responderErr(error, res);
  }) 
});

router.delete('/user_manager/eliminar/:index', checkRootView, function (req, res, next) {
  UsuarioController.borrar_usuario(req.params.index).then(()=>{
    res.send("Eliminado correctamente")
  }).catch((error)=>{
    responderErr(error, res);
  }) 
});

module.exports = router;
