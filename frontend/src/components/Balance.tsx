import type { Movimiento, Cuenta } from "../lib/types";
import { ars } from "../lib/utils";
import ExportarArchivo from "./ExportarArchivo";
import ImportarArchivo from "./ImportarArchivo";

interface MontoProps {
  cuenta: Cuenta;
  movimientosArray: Movimiento[];
  setMovimientosArray: React.Dispatch<React.SetStateAction<Movimiento[]>>;
  setModalAbierto: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Balance({
  cuenta,
  movimientosArray,
  setModalAbierto,
  setMovimientosArray,
}: MontoProps) {
  const ingresos = movimientosArray
    .filter((m) => m.esIngreso)
    .reduce((acc, m) => acc + Number(m.monto), 0);

  const egresos = movimientosArray
    .filter((m) => !m.esIngreso)
    .reduce((acc, m) => acc + Math.abs(Number(m.monto)), 0);

  const balance = ingresos - egresos;
  const sinIngresos = ingresos === 0;
  const usado = ingresos === 0 ? 0 : Math.round((egresos / ingresos) * 100);
  const enPositivo = usado <= 100;
  const exceso = usado - 100;
  const barWidth = enPositivo ? 100 - usado : Math.min(100, exceso);

  const mensaje =
    movimientosArray.length === 0
      ? "Todavía no cargaste movimientos"
      : sinIngresos
        ? "Todavía no registraste ingresos"
        : enPositivo
          ? `Te queda el ${100 - usado}% de tus ingresos`
          : `Egresaste un ${usado - 100}% más de lo que ingresó`;

  const colorMensaje = sinIngresos
    ? "text-[#1E2B57]/70"
    : enPositivo
      ? "text-[#2E7D55]"
      : "text-[#C2334D]";

  return (
    <section>
      <h1 className="text-sm md:text-lg font-semibold text-en text-[#1E2B57]/70 pb-4">
        {cuenta.nombre}
      </h1>
      <dl className="grid grid-cols-2 gap-6  border-[#1E2B57]/15 pb-10">
        <div>
          <dt className="text-sm text-[#1E2B57]/70">Ingresos</dt>
          <dd className="mt-1 text-2xl font-medium">{ars.format(ingresos)}</dd>
        </div>
        <div>
          <dt className="text-sm text-[#1E2B57]/70">Egresos</dt>
          <dd className="mt-1 text-2xl font-medium">{ars.format(egresos)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
        {ars.format(balance)}
      </p>

      {!sinIngresos && movimientosArray.length > 0 && (
        <>
          <div
            role="img"
            aria-label={
              enPositivo
                ? `Te queda el ${100 - usado}% de tus ingresos`
                : `Te excediste un ${exceso}% de tus ingresos`
            }
            className="mt-6 h-1 overflow-hidden rounded-full bg-[#1E2B57]/10"
          >
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${
                enPositivo ? "bg-[#2E7D55]" : "bg-[#C2334D]"
              }`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <p className={`mt-3 text-sm text-end font-semibold ${colorMensaje}`}>
            {mensaje}
          </p>
        </>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setModalAbierto(true)}
          className="cursor-pointer flex-1 rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
        >
          Agregar Movimiento
        </button>
        <ImportarArchivo
          cuentaId={cuenta.id}
          setMovimientosArray={setMovimientosArray}
        />
        <ExportarArchivo movimientos={movimientosArray} />
      </div>
    </section>
  );
}
