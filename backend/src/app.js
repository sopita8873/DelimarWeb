import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configuración de admin
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware para proteger rutas de admin
function authAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.admin = user;
    next();
  });
}

// Ruta de login para admin
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Credenciales incorrectas' });
});

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptar solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  }
});

const csvUpload = multer({ dest: 'uploads/' });

// Configuración de base de datos con variables de entorno
const dbConfig = process.env.MYSQL_URL ? {
  uri: process.env.MYSQL_URL
} : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'delimar_db'
};

// Función auxiliar para crear conexión a la base de datos
const createDbConnection = () => {
  return mysql.createConnection(dbConfig.uri ? dbConfig.uri : dbConfig);
};

// ===================== IMPORTAR PRODUCTOS DESDE CSV =====================
app.post('/productos/import-csv', authAdmin, csvUpload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo.' });
  }
  const results = [];
  let conn;
  try {
    // Leer el archivo completo primero para diagnosticar
    const fileContent = fs.readFileSync(req.file.path, 'utf8');
    console.log('Primeras 500 caracteres del archivo CSV:');
    console.log(fileContent.substring(0, 500));
    console.log('---');
    
    // Leer el archivo con configuración más específica para compatibilidad
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv({
          skipEmptyLines: true,
          separator: ',',
          quote: '"',
          escape: '"',
          headers: ['nombre', 'categoria', 'precio', 'unidad', 'imagen', 'descripcion'],
          skipLinesWithError: true
        }))
        .on('data', (data) => {
          console.log('Datos leídos (raw):', data); // Debug: mostrar datos leídos
          results.push(data);
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`Total de filas leídas del CSV: ${results.length}`);
    console.log('Primera fila de ejemplo:', results[0]); // Debug: mostrar primera fila
    console.log('Headers detectados:', Object.keys(results[0] || {}));
    
    conn = await mysql.createConnection(dbConfig);
    let insertCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;
    let missingCategoryCount = 0;
    let invalidDataCount = 0;
    
    for (let i = 0; i < results.length; i++) {
      const prod = results[i];
      
      // Si es la primera fila y contiene headers, saltarla
      if (i === 0 && (prod.nombre === 'nombre' || Object.values(prod).includes('nombre'))) {
        console.log('Saltando fila de headers');
        continue;
      }
      
      // Extraer datos con múltiples métodos de fallback
      let nombre = '';
      let categoria = '';
      let precio = '';
      let unidad = '';
      let imagen = '';
      let descripcion = '';
      
      // Método 1: Usar las claves conocidas
      nombre = prod.nombre || prod.Nombre || prod.NOMBRE || '';
      categoria = prod.categoria || prod.Categoria || prod.CATEGORIA || '';
      precio = prod.precio || prod.Precio || prod.PRECIO || '';
      unidad = prod.unidad || prod.Unidad || prod.UNIDAD || '';
      imagen = prod.imagen || prod.Imagen || prod.IMAGEN || '';
      descripcion = prod.descripcion || prod.Descripcion || prod.DESCRIPCION || '';
      
      // Método 2: Si no funcionó, usar índices posicionales
      if (!nombre && !categoria && !precio && !unidad) {
        const values = Object.values(prod);
        if (values.length >= 4) {
          nombre = values[0] || '';
          categoria = values[1] || '';
          precio = values[2] || '';
          unidad = values[3] || '';
          imagen = values[4] || '';
          descripcion = values[5] || '';
        }
      }
      
      // Método 3: Buscar por contenido típico
      if (!nombre) {
        for (const [key, value] of Object.entries(prod)) {
          if (key.toLowerCase().includes('nom') || key === '0') {
            nombre = value || '';
            break;
          }
        }
      }
      
      console.log(`Fila ${i + 1} - Datos extraídos finales:`, {
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        unidad: unidad,
        imagen: imagen,
        descripcion: descripcion
      });
      
      // Validación más detallada
      if (!nombre || !categoria || !precio || !unidad) {
        console.log(`Fila ${i + 1}: Datos faltantes - nombre: ${!!nombre}, categoria: ${!!categoria}, precio: ${!!precio}, unidad: ${!!unidad}`);
        console.log(`Fila ${i + 1}: Valores reales - nombre: "${nombre}", categoria: "${categoria}", precio: "${precio}", unidad: "${unidad}"`);
        invalidDataCount++;
        continue;
      }
      
      // Verificar si la categoría existe
      const [catRows] = await conn.query('SELECT id FROM categorias WHERE nombre = ?', [categoria.trim()]);
      if (catRows.length === 0) {
        console.log(`Fila ${i + 1}: Categoría '${categoria}' no encontrada`);
        missingCategoryCount++;
        continue;
      }
      
      const categoria_id = catRows[0].id;
      
      try {
        // Verificar si el producto ya existe (por nombre y categoría)
        const [existingProduct] = await conn.query(
          'SELECT id FROM productos WHERE nombre = ? AND categoria_id = ?',
          [nombre.trim(), categoria_id]
        );
        
        if (existingProduct.length > 0) {
          console.log(`Fila ${i + 1}: Producto '${nombre}' ya existe en categoría '${categoria}'`);
          duplicateCount++;
          continue;
        }
        
        await conn.query(
          'INSERT INTO productos (nombre, categoria_id, precio, unidad, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
          [nombre.trim(), categoria_id, parseFloat(precio), unidad.trim(), imagen.trim(), descripcion.trim()]
        );
        insertCount++;
        
        if (insertCount % 50 === 0) {
          console.log(`Procesados ${insertCount} productos...`);
        }
      } catch (e) {
        console.error(`Error en fila ${i + 1}:`, e.message);
        errorCount++;
      }
    }
    
    console.log(`Resumen de importación:
    - Total filas: ${results.length}
    - Insertados: ${insertCount}
    - Duplicados omitidos: ${duplicateCount}
    - Categorías no encontradas: ${missingCategoryCount}
    - Datos inválidos: ${invalidDataCount}
    - Errores: ${errorCount}`);
    
    res.json({ 
      insertados: insertCount,
      totalFilas: results.length,
      duplicados: duplicateCount,
      categoriasFaltantes: missingCategoryCount,
      datosInvalidos: invalidDataCount,
      errores: errorCount
    });
  } catch (err) {
    console.error('Error general al importar productos:', err);
    res.status(500).json({ error: 'Error al importar productos', details: err.message });
  } finally {
    if (conn) await conn.end();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// ===================== EXPORTAR PRODUCTOS A CSV =====================
app.get('/productos/export-csv', authAdmin, async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const [productos] = await conn.query(`
      SELECT p.nombre, c.nombre as categoria, p.precio, p.unidad, p.imagen, p.descripcion
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY c.nombre, p.nombre
    `);
    
    console.log(`Exportando ${productos.length} productos a CSV`);
    
    // Crear contenido CSV más simple sin BOM ni complicaciones
    let csvContent = 'nombre,categoria,precio,unidad,imagen,descripcion\n';
    
    productos.forEach(producto => {
      const nombre = (producto.nombre || '').toString().replace(/"/g, '""');
      const categoria = (producto.categoria || '').toString().replace(/"/g, '""');
      const precio = (producto.precio || '').toString().replace(/"/g, '""');
      const unidad = (producto.unidad || '').toString().replace(/"/g, '""');
      const imagen = (producto.imagen || '').toString().replace(/"/g, '""');
      const descripcion = (producto.descripcion || '').toString().replace(/"/g, '""');
      
      csvContent += `"${nombre}","${categoria}","${precio}","${unidad}","${imagen}","${descripcion}"\n`;
    });
    
    console.log('Muestra del CSV generado (primeras 300 chars):');
    console.log(csvContent.substring(0, 300));
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="productos_delimar.csv"');
    
    // Enviar sin BOM para mayor compatibilidad
    res.send(csvContent);
    
  } catch (err) {
    console.error('Error al exportar productos:', err);
    res.status(500).json({ error: 'Error al exportar productos', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// ===================== SUBIDA DE IMÁGENES =====================
app.post('/upload-image', authAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo de imagen' });
    }
    
    // Devolver la URL de la imagen
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir la imagen', details: err.message });
  }
});

// ===================== CATEGORIAS =====================
app.get('/categorias', async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

app.post('/categorias', authAdmin, async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    res.json({ id: result.insertId, nombre });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

app.put('/categorias/:id', authAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido.' });
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    await conn.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id]);
    res.json({ id, nombre });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

app.delete('/categorias/:id', authAdmin, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    await conn.query('DELETE FROM categorias WHERE id = ?', [id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar categoría', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// ===================== PRODUCTOS =====================
app.get('/productos', async (req, res) => {
  const { categoria_id, search } = req.query;
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    let query = 'SELECT * FROM productos';
    let params = [];
    
    if (categoria_id || search) {
      query += ' WHERE';
      const conditions = [];
      
      if (categoria_id) {
        conditions.push(' categoria_id = ?');
        params.push(categoria_id);
      }
      
      if (search) {
        conditions.push(' (nombre LIKE ? OR descripcion LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }
      
      query += conditions.join(' AND');
    }
    
    const [rows] = await conn.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

app.post('/productos', authAdmin, upload.single('image'), async (req, res) => {
  const { nombre, categoria_id, precio, unidad, descripcion } = req.body;
  let imagen = req.body.imagen; // URL de imagen si se proporciona
  
  // Si se subió un archivo, usar su ruta
  if (req.file) {
    imagen = `/uploads/${req.file.filename}`;
  }
  
  if (!nombre || !categoria_id || !precio || !unidad) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.query(
      'INSERT INTO productos (nombre, categoria_id, precio, unidad, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, categoria_id, precio, unidad, imagen, descripcion]
    );
    res.json({ id: result.insertId, nombre, categoria_id, precio, unidad, imagen, descripcion });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

app.put('/productos/:id', authAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria_id, precio, unidad, descripcion } = req.body;
  let imagen = req.body.imagen; // URL de imagen existente o nueva URL
  
  // Si se subió un archivo nuevo, usar su ruta
  if (req.file) {
    // Opcional: eliminar imagen anterior si existe
    let conn;
    try {
      conn = await mysql.createConnection(dbConfig);
      const [oldProduct] = await conn.query('SELECT imagen FROM productos WHERE id = ?', [id]);
      if (oldProduct.length > 0 && oldProduct[0].imagen && oldProduct[0].imagen.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', oldProduct[0].imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } catch (err) {
      console.log('Error al eliminar imagen anterior:', err.message);
    } finally {
      if (conn) await conn.end();
    }
    
    imagen = `/uploads/${req.file.filename}`;
  }
  
  if (!nombre || !categoria_id || !precio || !unidad) return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    await conn.query(
      'UPDATE productos SET nombre = ?, categoria_id = ?, precio = ?, unidad = ?, imagen = ?, descripcion = ? WHERE id = ?',
      [nombre, categoria_id, precio, unidad, imagen, descripcion, id]
    );
    res.json({ id, nombre, categoria_id, precio, unidad, imagen, descripcion });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

app.delete('/productos/:id', authAdmin, async (req, res) => {
  const { id } = req.params;
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    await conn.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// ===================== BORRAR TODOS LOS PRODUCTOS =====================
app.delete('/productos', authAdmin, async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.query('DELETE FROM productos');
    res.json({ deleted: true, count: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar todos los productos', details: err.message });
  } finally {
    if (conn) await conn.end();
  }
});

// ===================== SERVER =====================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
