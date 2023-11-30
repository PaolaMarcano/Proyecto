function errores_res(err, resp) {
    if (err.codigo && err.mensaje && err.mensaje.sqlMessage) { resp.render('error', { message: err.mensaje.sqlMessage, error: { status: err.codigo } }) }
    else if (err.codigo && err.mensaje) { resp.render('error', { message: err.mensaje, error: { status: err.codigo } }) }
    else if (Object.keys(err).length == 0) { resp.status(500).send("Ha ocurrido un error inesperado") }
    else { resp.status(500).send(err) }
}

module.exports = errores_res;