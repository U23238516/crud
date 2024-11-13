const sql = require('mssql');

// Configuración de la conexión
const config = {
  user    : 'sa',
  password: 'sql',
  server  : '192.168.1.7',   // O el nombre de tu servidor
  database: 'crud',
  options : {
    encrypt: false, // Solo si estás utilizando conexiones cifradas
    trustServerCertificate: true, // Puede ser necesario en algunos entornos
  }
};

// Conectar a la base de datos
async function connectToDB() {
  try {
    await sql.connect(config);
    console.log('Conexión establecida correctamente');
  } catch (err) {
    console.error('Error de conexión', err);
  }
}

// Ejecutar una consulta
async function fetchData() {
  try {
    const result = await sql.query('SELECT * FROM productos');
    console.log(result.recordset); // Resultados de la consulta
  } catch (err) {
    console.error('Error al ejecutar la consulta', err);
  }
}

// Llamar a las funciones
connectToDB()
  .then(() => fetchData())
  .catch(err => console.error(err));

// Cerrar la conexión
process.on('exit', async () => {
  await sql.close();
});

