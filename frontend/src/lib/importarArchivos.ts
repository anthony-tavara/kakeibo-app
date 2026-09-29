import { esMovimientoValido } from "./movimientos";
import Papa from "papaparse";
import type { NuevoMovimiento } from "./types";

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

  const movimientos: NuevoMovimiento[] = data.map((fila) => ({
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

  const validos: NuevoMovimiento[] = movimientos.filter(esMovimientoValido);
  return { validos, cantidadInvalidos: movimientos.length - validos.length };
}

export async function importarArchivo(file: File): Promise<{
  validos: NuevoMovimiento[];
  cantidadInvalidos: number;
}> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") return await importarCsv(file);
  if (extension === "json") return await importarJson(file);

  throw new Error("Formato no soportado. Usá .csv o .json");
}
