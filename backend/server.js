const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000; // Puedes usar otro puerto si lo prefieres

app.use(cors());
app.use(express.json()); // Para que el servidor pueda leer el cuerpo de las peticiones JSON

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '06814943', 
  database: 'warhammer_db'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Rutas de la API

// Obtener todas las facciones
app.get('/api/facciones', (req, res) => {
  db.query('SELECT * FROM Facciones', (err, results) => {
    if (err) {
      console.error('Error al obtener las facciones:', err);
      res.status(500).json({ error: 'Error al obtener las facciones' });
      return;
    }
    res.json(results);
  });
});

// Obtener todas las unidades
app.get('/api/unidades', (req, res) => {
  db.query('SELECT * FROM Unidades', (err, results) => {
    if (err) {
      console.error('Error al obtener las unidades:', err);
      res.status(500).json({ error: 'Error al obtener las unidades' });
      return;
    }
    res.json(results);
  });
});

// Obtener las unidades de una facción específica
app.get('/api/unidades/:id_faccion', (req, res) => {
  const factionId = req.params.id_faccion;
  db.query('SELECT * FROM Unidades WHERE id_faccion = ?', [factionId], (err, results) => {
    if (err) {
      console.error(`Error al obtener las unidades de la facción ${factionId}:`, err);
      res.status(500).json({ error: `Error al obtener las unidades de la facción ${factionId}` });
      return;
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});