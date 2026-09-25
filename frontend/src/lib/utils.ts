export const ars = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// Fecha de hoy en formato "YYYY-MM-DD" usando la hora local.
// (toISOString() usa UTC y en Argentina, después de las 21:00, devolvería el día siguiente)
export function hoyISO(): string {
  const hoy = new Date();
  const y = hoy.getFullYear();
  const m = String(hoy.getMonth() + 1).padStart(2, "0");
  const d = String(hoy.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

// "2026-09-23" -> "23 sep"
export function formatearFecha(iso: string): string {
  const [fecha] = iso.split("T");
  const [,mes,dia] = fecha.split("-").map(Number);
  return `${dia} ${MESES[mes - 1]}`;
}