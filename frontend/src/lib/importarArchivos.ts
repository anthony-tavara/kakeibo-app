import { v4 } from "uuid";
import { esMovimientoValido } from "./movimientos";
import Papa from "papaparse";
import type { Movimiento } from "./types";

const OBLIGATORIAS = ["esIngreso", "monto", "titulo", "detalle", "fecha"];

export async function importarCsv(file: File) {
  const texto = await file.text();

  const { data, meta } = Papa.parse<Record<string, string>>(texto, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const headers = meta.fields ?? [];
  const faltantes = OBLIGATORIAS.filter((c) => !headers.includes(c));
  if (faltantes.length > 0) {
    throw new Error(`Faltan columnas: ${faltantes.join(", ")}`);
  }

  if (data.length === 0) {
    throw new Error("El archivo CSV no tiene movimientos.");
  }

  const traeId = headers.includes("id");

  const movimientos: Movimiento[] = data.map((fila) => ({
    id: traeId && fila.id?.trim() ? fila.id.trim() : v4(),
    esIngreso: fila.esIngreso?.trim().toLowerCase() === "true",
    monto: Number(fila.monto),
    titulo: fila.titulo?.trim() ?? "",
    detalle: fila.detalle?.trim() ?? "",
    fecha: fila.fecha?.trim() ?? "",
  }));

  const validos = movimientos.filter(esMovimientoValido);
  return { validos, cantidadInvalidos: movimientos.length - validos.length };
}

export async function importarJson(file: File) {
  const texto = await file.text();
  const movimientos = JSON.parse(texto);

  const validos = movimientos.filter(esMovimientoValido);
  return { validos, cantidadInvalidos: movimientos.length - validos.length };
}