function cerrar_sesion() {
    document.cookie = 'jwt=jwt; max-age=0; path=/'
    document.location.href = '/home'
}

function cerrar_sesion2() {
    document.cookie = 'jwt=jwt; max-age=0; path=/'
}