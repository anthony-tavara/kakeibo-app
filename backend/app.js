const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

const pool = require('./db');
const port = 3000;

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

function validarMovimiento(body) {
  const { id, esIngreso, monto, titulo, fecha } = body;
  if (typeof id !== 'string' || id.length === 0) return 'id inválido';
  if (typeof esIngreso !== 'boolean') return 'esIngreso inválido';
  if (typeof monto !== 'number' || !Number.isFinite(monto)) return 'monto inválido';
  if (typeof titulo !== 'string' || titulo.trim().length === 0) return 'titulo inválido';
  if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return 'fecha inválida';
  return null;
}

app.post('/movimientos', async (req, res) => {
  const error = validarMovimiento(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { id, esIngreso, monto, titulo, detalle, fecha } = req.body;

  try {
    const { rows } = await pool.query(
      `insert into movimientos (id, esIngreso, monto, titulo, detalle, fecha)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (id) do nothing
       returning id, esIngreso as "esIngreso", monto::float8 as monto, titulo, detalle, fecha::text as fecha`,
      [id, esIngreso, monto, titulo.trim(), detalle ?? '', fecha],
    );

    if (rows.length === 0) {
      return res.status(200).json({ id, yaExistia: true });
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo agregar el nuevo movimiento' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});