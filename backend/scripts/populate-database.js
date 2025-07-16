// scripts/populate-database.js
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'delimar_db'
};

const sampleProducts = [
  // Pescados Congelados
  { nombre: 'Merluza Congelada', categoria_id: 1, precio: 12.50, unidad: 'kilo', imagen: '', descripcion: 'Merluza fresca congelada de alta calidad' },
  { nombre: 'Bacalao Congelado', categoria_id: 1, precio: 18.90, unidad: 'kilo', imagen: '', descripcion: 'Bacalao del Atlántico, congelado al momento' },
  
  // Pescado Fresco
  { nombre: 'Salmón Fresco', categoria_id: 2, precio: 22.00, unidad: 'kilo', imagen: '', descripcion: 'Salmón noruego fresco, ideal para sashimi' },
  { nombre: 'Lubina Fresca', categoria_id: 2, precio: 16.50, unidad: 'kilo', imagen: '', descripcion: 'Lubina del Mediterráneo, recién pescada' },
  
  // Cefalópodos
  { nombre: 'Pulpo Gallego', categoria_id: 3, precio: 24.00, unidad: 'kilo', imagen: '', descripcion: 'Pulpo gallego de primera calidad' },
  { nombre: 'Calamar Fresco', categoria_id: 3, precio: 14.80, unidad: 'kilo', imagen: '', descripcion: 'Calamar fresco del Cantábrico' },
  
  // Mariscos y Derivados
  { nombre: 'Gambas Rojas', categoria_id: 4, precio: 28.00, unidad: 'kilo', imagen: '', descripcion: 'Gambas rojas de Huelva, extra frescas' },
  { nombre: 'Mejillones Gallegos', categoria_id: 4, precio: 8.50, unidad: 'kilo', imagen: '', descripcion: 'Mejillones de las rías gallegas' },
  
  // Ave
  { nombre: 'Pollo de Corral', categoria_id: 7, precio: 9.80, unidad: 'kilo', imagen: '', descripcion: 'Pollo criado en libertad' },
  { nombre: 'Pechuga de Pavo', categoria_id: 7, precio: 12.50, unidad: 'kilo', imagen: '', descripcion: 'Pechuga de pavo sin piel' },
  
  // Ternera
  { nombre: 'Solomillo de Ternera', categoria_id: 9, precio: 35.00, unidad: 'kilo', imagen: '', descripcion: 'Solomillo de ternera premium' },
  { nombre: 'Entrecot de Ternera', categoria_id: 9, precio: 28.50, unidad: 'kilo', imagen: '', descripcion: 'Entrecot tierno y jugoso' },
  
  // Verdura
  { nombre: 'Espárragos Verdes', categoria_id: 11, precio: 6.50, unidad: 'kilo', imagen: '', descripcion: 'Espárragos verdes frescos de temporada' },
  { nombre: 'Alcachofas', categoria_id: 11, precio: 4.80, unidad: 'kilo', imagen: '', descripcion: 'Alcachofas frescas y tiernas' }
];

async function populateDatabase() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    
    console.log('Conectado a la base de datos...');
    
    // Verificar si ya hay productos
    const [existingProducts] = await conn.query('SELECT COUNT(*) as count FROM productos');
    if (existingProducts[0].count > 0) {
      console.log('La base de datos ya tiene productos. Saltando inserción...');
      return;
    }
    
    console.log('Insertando productos de ejemplo...');
    
    for (const product of sampleProducts) {
      try {
        await conn.query(
          'INSERT INTO productos (nombre, categoria_id, precio, unidad, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
          [product.nombre, product.categoria_id, product.precio, product.unidad, product.imagen, product.descripcion]
        );
        console.log(`✓ Insertado: ${product.nombre}`);
      } catch (err) {
        console.error(`✗ Error insertando ${product.nombre}:`, err.message);
      }
    }
    
    console.log('¡Base de datos poblada con éxito!');
    
  } catch (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

populateDatabase();
