# Proyecto
Proyecto de Backend

*Instructivo de uso para el repositorio*  

Una vez descargado el repositorio sigue los siguientes pasos para que puedas visualizar su funcionamiento:  

1.	Descomprime la carpeta que contiene el proyecto, o clona el repositorio usando el comando git clone.  

2.	Abre en el editor de código de tu preferencia, la carpeta e inicia tu terminal con:  <br>
•	npm install (este comando instala los paquetes y dependencias necesarias utilizadas en el proyecto).  <br>
 Dentro de ellas están: express, express-generator, mysql, bcrypt, JWT, cookie-parser, dotenv , method-Override y nodemon (para el desarrollo).  

3.	Crea en tu editor de código un archivo << .env >> .  
•	Como ayuda te explicamos un ejemplo sobre los datos que contendrá tu archivo   << .env >>:
DB_HOST=localhost  <br>
DB_DATABASE= (nombre de la base de datos)  <br>
DB_USER= root  <br>
DB_PASSWORD=  <br>
JWT_SECRET=secretJWT_token  <br> 

4.	Busca en la carpeta config el archivo de instalación de la base de datos.  


5.	Inicia el programa Xampp (el servidor de MySQL o el de tu preferencia).  


6.	Importa la base de datos a phpMyAdmin.  


7.	Inicia el proyecto con el siguiente comando:      

•	npm run start (Este comando se utiliza para iniciar el proyecto y gestionar los paquetes utilizados).  

8.	Para hacer las consultas desde la base de datos usa la extensión ThunderClient, POSTMAN o incluso las Vistas.  <br>

9. Para ello elige que permisos deseas tener para realizar cada operación o consulta desde la base de datos.
<br>

Si quieres hacer operaciones como usuario editor o administrador desde ThunderClient, realiza los siguientes pasos: <br>

1. Dirigete a ThunderClient, elige el método POST y copia la siguiente URL :  localhost:3000/usuario/login <br>

2. En la sección Body copia el siguiente JSON: <br>

Si es para un Usuario Editor: <br>

{ <br>
  "cedula_usuario": 31975611,<br>
  "nombre_usuario": "Editor", <br>
  "clave_usuario": "54321",<br>
  "rol_usuario": "editor"<br>
}
<br>  

Si es para un Usuario Administrador:<br>

{ <br>
  "cedula_usuario": 30975611,  <br>
  "nombre_usuario": "Admin",  <br>
  "clave_usuario": "12345",  <br>
  "rol_usuario": "admin"  <br>
}

Si es para un Usuario Root:<br>

{ <br>
  "cedula_usuario": 0,  <br>
  "nombre_usuario": "Root",  <br>
  "clave_usuario": "r4iz_805",  <br>
  "rol_usuario": "root"  <br>
}

Nota: otro modo de hacer login es en la view que tiene la siguiente url: http://localhost:3000/home/login 


3. Una vez generado tu token, dirigete en Auth, y en Bearer almacena tu token. El se encargara de que sea posible realizar las operaciones que gustes dependiendo de los permisos que tengas como usuario. <br>

4. Cada que desees realizar una operación recuerda mantener el token en Bearer (Preferiblemente al hacer este paso que sea en un New Request).<br>


Operaciones a las cuales tiene acceso el Usuario Editor: <br>

* Ingresar equipos participantes.

* Mostrar los equipos participantes.

* Ingresar patrocinantes.

* Mostrar los patrocinantes.

* Mostrar modalidades.

* Ingresar modalidad.

* Mostrar los equipos participantes inscritos en cada categoría.

* Mostrar categorías. 

* Mostrar Equipos y sus padrinos.   

* Mostrar Modalidades y sus categorías.

* Editar Usuario.

* Eliminar inscripción a una categoría.

* Editar equipo


Operaciones a las cuales tiene acceso el Usuario Administrador: <br>

* Eliminar equipo.  

* Eliminar categoría.

* Editar patrocinador. 

* Ingresar equipos participantes.

* Mostrar los equipos participantes.

* Ingresar patrocinantes.

* Mostrar los patrocinantes.

* Eliminar patrocinador. 

* Mostrar modalidades.

* Ingresar modalidad.

* Mostrar los equipos participantes inscritos en cada categoría.

* Mostrar categorías. 

* Mostrar padrinos.

* Ingresar categoría a cada modalidad.

* Mostrar Equipos y sus padrinos.

* Editar equipo participante.

* Editar categoría.

* Mostrar Modalidades y sus categorías. 


- URL para las vistas:

http://localhost:3000/home                               (Inicio)

http://localhost:3000/home/register                     (Registrar un usuario)

http://localhost:3000/home/login                        (Generar token usuario)

http://localhost:3000/Modalidad/nuevaModalidad          (Ingresar nueva Modalidad)

http://localhost:3000/equipo/nuevoEquipo                (Ingresar nuevo Equipo)

http://localhost:3000/patrocinador/nuevoPatrocinador    (Ingresar nuevo Patrocinador)

http://localhost:3000/categoria/nuevaCategoria          (Ingresar nueva Categoria)

http://localhost:3000/equipo/verEquipo                  (ver Equipos)

http://localhost:3000/modalidad/ver                     (ver Modalidades)

http://localhost:3000/patrocinador/ver                  (ver Patrocinador)

http://localhost:3000/patrocinador/todos                (ver Patrocinador con usuario Administrador)


Ejemplo de como ingresar un equipo desde Thunder Client: (Realizar operación con usuario Editor)

•	POST => http://localhost:3000/equipo

Una vez que generes tu token y guardes lo guardes en Bearer ingresa el siguiente JSON


{    <br>
  "representante": "Miguel", <br> 
    "email": "M1key9090@gmail.com",  <br>
    "telefono": "0412-7544567",<br>
    "nombre_de_equipo": "Robots de la suerte",<br>
    "participantes": "Miguel,Orlando",<br>
    "comentario": "" <br>
  }






