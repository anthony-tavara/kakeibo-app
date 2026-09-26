import type { Movimiento } from "./types";

export const API_URL = import.meta.env.VITE_API_URL

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

export async function guardarMovimiento(m: Movimiento): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/movimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(m),
    });
    return res.ok;
  } catch (err) {
    console.error("Error guardando movimiento", m.id, err);
    return false;
  }
}