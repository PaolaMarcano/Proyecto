var cookieParser = require('cookie-parser')
require('dotenv').config()
var jwt = require('jsonwebtoken');
const { token } = require('morgan');

function checkLevelView(rolToken) {
    if (rolToken == 'admin') {
        console.log('Es administrador');
    } else if (rolToken == 'editor'){
        console.log('Es editor');
    }else{
        console.log("Es root")
    }
}

function checkView(token) {
    token = token.replace('Bearer ', '');
    //console.log('TOKEN',token);
    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if (decoded.rol) checkLevelView(decoded.rol);
        return { valLogin: true, Utoken: decoded };
    } catch (err) {
        return { valLogin: err };
    }
}

function checkLoginView(req, res, next) {
    //console.log(req.headers.authorization);
    let reqToken = req.cookies.jwt;
    if (reqToken == undefined) return res.status(401).send('Debe ingresar un Token');

    const { valLogin } = checkView(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    next();
}

function checkAdminView(req, res, next) {
    //console.log(req.headers.authorization);
    let reqToken = req.cookies.jwt;
    console.log("req Token")
    console.log(reqToken)
    if (reqToken == undefined) return res.status(401).send('Debe ingresar un Token');

    const { valLogin, Utoken } = checkView(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    
    if (Utoken.rol !== 'admin') {
        return res.status(403).send(['Usted no posee permisos de administrador:', Utoken]);
    };

    next();
}


function checkRootView(req, res, next) {
    //console.log(req.headers.authorization);
    let reqToken = req.headers.authorization;
    if (reqToken == undefined) return res.status(401).send('Debe ingresar un Token');

    const { valLogin, Utoken } = checkView(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    
    if (Utoken.rol !== 'root') {
        return res.status(403).send(['Usted no posee permisos para cambiar los roles:', Utoken]);
    };

    if (Utoken.id == req.body.cedula_usuario) return res.status(403).send(['No puede cambiarse a sí mismo de rol:', Utoken]);

    next();
}


module.exports = { checkLoginView, checkAdminView, checkRootView };