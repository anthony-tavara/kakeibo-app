import type { Movimiento } from "../lib/types";
import { ars } from "../lib/utils";

interface BalanceProps {
  movimientosArray: Movimiento[];
}

export default function Balance({ movimientosArray }: BalanceProps) {
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

          <dl className="grid mt-2 grid-cols-2 gap-6 border-[#1E2B57]/15">
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
    </section>
  );
}
