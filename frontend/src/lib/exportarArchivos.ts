import Papa from "papaparse";
import type { Movimiento } from "./types";

function descargar(contenido: string, nombre: string, mime: string) {
  const blob = new Blob([contenido], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();

  URL.revokeObjectURL(url);
}

export function exportarCsv(movimientos: Movimiento[], nombre = "movimientos") {
  if (movimientos.length == 0)
    throw new Error("No hay ningún movimiento registrado.");

  const csv = Papa.unparse(movimientos, {
    columns: ["esIngreso", "monto", "titulo", "detalle", "fecha"],
  });
  // "\uFEFF" (BOM) hace que Excel lea bien las tildes
  descargar("\uFEFF" + csv, `${nombre}.csv`, "text/csv;charset=utf-8");
}

export function exportarJson(
  movimientos: Movimiento[],
  nombre = "movimientos",
) {
  if (movimientos.length == 0)
    throw new Error("No hay ningún movimiento registrado.");

  const json = JSON.stringify(
    movimientos.map((m) => {
      return {
        esIngreso: m.esIngreso,
        monto: m.monto,
        titulo: m.titulo,
        detalle: m.detalle,
        fecha: m.fecha,
      };
    }),
    null,
    2,
  );
  descargar(json, `${nombre}.json`, "application/json");
}
