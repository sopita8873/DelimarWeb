// Servidor de prueba simple
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente', timestamp: new Date() });
});

app.get('/categorias', (req, res) => {
  res.json([
    { id: 1, nombre: 'Pescados' },
    { id: 2, nombre: 'Mariscos' },
    { id: 3, nombre: 'Conservas' }
  ]);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor de prueba funcionando en puerto ${PORT}`);
  console.log(`Prueba: http://localhost:${PORT}/test`);
});
