export type Movimiento = {
  id: string;
  esIngreso: boolean;
  titulo: string;
  detalle: string;
  fecha: string;
  monto: number;
};

export type Cuenta = {
  id: string;
  nombre: string;
};