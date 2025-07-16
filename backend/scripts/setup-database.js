// scripts/setup-database.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
};

async function setupDatabase() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    
    console.log('Conectado a MySQL...');
    
    // Leer y ejecutar el script SQL
    const sqlScript = fs.readFileSync(path.join(process.cwd(), 'delimar_database.sql'), 'utf8');
    
    console.log('Ejecutando script de base de datos...');
    await conn.query(sqlScript);
    
    console.log('✓ Base de datos configurada correctamente');
    console.log('✓ Categorías insertadas');
    console.log('✓ Usuario administrador creado');
    
  } catch (err) {
    console.error('Error configurando la base de datos:', err.message);
    console.log('\n📋 Instrucciones manuales:');
    console.log('1. Asegúrate de que MySQL esté ejecutándose');
    console.log('2. Ejecuta el archivo delimar_database.sql en tu cliente MySQL');
    console.log('3. Verifica que la base de datos "delimar_db" existe');
  } finally {
    if (conn) await conn.end();
  }
}

setupDatabase();
