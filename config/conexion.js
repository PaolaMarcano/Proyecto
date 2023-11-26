require('dotenv').config();
var mysql = require('mysql');
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