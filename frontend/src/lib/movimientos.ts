import type { Movimiento, NuevoMovimiento } from "./types";

export const API_URL = import.meta.env.VITE_API_URL;

export function esMovimientoValido(m: NuevoMovimiento) {
  return (
    m &&
    typeof m.esIngreso === "boolean" &&
    typeof m.monto === "number" &&
    m.monto > 0 &&
    typeof m.titulo === "string" &&
    typeof m.detalle === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(m.fecha)
  );
}

export async function guardarMovimiento(
  cuentaId: string,
  m: NuevoMovimiento,
): Promise<Movimiento> {
  const body = {
    esIngreso: m.esIngreso,
    monto: m.monto,
    titulo: m.titulo,
    detalle: m.detalle,
    fecha: m.fecha,
    cuenta_id: cuentaId,
  };

  const res = await fetch(`${API_URL}/cuentas/${cuentaId}/movimientos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Error guardando movimiento`);
  }

  return res.json();
}

export async function editarMovimiento(
  cuentaId: string,
  m: Movimiento,
): Promise<boolean> {
  const body = {
    id: m.id,
    esIngreso: m.esIngreso,
    monto: m.monto,
    titulo: m.titulo,
    detalle: m.detalle,
    fecha: m.fecha,
  };
  try {
    const res = await fetch(`${API_URL}/cuentas/${cuentaId}/movimientos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (err) {
    console.error("Error actualizando movimiento", m.id, err);
    return false;
  }
}

export async function eliminarMovimiento(
  cuentaId: string,
  movimientoId: string,
): Promise<void> {
  const res = await fetch(
    `${API_URL}/cuentas/${cuentaId}/movimientos/${movimientoId}`,
    { method: "DELETE" },
  );

  if (res.status === 404) {
    throw new Error("No existe el movimiento a eliminar.");
  }

  if (!res.ok) {
    throw new Error(`No se pudo eliminar el movimiento (${res.status})`);
  }
}

export async function eliminarMovimientos(
  cuentaId: string,
  movimientosIds: string[],
): Promise<void> {
  const body = { movimientos_ids: movimientosIds };

  const res = await fetch(
    `${API_URL}/cuentas/${cuentaId}/movimientos/eliminar`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (res.status === 404) {
    throw new Error("No existen los movimientos a eliminar.");
  }

  if (!res.ok) {
    throw new Error(`No se eliminaron los movimientos (${res.status})`);
  }
}
