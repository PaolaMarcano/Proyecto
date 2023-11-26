require('dotenv').config()
var jwt = require('jsonwebtoken');
const UsuarioController = require('../controllers/Usuario_Controller');

function checkLevel(rolToken) {
    if (rolToken == 'admin') {
        console.log('Es administrador');
    } else if (rolToken == 'editor'){
        console.log('Es editor');
    }else{
        console.log("Es root")
    }
}

function check(token) {
    token = token.replace('Bearer ', '');
    //console.log('TOKEN',token);
    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        if (decoded.rol) checkLevel(decoded.rol);
        return { valLogin: true, Utoken: decoded };
    } catch (err) {
        return { valLogin: err };
    }
}

function checkLogin(req, res, next) {
    //console.log(req.headers.authorization);
    let reqToken = req.headers.authorization;
    if (reqToken == undefined) return res.status(401).send('Debe ingresar un Token');

    const { valLogin } = check(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    next();
}

function checkAdmin(req, res, next) {
    //console.log(req.headers.authorization);
    let reqToken = req.headers.authorization;
    if (reqToken == undefined) return res.status(401).send('Debe ingresar un Token');

    const { valLogin, Utoken } = check(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    
    if (Utoken.rol !== 'admin') {
        return res.status(403).send(['Usted no posee permisos de administrador:', Utoken]);
    };

    next();
}


function checkRoot(req, res, next) {
    //console.log(req.headers.authorization);
    let reqToken = req.headers.authorization;
    if (reqToken == undefined) return res.status(401).send('Debe ingresar un Token');

    const { valLogin, Utoken } = check(reqToken);
    if (valLogin !== true) return res.status(401).send('Token inválido:  \n' + valLogin);
    
    if (Utoken.rol !== 'root') {
        return res.status(403).send(['Usted no posee permisos para cambiar los roles:', Utoken]);
    };

    if (Utoken.id == req.body.cedula_usuario) return res.status(403).send(['No puede cambiarse a sí mismo de rol:', Utoken]);

    next();
}

// INVALIDAR TOKENS POR DATETIME

function checkDatetime(req, res, next){
    let reqToken = req.headers.authorization;
    if (reqToken == undefined) return res.status(401).send('Debe ingresar un Token');
    let token  = check(reqToken)
    console.log("Fue creado en (iat):")
    console.log(token.Utoken.iat)
    console.log("Caduca en (exp):")
    console.log(token.Utoken.exp)
    let fecha_expiracion =  new Date(token.Utoken.exp * 1000)
    let fecha_actual = new Date();
    if(fecha_actual < fecha_expiracion){
        console.log("Token todavia válido")
        next();  
    }else{
        res.status(500).send("Token expirado")
    }
}

function decodificar(token) {
    token = token.replace('Bearer ', '');
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { checkLogin, checkAdmin, checkRoot, checkDatetime, decodificar };