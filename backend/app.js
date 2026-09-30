const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const pool = require("./db");
const port = 3000;

app.get("/cuentas", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM cuenta c
      ORDER BY c.id ASC
      `,
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudieron obtener las cuentas" });
  }
});

app.get("/cuentas/:cuentaId", async (req, res) => {
  const cuentaId = req.params.cuentaId;

  try {
    const { rows } = await pool.query("SELECT * FROM cuenta c WHERE id = $1", [
      cuentaId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: `No existe una cuenta con id ${id}`,
      });
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo obtener la cuenta" });
  }
});

app.get("/cuentas/:cuentaId/movimientos", async (req, res) => {
  const cuentaId = req.params.cuentaId;
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
      [cuentaId],
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "No se pudieron obtener los movimientos de la cuenta" });
  }
});

function validarMovimiento(body) {
  const { esIngreso, monto, titulo, fecha } = body; // sin id
  if (typeof esIngreso !== "boolean") return "esIngreso inválido";
  if (typeof monto !== "number" || !Number.isFinite(monto))
    return "monto inválido";
  if (typeof titulo !== "string" || titulo.trim().length === 0)
    return "titulo inválido";
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha))
    return "fecha inválida";
  return null;
}

app.post("/cuentas/:cuentaId/movimientos", async (req, res) => {
  const cuentaId = Number(req.params.cuentaId);
  if (!Number.isInteger(cuentaId)) {
    return res.status(400).json({ error: "cuentaId inválido" });
  }

  const error = validarMovimiento(req.body);
  if (error) return res.status(400).json({ error });

  const { esIngreso, monto, titulo, detalle, fecha } = req.body;

  try {
    const { rows } = await pool.query(
      `insert into movimientos (esIngreso, monto, titulo, detalle, fecha, cuenta_id)
       values ($1, $2, $3, $4, $5, $6)
       returning id, esIngreso as "esIngreso", monto::float8 as monto, titulo, detalle, fecha::text as fecha`,
      [esIngreso, monto, titulo.trim(), detalle ?? "", fecha, cuentaId],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo agregar el nuevo movimiento" });
  }
});

function validarMovimientoConId(body) {
  const { id } = body;
  if (typeof id !== "string" || id.length === 0) return "id inválido";
  return validarMovimiento(body);
}

app.put("/cuentas/:cuentaId/movimientos", async (req, res) => {
  const { cuentaId } = req.params;

  const error = validarMovimientoConId(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { id, esIngreso, monto, titulo, detalle, fecha } = req.body;

  try {
    const { rows, rowCount } = await pool.query(
      `
  update movimientos
  set esingreso=$2, monto=$3, titulo=$4, detalle=$5, fecha=$6
  where id=$1 and cuenta_id=$7
  returning id, esIngreso as "esIngreso", monto::float8 as monto, titulo, detalle, fecha::text as fecha
  `,
      [id, esIngreso, monto, titulo.trim(), detalle ?? "", fecha, cuentaId],
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Movimiento no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo actualizar el movimiento" });
  }
});

app.delete("/cuentas/:cuentaId/movimientos/:id", async (req, res) => {
  const { cuentaId, id } = req.params;

  if (!Number.isInteger(Number(cuentaId)))
    return res.status(400).json({ error: "cuentaId inválido" });

  if (typeof id !== "string" || id.length === 0)
    return res.status(400).json({ error: "id de movimiento inválido" });

  try {
    const cuentaExiste = await pool.query(
      "select 1 from cuenta where id = $1",
      [cuentaId],
    );

    if (cuentaExiste.rowCount === 0) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    const { rows, rowCount } = await pool.query(
      `
      delete from movimientos
      where id = $1 and cuenta_id = $2
      returning *
      `,
      [id, cuentaId],
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Movimiento no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo eliminar el movimiento" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/cuentas/:cuentaId/movimientos/eliminar", async (req, res) => {
  const { cuentaId } = req.params;

  if (!Number.isInteger(Number(cuentaId)))
    return res.status(400).json({ error: "cuentaId inválido" });

  const { movimientos_ids } = req.body;

  if (!Array.isArray(movimientos_ids) || movimientos_ids.length === 0) {
    return res.status(400).json({ error: "movimientos inválidos" });
  }

  try {
    const cuentaExiste = await pool.query(
      "select 1 from cuenta where id = $1",
      [cuentaId],
    );

    if (cuentaExiste.rowCount === 0) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    const { rows, rowCount } = await pool.query(
      `
      delete from movimientos
      where id = ANY($1) and cuenta_id = $2
      returning *
      `,
      [movimientos_ids, cuentaId],
    );

    if (rowCount < movimientos_ids.length) {
      res.status(400).json({
        error: `Error al eliminar movimientos ${movimientos_ids.length - rowCount} algunos movimientos.`,
      });
    }

    if (rowCount === 0) {
      return res.status(404).json({ error: "Ningún movimiento encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo eliminar los movimientos" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
