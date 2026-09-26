import { useState } from "react";
import type { Movimiento } from "../lib/types";
import { ars, formatearFecha } from "../lib/utils";

const VISIBLES = 6;

type Props = {
  movimientosArray: Movimiento[];
};

export default function Movimientos({ movimientosArray }: Props) {
  const [verTodos, setVerTodos] = useState(false);

  const ordenados = [...movimientosArray].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || Number(b.id) - Number(a.id),
  );
  const visibles = verTodos ? ordenados : ordenados.slice(0, VISIBLES);

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-lg font-medium">Últimos movimientos</h2>
        {ordenados.length > VISIBLES && (
          <button
            type="button"
            onClick={() => setVerTodos((v) => !v)}
            className="text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
          >
            {verTodos ? "Ver menos" : `Ver todos (${ordenados.length})`}
          </button>
        )}
      </div>

      {ordenados.length === 0 ? (
        <p className="py-6 text-[#1E2B57]/70">
          Todavía no hay movimientos. Tocá “Agregar Movimiento” para cargar el
          primero.
        </p>
      ) : (
        <ul>
          {visibles.map((m) => {
            return (
              <li
                key={m.id}
                className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 border-b border-[#1E2B57]/10 py-4 last:border-b-0"
              >
                <span className="text-sm text-[#1E2B57]/70">
                  {formatearFecha(m.fecha)}
                </span>
                <div>
                  <p className="font-medium">{m.titulo}</p>
                  <p className="text-sm text-[#1E2B57]/70">{m.detalle}</p>
                </div>
                <p
                  className={`font-medium ${m.esIngreso ? "text-[#2E7D55]" : ""}`}
                >
                  {m.esIngreso ? "+" : "−"}
                  {ars.format(Math.abs(m.monto))}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
