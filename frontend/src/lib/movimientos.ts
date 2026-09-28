import type { Movimiento } from "./types";

export const API_URL = import.meta.env.VITE_API_URL;

export function esMovimientoValido(m: any): m is Movimiento {
  return (
    m &&
    typeof m.id === "string" &&
    typeof m.esIngreso === "boolean" &&
    typeof m.monto === "number" &&
    typeof m.titulo === "string" &&
    typeof m.detalle === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(m.fecha)
  );
}

export async function guardarMovimiento(
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
    cuenta_id: cuentaId,
  };
  try {
    const res = await fetch(`${API_URL}/cuentas/${cuentaId}/movimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (err) {
    console.error("Error guardando movimiento", cuentaId, m.id, err);
    return false;
  }
}

export async function editarMovimiento(cuentaId, m: Movimiento): Promise<boolean> {
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
): Promise<boolean> {
  const body = { id: movimientoId };
  try {
    const res = await fetch(`${API_URL}/cuentas/${cuentaId}/movimientos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (err) {
    console.error("Error guardando movimiento", cuentaId, movimientoId, err);
    return false;
  }
}
