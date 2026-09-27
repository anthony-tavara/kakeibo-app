import { useEffect, useRef } from "react";
import type { Movimiento } from "../lib/types";
import { ars, formatearFecha } from "../lib/utils";
import { eliminarMovimiento } from "../lib/movimientos";

type Props = {
  cuentaId: string;
  movimiento: Movimiento;
  abierto: boolean;
  onCerrar: () => void;
  onConfirmar: (id: string) => void;
};

export default function ModalEliminarMovimiento({
  cuentaId,
  movimiento,
  abierto,
  onCerrar,
  onConfirmar,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) {
      dialogo.showModal();
    }
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  function confirmar() {
    onConfirmar(movimiento.id);
    eliminarMovimiento(cuentaId, movimiento.id);
    onCerrar();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-modal-eliminar"
      onClose={onCerrar}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#E8EEF0] p-0 text-[#1E2B57] shadow-2xl backdrop:bg-[#1E2B57]/40"
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h2 id="titulo-modal-eliminar" className="text-lg font-medium">
            Eliminar movimiento
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="-mr-2 rounded-lg p-2 transition hover:bg-[#1E2B57]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <li
          key={movimiento.id}
          className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 border-b border-[#1E2B57]/10 py-4 last:border-b-0"
        >
          <span className="text-sm text-[#1E2B57]/70">
            {formatearFecha(movimiento.fecha)}
          </span>
          <div>
            <p className="font-medium">{movimiento.titulo}</p>
            <p className="text-sm text-[#1E2B57]/70">{movimiento.detalle}</p>
          </div>
          <div className="text-end">
            <p
              className={`font-medium ${movimiento.esIngreso ? "text-[#2E7D55]" : ""}`}
            >
              {movimiento.esIngreso ? "+" : "−"}
              {ars.format(Math.abs(movimiento.monto))}
            </p>
          </div>
        </li>

        <p className="text-[#1E2B57]/70 text-sm text-end">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 rounded-lg border border-[#1E2B57] px-5 py-3.5 font-medium transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            className="flex-[2] rounded-lg bg-[#C2334D] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2334D] cursor-pointer"
          >
            Eliminar movimiento
          </button>
        </div>
      </div>
    </dialog>
  );
}
