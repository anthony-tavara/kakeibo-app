import { useState } from "react";
import type { Movimiento } from "../lib/types";
import { ars, formatearFecha } from "../lib/utils";
import { SquarePen, Trash2 } from "lucide-react";

const VISIBLES = 6;

type Props = {
  onAbrirModalEditarMov: () => void;
  movimientosArray: Movimiento[];
  setMovimientoEditar: React.Dispatch<React.SetStateAction<Movimiento | undefined>>;
};

export default function Movimientos({
  setMovimientoEditar,
  onAbrirModalEditarMov,
  movimientosArray,
}: Props) {
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
                <div className="text-end">
                  <p
                    className={`font-medium ${m.esIngreso ? "text-[#2E7D55]" : ""}`}
                  >
                    {m.esIngreso ? "+" : "−"}
                    {ars.format(Math.abs(m.monto))}
                  </p>
                  <button
                    onClick={() => {
                      setMovimientoEditar(m)
                      onAbrirModalEditarMov()
                    }}
                    type="button"
                    aria-label="Editar movimiento"
                    className="rounded-lg mr-4 text-[#1E2B57]/60 transition hover:text-[#1E2B57] cursor-pointer"
                  >
                    <SquarePen className="size-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    aria-label="Eliminar movimiento"
                    className="rounded-lg  text-[#C2334D]/70 transition hover:text-[#C2334D] cursor-pointer"
                  >
                    <Trash2 className="size-4" strokeWidth={2} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
