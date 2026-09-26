const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

const pool = require('./db');
const port = 3000;

app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `select * from cuenta`,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron obtener las cuentas' });
  }
});

app.get('/:id', async (req, res) => {
  const id = req.params.id

  try {
    const { rows } = await pool.query(
      'SELECT * FROM cuenta c WHERE id = $1',
      [id]
    );

    if (rows === 0) {
      return res.status(404).json({
        error: `No existe una cuenta con id ${id}`
      });
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo obtener la cuenta' });
  }
});

app.get('/:id/movimientos', async (req, res) => {
  const id = req.params.id
  try {
    const { rows } = await pool.query(
      `        
      select
          m.id,
          m.esIngreso as "esIngreso",
          m.monto::float8 as monto,
          m.titulo,
          m.detalle,
          m.fecha::text as fecha,
          m.cuenta_id as "cuentaId"
         from movimientos m
         where cuenta_id = $1
        order by fecha desc, created_at desc`,
        [id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudieron obtener los movimientos de la cuenta' });
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

app.post('/:id/movimientos', async (req, res) => {
  const cuentaId = Number(req.params.id);
  if (!Number.isInteger(cuentaId)) {
    return res.status(400).json({ error: 'cuentaId inválido' });
  }

  console.log(req.body)

  const error = validarMovimiento(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { id, esIngreso, monto, titulo, detalle, fecha } = req.body;

  try {
    const { rows } = await pool.query(
      `insert into movimientos (id, esIngreso, monto, titulo, detalle, fecha, cuenta_id)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (id) do nothing
       returning id, esIngreso as "esIngreso", monto::float8 as monto, titulo, detalle, fecha::text as fecha`,
      [id, esIngreso, monto, titulo.trim(), detalle ?? '', fecha, cuentaId],
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