// const express = require('express');
// const bodyParser = require('body-parser');
// const { connectToDB } = require('./db');
// const app = express();

// const port = 3000;

// // Middleware para parsear el cuerpo de las peticiones como JSON
// app.use(bodyParser.json());

// // Ruta para obtener todos los productos
// app.get('/api/productos', async (req, res) => {
//   let connection;
//   try {
//     connection = await connectToDB();
//     const result = await connection.execute('SELECT * FROM productos');
//     res.json(result.rows); // Devuelve los productos como respuesta JSON
//   } catch (err) {
//     res.status(500).json({ error: 'Error al obtener los productos' });
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// });

// // Ruta para obtener un producto por ID
// app.get('/api/productos/:id', async (req, res) => {
//   let connection;
//   const productId = req.params.id;
//   try {
//     connection = await connectToDB();
//     const result = await connection.execute(
//       'SELECT * FROM productos WHERE id = :id',
//       [productId]
//     );
//     if (result.rows.length > 0) {
//       res.json(result.rows[0]);
//     } else {
//       res.status(404).json({ error: 'Producto no encontrado' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Error al obtener el producto' });
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// });

// // Ruta para agregar un producto
// app.post('/api/productos', async (req, res) => {
//   let connection;
//   const { nombre, descripcion, precio, cantidad } = req.body;
//   try {
//     connection = await connectToDB();
//     const result = await connection.execute(
//       'INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (:nombre, :descripcion, :precio, :cantidad)',
//       [nombre, descripcion, precio, cantidad],
//       { autoCommit: true }
//     );
//     res.status(201).json({ message: 'Producto agregado' });
//   } catch (err) {
//     res.status(500).json({ error: 'Error al agregar el producto' });
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// });

// // Ruta para actualizar un producto
// app.put('/api/productos/:id', async (req, res) => {
//   let connection;
//   const productId = req.params.id;
//   const { nombre, descripcion, precio, cantidad } = req.body;
//   try {
//     connection = await connectToDB();
//     const result = await connection.execute(
//       'UPDATE productos SET nombre = :nombre, descripcion = :descripcion, precio = :precio, cantidad = :cantidad WHERE id = :id',
//       [nombre, descripcion, precio, cantidad, productId],
//       { autoCommit: true }
//     );
//     if (result.rowsAffected > 0) {
//       res.json({ message: 'Producto actualizado' });
//     } else {
//       res.status(404).json({ error: 'Producto no encontrado' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Error al actualizar el producto' });
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// });

// // Ruta para eliminar un producto
// app.delete('/api/productos/:id', async (req, res) => {
//   let connection;
//   const productId = req.params.id;
//   try {
//     connection = await connectToDB();
//     const result = await connection.execute(
//       'DELETE FROM productos WHERE id = :id',
//       [productId],
//       { autoCommit: true }
//     );
//     if (result.rowsAffected > 0) {
//       res.json({ message: 'Producto eliminado' });
//     } else {
//       res.status(404).json({ error: 'Producto no encontrado' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Error al eliminar el producto' });
//   } finally {
//     if (connection) {
//       await connection.close();
//     }
//   }
// });

// // Iniciar el servidor
// app.listen(port, () => {
//   console.log(`Servidor corriendo en http://localhost:${port}`);
// });

const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();
const cors       = require('cors');
const api        = require('./api/index')

app.use(cors());

const port = 3000;

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(bodyParser.json());

// Ruta para obtener todos los productos
app.get('/api/productos', async (req, res) => {
	var query      = ` Select * From productos `
	var parameters = {}
	var isWhere    = false
	var aux        = ''
	var where      = []

  var response = {
    status : 0
  }

	api.sql.sql_productos.builtGet(query, parameters, function(err, cantidad, lista) {
		if (err) {
			res.send({ status: 0, message: err.message})
			return
		}

    response.status   = 1
    response.cantidad = cantidad
    response.lista    = lista
    res.send(response)
	})
});

// Ruta para obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  const productId = req.params.id;
  var query      = ` Select * From productos WHERE id = @id `
	var parameters = {}
	var isWhere    = false
	var aux        = ''
	var where      = []

  parameters.id = productId

  var response = {
    status : 0
  }

	api.sql.sql_productos.builtGet(query, parameters, function(err, cantidad, lista) {
		if (err) {
			res.send({ status: 0, message: err.message})
			return
		}

    response.status   = 1
    response.cantidad = cantidad
    response.lista    = lista
    res.send(response)	
	})
});

// Ruta para agregar un producto
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, precio, cantidad } = req.body;

  if (!nombre) {
    return res.status(0).json({
      status: 0,
      mensaje: 'El nombre es obligatorio.',
    });
  }
  if (precio <= 0) {
    return res.status(0).json({
      status: 0,
      mensaje: 'El precio debe ser mayor a cero.',
    });
  }

  const obj = {
    nombre,
    descripcion,
    precio,
    cantidad
  }

  var response = {
    status : 0
  }

  api.sql.sql_productos.insert(obj, function(err, cantidad, lista) {
		if (err) {
			res.send({ status: 0, message: err.message})
			return
		}

    response.status   = 1
    response.cantidad = cantidad
    response.lista    = lista
    res.send(response)	
	})
});

// Ruta para actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
  const productId = req.params.id;
  const { nombre, descripcion, precio, cantidad } = req.body;

 // Validación en el backend
  if (!nombre) {
    return res.status(0).json({
      status: 0,
      mensaje: 'El nombre es obligatorio.',
    });
  }
  if (precio <= 0) {
    return res.status(0).json({
      status: 0,
      mensaje: 'El precio debe ser mayor a cero.',
    });
  }

  var query      = ` UPDATE productos SET nombre = @nombre, descripcion = @descripcion, precio = @precio, cantidad = @cantidad WHERE id = @id `
	var parameters = {}
	var isWhere    = false
	var aux        = ''
	var where      = []

  parameters.id          = productId
  parameters.nombre      = nombre
  parameters.descripcion = descripcion
  parameters.precio      = precio
  parameters.cantidad    = cantidad

  var response = {
    status : 0
  }

	api.sql.sql_productos.builtGet(query, parameters, function(err, cantidad, lista) {
		if (err) {
			res.send({ status: 0, message: err.message})
			return
		}

    response.status   = 1
    response.cantidad = cantidad
    response.lista    = lista
    res.send(response)	
	})
});

// Ruta para eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  const productId = req.params.id;
  var query      = ` DELETE FROM productos WHERE id = @id `
	var parameters = {}
	var isWhere    = false
	var aux        = ''
	var where      = []

  parameters.id          = productId

  var response = {
    status : 0
  }

	api.sql.sql_productos.builtGet(query, parameters, function(err, cantidad, lista) {
		if (err) {
			res.send({ status: 0, message: err.message})
			return
		}

    response.status   = 1
    response.cantidad = cantidad
    response.lista    = lista
    res.send(response)	
	})
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

