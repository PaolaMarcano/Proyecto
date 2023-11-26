const result = require('dotenv').config();
var mysql = require('mysql');

if (result.error) {
  let error_dotenv = 'No se ha podido cargar las variables de entorno. \nCódigo de error: ' + result.error.code + '\nPath: ' + result.error.path + '\n';
  throw error_dotenv //Error al leer .env
}
//console.log(result.parsed)
if (!result.parsed.DB_HOST || !result.parsed.DB_USER || !result.parsed.DB_PASSWORD || !result.parsed.DB_DATABASE) {
  let error_dotenv_MySQL = 'No se han encontrado todas variables de entorno para la conexión a la base de datos. \n Verifique su archivo .env\n';
  throw error_dotenv_MySQL //Error al leer variables de conexión en .env
}
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect((err) => {
  if (err) {
    let error_MySQL = 'La conexión a la base de datos ha fallado. \nCódigo de error: ' + err.code + '\n';
    throw error_MySQL //Error al conectar
  };
});

module.exports = connection