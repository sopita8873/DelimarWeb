import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de base de datos - simple para testing
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Cambiar si tienes contraseña
  database: 'delimar_db'
};

// Test de conexión
async function testConnection() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión a base de datos exitosa');
    await conn.end();
    return true;
  } catch (err) {
    console.error('❌ Error de conexión a base de datos:', err.message);
    return false;
  }
}

// Ruta de test
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando', 
    timestamp: new Date(),
    database: 'Testing...'
  });
});

// Ruta de categorías con manejo de errores
app.get('/categorias', async (req, res) => {
  console.log('📡 Solicitando categorías...');
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión establecida');
    
    const [rows] = await conn.query('SELECT * FROM categorias');
    console.log(`📋 Encontradas ${rows.length} categorías`);
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Error en /categorias:', err.message);
    console.error('Stack:', err.stack);
    
    // Enviar respuesta de error detallada
    res.status(500).json({ 
      error: 'Error al obtener categorías', 
      details: err.message,
      code: err.code || 'UNKNOWN'
    });
  } finally {
    if (conn) {
      await conn.end();
      console.log('🔌 Conexión cerrada');
    }
  }
});

const PORT = 3001;

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`📍 Test URL: http://localhost:${PORT}/test`);
  console.log(`📂 Categorías: http://localhost:${PORT}/categorias`);
  
  // Test inicial de conexión
  const dbOk = await testConnection();
  if (!dbOk) {
    console.log('⚠️  Servidor funcionando pero sin conexión a BD');
  }
});
