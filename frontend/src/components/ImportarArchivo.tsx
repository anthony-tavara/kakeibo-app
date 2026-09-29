import { useRef, useState } from "react";
import type { Movimiento, NuevoMovimiento } from "../lib/types";
import { guardarMovimiento } from "../lib/movimientos";
import { importarArchivo } from "../lib/importarArchivos";
import ModalVisualizarMovimientos from "./ModalVisualizarMovimientos";

type Props = {
  setMovimientosArray: React.Dispatch<React.SetStateAction<Movimiento[]>>;
  cuentaId: string;
};

export default function ImportarArchivo({
  setMovimientosArray,
  cuentaId,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevosMovimientos, setNuevosMovimientos] =
    useState<NuevoMovimiento[]>();

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { validos, cantidadInvalidos } = await importarArchivo(file);

      if (cantidadInvalidos > 0) {
        alert(
          `${cantidadInvalidos} movimiento(s) inválido(s) fueron ignorados.`,
        );
      }
      setNuevosMovimientos(validos);
      setModalAbierto(true);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Error al importar el archivo.",
      );
    } finally {
      e.target.value = "";
    }
  }

  async function handleConfirmar() {
    if (!nuevosMovimientos) return;
    setGuardando(true);
    try {
      const movimientos: Movimiento[] = [];
      for (const m of nuevosMovimientos)
        movimientos.push(await guardarMovimiento(cuentaId, m));

      setMovimientosArray((prev) => [...prev, ...movimientos]);
    } catch {
      alert("Error al guardar los movimientos.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.json,text/csv,application/json"
        onChange={handleArchivo}
        className="hidden"
        id="import-file"
      />
      <label
        htmlFor="import-file"
        className="cursor-pointer text-center flex-1 rounded-lg bg-[#E8EEF0] border border-[#1E2B57]/20 px-5 py-3.5 font-medium text-[#1E2B57] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
      >
        Importar Archivo (.csv o .json)
      </label>

      {nuevosMovimientos && (
        <ModalVisualizarMovimientos
          abierto={modalAbierto}
          guardando={guardando}
          movimientos={nuevosMovimientos}
          onCerrar={() => setModalAbierto(false)}
          onConfirmar={handleConfirmar}
        />
      )}
    </>
  );
}
