function errores_res(err, resp) {
    if (err.codigo && err.mensaje && err.mensaje.sqlMessage) { resp.render('error', { message: err.mensaje.sqlMessage, error: { status: err.codigo } }) }
    else if (err.codigo && err.mensaje) { resp.render('error', { message: err.mensaje, error: { status: err.codigo } }) }
    else { resp.status(500).send(err) }
}

module.exports = errores_res;