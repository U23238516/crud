var sql    = require('mssql')
;
// Configuración de la conexión
const config = {
  user    : 'sa',
  password: 'sql',
  server  : '192.168.1.7',   // O el nombre de tu servidor
  database: 'crud',
  options : {
    encrypt: false, // Solo si estás utilizando conexiones cifradas
    useUTC : false, // Puede ser necesario en algunos entornos
  }
};

var getConnection = function(callback) {
  
  // object_connection_dev - object_connection_prod
  // console.error('empresa: >>> >>>', empresa);
  // console.error('process.env.NODE_ENV: ', process.env.NODE_ENV);
  // console.error('config[empresa]: ', config[empresa]);
  // console.error('config[empresa].db.object_connection: ', config[empresa].db.object_connection);
  var con = new sql.Connection(config, function(err) {
    if (err) {
    	console.error('Error: ', err);
      console.error('Error: ', err.message);
      con.close();
    	callback(err);
    	return;
    }
    // Query 
 		callback(null, con);
 	});
};

exports.getConnection = getConnection;