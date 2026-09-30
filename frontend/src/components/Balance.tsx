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
  const total = ingresos + egresos;
  const porcentajeIngresos = Math.round((ingresos / total) * 100);
  const barWidth = porcentajeIngresos;

  return (
    <section>
      <h1 className="text-sm md:text-lg font-semibold text-en text-[#1E2B57]/70 pb-4">
        {cuenta.nombre}
      </h1>

      <p className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
        {ars.format(balance)}
      </p>

      {!sinIngresos && movimientosArray.length > 0 && (
        <>
          <div
            role="img"
            className="mt-6 h-1 overflow-hidden rounded-full bg-[#1E2B57]/10 bg-[#C2334D]/80"
          >
            <div
              role="img"
              className="h-full rounded-full transition-[width] duration-300 bg-[#2E7D55]/80"
              style={{ width: `${barWidth}%` }}
            />
          </div>

          <dl className="grid mt-2 grid-cols-2 gap-6 border-[#1E2B57]/15 pb-10">
            <div>
              <dt className="text-sm text-[#2E7D55]">Ingresos</dt>
              <dd className="mt-1 text-lg md:text-xl font-medium">
                {ars.format(ingresos)}
              </dd>
            </div>
            <div className="text-end">
              <dt className="text-sm text-[#C2334D]/70">Egresos</dt>
              <dd className="mt-1 text-lg md:text-xl font-medium">
                {ars.format(egresos)}
              </dd>
            </div>
          </dl>
        </>
      )}

      <div className="flex flex-col gap-3">
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
