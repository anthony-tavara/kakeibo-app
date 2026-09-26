import { useState } from "react";
import type { Movimiento } from "../lib/types";
import { guardarMovimiento } from "../lib/movimientos";

interface GuardarMovimientosProps {
  cuentaId: string;
  movimientosArray: Movimiento[];
  setCargando: React.Dispatch<React.SetStateAction<boolean>>;
}

const TAMANIO_LOTE = 10;

export default function GuardarMovimientos({
  cuentaId,
  movimientosArray,
  setCargando,
}: GuardarMovimientosProps) {
  const [progreso, setProgreso] = useState<{ hechos: number; total: number } | null>(null);

  const handleGuardar = async () => {
    if (movimientosArray.length === 0) return;

    setCargando(true);
    setProgreso({ hechos: 0, total: movimientosArray.length });

    let fallidos = 0;

    for (let i = 0; i < movimientosArray.length; i += TAMANIO_LOTE) {
      const lote = movimientosArray.slice(i, i + TAMANIO_LOTE);
      const resultados = await Promise.all(lote.map((m) => guardarMovimiento(cuentaId, m)));
      fallidos += resultados.filter((ok) => !ok).length;
      setProgreso({
        hechos: Math.min(i + TAMANIO_LOTE, movimientosArray.length),
        total: movimientosArray.length,
      });
    }

    setCargando(false);
    setProgreso(null);
  };

  return (
    <button
      type="button"
      onClick={handleGuardar}
      disabled={!!progreso}
      className="cursor-pointer text-center flex-1 rounded-lg bg-[#E8EEF0] border border-[#1E2B57]/20 px-5 py-3.5 font-medium text-[#1E2B57] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {progreso ? `Guardando ${progreso.hechos}/${progreso.total}...` : "Guardar"}
    </button>
  );
}