export type Movimiento = {
  id: number;
  esIngreso: boolean;
  titulo: string;
  detalle: string; 
  fecha: string; 
  monto: number; 
};

export type Tipo = "egreso" | "ingreso";

export const CATEGORIAS = [
  "Fijos",
  "Variables",
  "Impuestos y deudas",
  "Otros",
] as const;