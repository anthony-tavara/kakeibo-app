import { useState } from "react";
import type { Movimiento } from "../lib/types";
import { ars, formatearFecha } from "../lib/utils";
import { SquarePen, Trash2 } from "lucide-react";
import { eliminarMovimientos } from "../lib/movimientos";
import { toast } from "sonner";

const VISIBLES = 6;

type Props = {
  cuentaId: string;
  onAbrirModalEditarMov: () => void;
  onAbrirModalEliminarMov: () => void;
  movimientosArray: Movimiento[];
  setMovimientos: React.Dispatch<
    React.SetStateAction<Movimiento[]>
  >;
  setMovimientoEditar: React.Dispatch<
    React.SetStateAction<Movimiento | undefined>
  >;
  setMovimientoEliminar: React.Dispatch<
    React.SetStateAction<Movimiento | undefined>
  >;
};

export default function Movimientos({
  cuentaId,
  setMovimientoEditar,
  setMovimientoEliminar,
  onAbrirModalEditarMov,
  onAbrirModalEliminarMov,
  movimientosArray,
  setMovimientos,
}: Props) {
  const [verTodos, setVerTodos] = useState(false);
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());

  const ordenados = [...movimientosArray].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || Number(b.id) - Number(a.id),
  );
  const visibles = verTodos ? ordenados : ordenados.slice(0, VISIBLES);

  function alternar(id: string) {
    setSeleccionados((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });
  }

  function cambiarModo() {
    if (modoSeleccion) setSeleccionados(new Set());
    setModoSeleccion((m) => !m);
  }

  async function onConfirmar() {
    try {
      await eliminarMovimientos(cuentaId, [...seleccionados]);
      setMovimientos((prev) => prev.filter((m) => !seleccionados.has(m.id)));
      setSeleccionados(new Set());
      toast.success("Se eliminaron los movimientos correctamente");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Error al eliminar los movimientos.",
      );
    }
  }

  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        {movimientosArray.length > 0 && (
          <button
            className="flex text-xs md:text-base  cursor-pointer"
            onClick={cambiarModo}
          >
            {modoSeleccion ? "Cancelar" : "Seleccionar"}
          </button>
        )}
        <h2 className="text-sm md:text-lg font-medium">Últimos movimientos</h2>
        {ordenados.length > VISIBLES && (
          <button
            type="button"
            onClick={() => setVerTodos((v) => !v)}
            className="text-xs underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57] cursor-pointer"
          >
            {verTodos ? "Ver menos" : `Ver todos`}
          </button>
        )}
      </div>

      {modoSeleccion && (
        <div className="mb-4 flex items-center justify-between text-sm">
          <span>
            {seleccionados.size}{" "}
            {seleccionados.size === 1 ? "seleccionado" : "seleccionados"}
          </span>
          <div className="flex gap-3">
            <button
              className="cursor-pointer"
              type="button"
              onClick={() =>
                seleccionados.size === 0
                  ? setSeleccionados(new Set(visibles.map((m) => m.id)))
                  : setSeleccionados(new Set())
              }
            >
              {seleccionados.size === 0 ? "Seleccionar todos" : "Deseleccionar"}
            </button>
            <button
              type="button"
              disabled={seleccionados.size === 0}
              onClick={onConfirmar}
              className="text-[#C2334D] cursor-pointer disabled:opacity-50 disabled:cursor-default"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}

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
                className={
                  seleccionados.has(m.id)
                    ? "grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 border-b border-[#1E2B57]/10 py-4 px-2 last:border-b-0 bg-[#1E2B57]/10"
                    : "grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 border-b border-[#1E2B57]/10 py-4 px-2 last:border-b-0"
                }
              >
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    disabled={!modoSeleccion}
                    checked={seleccionados.has(m.id)}
                    onChange={() => alternar(m.id)}
                    aria-label={`Seleccionar ${m.titulo}`}
                    className="disabled:opacity-0"
                  />

                  <span className="text-sm text-[#1E2B57]/70">
                    {formatearFecha(m.fecha)}
                  </span>
                </div>

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
                  {!modoSeleccion && (
                    <>
                      <button
                        onClick={() => {
                          setMovimientoEditar(m);
                          onAbrirModalEditarMov();
                        }}
                        type="button"
                        aria-label="Editar movimiento"
                        className="rounded-lg mr-4 text-[#1E2B57]/60 transition hover:text-[#1E2B57] cursor-pointer"
                      >
                        <SquarePen className="size-4" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => {
                          setMovimientoEliminar(m);
                          onAbrirModalEliminarMov();
                        }}
                        type="button"
                        aria-label="Eliminar movimiento"
                        className="rounded-lg  text-[#C2334D]/70 transition hover:text-[#C2334D] cursor-pointer"
                      >
                        <Trash2 className="size-4" strokeWidth={2} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
