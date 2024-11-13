const oracledb = require('oracledb');

// Configuración de conexión a Oracle
const dbConfig = {
  user: 'your_username',      // Reemplaza con tu usuario
  password: 'sql',  // Reemplaza con tu contraseña
  connectString: 'localhost:1521/xe'  // Reemplaza con tu string de conexión
};

async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error('Error de conexión a la base de datos', err);
    throw err;
  }
}

module.exports = { getConnection };
