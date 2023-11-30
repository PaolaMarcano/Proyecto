var cookieParser = require('cookie-parser')
const result = require('dotenv').config()
var jwt = require('jsonwebtoken');
const { token } = require('morgan');

if (!result.parsed.JWT_SECRET) {
    let error_dotenv_JWT = 'No se ha encontrado la variable de entorno: "JWT_SECRET". \n';
    throw error_dotenv_JWT //Error al leer variable JWT_SECRET en .env
}

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
    if (reqToken == undefined) return res.redirect('../../home/login');

    const { valLogin } = checkView(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    next();
}

function checkAdminView(req, res, next) {
    //console.log(req.headers.authorization);
    let reqToken = req.cookies.jwt;
    console.log("req Token")
    console.log(reqToken)
    if (reqToken == undefined) return res.redirect('../../home/login');

    const { valLogin, Utoken } = checkView(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    
    if (Utoken.rol !== 'admin') {
        return res.status(403).send(['Usted no posee permisos de administrador:', Utoken]);
    };

    next();
}


function checkRootView(req, res, next) {
    //console.log(req.headers.authorization);
    let reqToken = req.cookies.jwt;
    if (reqToken == undefined) return res.redirect('../../home/login');

    const { valLogin, Utoken } = checkView(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    
    if (Utoken.rol !== 'root') {
        return res.status(403).send(['Usted no posee permisos para cambiar los roles:', Utoken]);
    };

    if (Utoken.id == req.body.cedula_usuario) return res.status(403).send(['No puede cambiarse a sí mismo de rol:', Utoken]);

    next();
}

function resDateTime(token) {
    //let exp = new Date(token.exp * 1000);
    //console.log("Caduca a las:", exp) 
    if (token.exp) {
        return token.exp;
    } else {
        return 0
    }
    
}

module.exports = { checkLoginView, checkAdminView, checkRootView, resDateTime };