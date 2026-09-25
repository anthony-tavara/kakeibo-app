const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const pool = require('./db'); 
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/movimientos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `select id, esIngreso as "esIngreso", monto::float8 as monto, titulo, detalle, fecha::text as fecha
         from movimientos
        order by fecha desc, created_at desc`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron obtener los movimientos' });
  }
});

app.post('/movimientos', async (req, res) => {
  const { esIngreso, monto, titulo, detalle, fecha } = req.body;

  try {
    const { rows } = await pool.query(
      `insert into movimientos (esIngreso, monto, titulo, detalle, fecha)
       values ($1, $2, $3, $4, $5)
       returning id, esIngreso as "esIngreso", monto::float8 as monto, titulo, detalle, fecha::text as fecha`,
      [esIngreso, monto, titulo.trim(), detalle ?? '', fecha],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo agregar el nuevo movimiento' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});