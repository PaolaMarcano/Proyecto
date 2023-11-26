function cerrar_sesion() {
    document.cookie = 'jwt=jwt; max-age=0; path=/'
    document.location.href = '/home'
}


