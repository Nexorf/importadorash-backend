import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

import Usuario from './src/models/Usuario.js';
import Producto from './src/models/Producto.js';
import Venta from './src/models/Venta.js';
import Inventario from './src/models/Inventario.js';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta dist (para producción)
app.use(express.static(join(__dirname, 'dist')));

// Middleware para manejar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Middleware para manejar errores de MongoDB
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Rutas para productos
app.get('/api/productos', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ id: 1 });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/api/productos', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Si es un array, reemplazar todos los productos
      await Producto.deleteMany({});
      const productos = await Producto.insertMany(req.body);
      res.json({ success: true, count: productos.length });
    } else {
      // Si es un objeto, crear o actualizar un producto
      const producto = req.body;
      if (producto.id) {
        // Actualizar producto existente
        const updatedProducto = await Producto.findOneAndUpdate(
          { id: producto.id },
          producto,
          { new: true, upsert: true }
        );
        res.json({ success: true, producto: updatedProducto });
      } else {
        // Crear nuevo producto
        const newProducto = new Producto(producto);
        await newProducto.save();
        res.json({ success: true, producto: newProducto });
      }
    }
  } catch (error) {
    console.error('Error al guardar productos:', error);
    res.status(500).json({ error: 'Error al guardar productos' });
  }
});

// Ruta para obtener un producto específico
app.get('/api/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findOne({ id: parseInt(req.params.id) });
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Ruta para actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
  try {
    const updatedProducto = await Producto.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    if (updatedProducto) {
      res.json({ success: true, producto: updatedProducto });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Ruta para eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const result = await Producto.findOneAndDelete({ id: parseInt(req.params.id) });
    if (result) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Rutas para usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ id: 1 });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Si es un array, reemplazar todos los usuarios
      await Usuario.deleteMany({});
      const usuarios = await Usuario.insertMany(req.body);
      res.json({ success: true, count: usuarios.length });
    } else {
      // Si es un objeto, crear o actualizar un usuario
      const usuario = req.body;
      if (usuario.id) {
        // Actualizar usuario existente
        const updatedUsuario = await Usuario.findOneAndUpdate(
          { id: usuario.id },
          usuario,
          { new: true, upsert: true }
        );
        res.json({ success: true, usuario: updatedUsuario });
      } else {
        // Crear nuevo usuario
        const newUsuario = new Usuario(usuario);
        await newUsuario.save();
        res.json({ success: true, usuario: newUsuario });
      }
    }
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    res.status(500).json({ error: 'Error al guardar usuarios' });
  }
});

// Ruta para obtener un usuario específico
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ id: parseInt(req.params.id) });
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Rutas para ventas
app.get('/api/ventas', async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ id: 1 });
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

// Ruta para obtener una venta específica por ID
app.get('/api/ventas/:id', async (req, res) => {
  try {
    const venta = await Venta.findOne({ id: parseInt(req.params.id) });
    if (venta) {
      res.json(venta);
    } else {
      res.status(404).json({ error: 'Venta no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
});

app.post('/api/ventas', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Si es un array, reemplazar todas las ventas
      await Venta.deleteMany({});
      const ventas = await Venta.insertMany(req.body);
      res.json({ success: true, count: ventas.length });
    } else {
      // Si es un objeto, crear o actualizar una venta
      const venta = req.body;
      if (venta.id) {
        // Actualizar venta existente
        const updatedVenta = await Venta.findOneAndUpdate(
          { id: venta.id },
          venta,
          { new: true, upsert: true }
        );
        res.json({ success: true, venta: updatedVenta });
      } else {
        // Crear nueva venta
        const newVenta = new Venta(venta);
        await newVenta.save();
        res.json({ success: true, venta: newVenta });
      }
    }
  } catch (error) {
    console.error('Error al guardar ventas:', error);
    res.status(500).json({ error: 'Error al guardar ventas' });
  }
});

// Ruta para actualizar el estado de una venta
app.put('/api/ventas/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado) {
      return res.status(400).json({ error: 'Se requiere el campo estado' });
    }
    
    const updatedVenta = await Venta.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { estado },
      { new: true }
    );
    
    if (!updatedVenta) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }
    
    res.json({ success: true, venta: updatedVenta });
  } catch (error) {
    console.error('Error al actualizar estado de venta:', error);
    res.status(500).json({ error: 'Error al actualizar estado de venta' });
  }
});

// Rutas para inventario
app.get('/api/inventario', async (req, res) => {
  try {
    const inventario = await Inventario.find().sort({ id: 1 });
    res.json(inventario);
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
});

app.post('/api/inventario', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Si es un array, reemplazar todo el inventario
      await Inventario.deleteMany({});
      const inventario = await Inventario.insertMany(req.body);
      res.json({ success: true, count: inventario.length });
    } else {
      // Si es un objeto, crear o actualizar un item de inventario
      const item = req.body;
      if (item.id) {
        // Actualizar item existente
        const updatedItem = await Inventario.findOneAndUpdate(
          { id: item.id },
          item,
          { new: true, upsert: true }
        );
        res.json({ success: true, item: updatedItem });
      } else {
        // Crear nuevo item
        const newItem = new Inventario(item);
        await newItem.save();
        res.json({ success: true, item: newItem });
      }
    }
  } catch (error) {
    console.error('Error al guardar inventario:', error);
    res.status(500).json({ error: 'Error al guardar inventario' });
  }
});

// Ruta para obtener un item específico del inventario
app.get('/api/inventario/:id', async (req, res) => {
  try {
    const item = await Inventario.findOne({ id: parseInt(req.params.id) });
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item de inventario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener item de inventario:', error);
    res.status(500).json({ error: 'Error al obtener item de inventario' });
  }
});

// Rutas para clientes (ahora usando el modelo Usuario con rol Cliente)
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Usuario.find({ rol: 'Cliente' }).sort({ id: 1 });
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // Si es un array, procesar cada cliente
      const clientesData = req.body.map(cliente => ({
        ...cliente,
        rol: 'Cliente'
      }));
      
      // Crear o actualizar cada cliente como usuario
      const resultados = [];
      for (const clienteData of clientesData) {
        if (clienteData.id) {
          // Actualizar usuario existente
          const updatedUsuario = await Usuario.findOneAndUpdate(
            { id: clienteData.id },
            clienteData,
            { new: true, upsert: true }
          );
          resultados.push(updatedUsuario);
        } else {
          // Crear nuevo usuario
          const newUsuario = new Usuario(clienteData);
          await newUsuario.save();
          resultados.push(newUsuario);
        }
      }
      res.json({ success: true, count: resultados.length });
    } else {
      // Si es un objeto, crear o actualizar un cliente como usuario
      const clienteData = {
        ...req.body,
        rol: 'Cliente'
      };
      
      if (clienteData.id) {
        // Actualizar usuario existente
        const updatedUsuario = await Usuario.findOneAndUpdate(
          { id: clienteData.id },
          clienteData,
          { new: true, upsert: true }
        );
        res.json({ success: true, cliente: updatedUsuario });
      } else {
        // Crear nuevo usuario
        const newUsuario = new Usuario(clienteData);
        await newUsuario.save();
        res.json({ success: true, cliente: newUsuario });
      }
    }
  } catch (error) {
    console.error('Error al guardar clientes:', error);
    res.status(500).json({ error: 'Error al guardar clientes' });
  }
});

// Ruta para obtener un cliente específico
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Usuario.findOne({ 
      id: parseInt(req.params.id),
      rol: 'Cliente'
    });
    if (cliente) {
      res.json(cliente);
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// Ruta para cualquier otra solicitud (SPA fallback)
app.get('/:path', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Endpoint para verificar el estado de una venta
app.get('/api/verificar-estado/:id', async (req, res) => {
  try {
    const venta = await Venta.findOne({ id: parseInt(req.params.id) });
    
    if (!venta) {
      return res.status(404).json({ success: false, error: 'Venta no encontrada' });
    }
    
    res.json({ 
      success: true, 
      estado: venta.estado,
      numeroSeguimiento: venta.numeroSeguimiento,
      venta: venta
    });
  } catch (error) {
    console.error('Error al verificar estado de venta:', error);
    res.status(500).json({ success: false, error: 'Error al verificar estado de venta' });
  }
});

// ===================== ENDPOINT APPEND USUARIO =====================
app.post('/api/usuarios/add', async (req, res) => {
  try {
    const nuevoUsuario = req.body;
    // Validar que sea cliente
    if (!nuevoUsuario || nuevoUsuario.rol !== 'Cliente') {
      return res.status(400).json({ error: 'Solo se pueden registrar clientes.' });
    }
    
    // Validar duplicados por usuario o email
    const existe = await Usuario.findOne({
      $or: [
        { usuario: nuevoUsuario.usuario },
        { email: nuevoUsuario.email }
      ]
    });
    
    if (existe) {
      return res.status(409).json({ error: 'Usuario o email ya registrado.' });
    }
    
    // Crear nuevo usuario
    const usuarioCompleto = new Usuario(nuevoUsuario);
    await usuarioCompleto.save();
    
    res.json({ success: true, usuario: usuarioCompleto });
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    res.status(500).json({ error: 'Error al guardar usuario' });
  }
});
// ===================== FIN ENDPOINT APPEND USUARIO =====================
// ===================== ENDPOINT APPEND VENTA =====================
app.post('/api/ventas/add', async (req, res) => {
  try {
    console.log('Recibiendo nueva venta:', JSON.stringify(req.body, null, 2));
    
    const nuevaVenta = req.body;
    // Validar que tenga campo cliente
    if (!nuevaVenta) {
      return res.status(400).json({ error: 'No se recibieron datos de venta.' });
    }
    
    if (!nuevaVenta.cliente) {
      return res.status(400).json({ error: 'La venta debe tener el campo cliente.' });
    }
    
    // Guardar el cliente original para la venta
    const clienteOriginal = nuevaVenta.cliente;
    let clienteUsuario = null;
    
    // Verificar si el cliente existe en la colección de usuarios
    if (typeof clienteOriginal === 'number') {
      // Si es un ID numérico
      clienteUsuario = await Usuario.findOne({ id: clienteOriginal, rol: 'Cliente' });
    } else if (typeof clienteOriginal === 'string') {
      // Si es un nombre o un ID en formato string
      const posibleId = parseInt(clienteOriginal);
      
      if (!isNaN(posibleId)) {
        // Es un ID válido en formato string
        clienteUsuario = await Usuario.findOne({ id: posibleId, rol: 'Cliente' });
      } else {
        // Es un nombre, buscamos por nombre
        clienteUsuario = await Usuario.findOne({ 
          nombre: clienteOriginal, 
          rol: 'Cliente' 
        });
      }
    }
    
    // Si encontramos el usuario, actualizamos sus compras y totalGastado
    if (clienteUsuario) {
      // Asegurarnos que los campos compras y totalGastado existan
      if (clienteUsuario.compras === undefined) {
        clienteUsuario.compras = 0;
      }
      if (clienteUsuario.totalGastado === undefined) {
        clienteUsuario.totalGastado = 0;
      }
      
      await Usuario.findOneAndUpdate(
        { _id: clienteUsuario._id },
        { 
          $inc: { 
            compras: 1,
            totalGastado: nuevaVenta.total || 0
          } 
        },
        { new: true }
      );
    }
    
    // Validar productos
    if (!nuevaVenta.productos || !Array.isArray(nuevaVenta.productos) || nuevaVenta.productos.length === 0) {
      return res.status(400).json({ error: 'La venta debe tener al menos un producto.' });
    }
    
    // Crear nueva venta con valores por defecto para campos requeridos
    const ventaData = {
      ...nuevaVenta,
      cliente: clienteOriginal, // Aseguramos que se use el valor original
      total: nuevaVenta.total || 0,
      fecha: nuevaVenta.fecha || new Date().toISOString().split('T')[0],
      estado: nuevaVenta.estado || 'Procesando',
      productos: nuevaVenta.productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad || 1,
        precioUnitario: p.precioUnitario || p.precio || 0
      }))
    };
    
    console.log('Guardando venta con datos:', JSON.stringify(ventaData, null, 2));
    
    const ventaCompleta = new Venta(ventaData);
    await ventaCompleta.save();
    
    res.json({ success: true, venta: ventaCompleta });
  } catch (error) {
    console.error('Error al guardar venta:', error);
    console.error('Detalles de la venta:', JSON.stringify(nuevaVenta, null, 2));
    
    // Manejar errores específicos de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Error de validación', detalles: errores });
    }
    
    // Manejar errores de duplicación
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Error de duplicación', message: 'Ya existe una venta con ese número de seguimiento' });
    }
    
    res.status(500).json({ error: 'Error al guardar venta', message: error.message });
  }
});
// ===================== FIN ENDPOINT APPEND VENTA =====================

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});