import { useEffect, useRef } from "react";
import type { Movimiento } from "../lib/types";
import FormEditarMovimiento from "./FormEditarMovimiento";

type Props = {
  movimientoEditar: Movimiento;
  abierto: boolean;
  onCerrar: () => void;
  movimientosArray: Movimiento[];
};

export default function ModalEditarMovimiento({
  movimientosArray,
  movimientoEditar,
  abierto,
  onCerrar,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) {
      dialogo.showModal();
      dialogo.querySelector<HTMLInputElement>("#mov-monto")?.focus();
    }
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-modal"
      onClose={() => {
        onCerrar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#E8EEF0] p-0 text-[#1E2B57] shadow-2xl backdrop:bg-[#1E2B57]/40"
    >
      <FormEditarMovimiento
        key={movimientoEditar.id}
        movimientoEditar={movimientoEditar}
        movimientosArray={movimientosArray}
        onCerrar={onCerrar}
      />
    </dialog>
  );
}
