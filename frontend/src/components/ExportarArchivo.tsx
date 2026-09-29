import { exportarCsv, exportarJson } from "../lib/exportarArchivos";
import type { Movimiento } from "../lib/types";

type Props = { movimientos: Movimiento[] };

export default function ExportarArchivo({ movimientos }: Props) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        className="cursor-pointer flex-1 rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
        onClick={() => exportarCsv(movimientos)}
      >
        Exportar CSV
      </button>
      <button
        type="button"
        className="cursor-pointer flex-1 rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
        onClick={() => exportarJson(movimientos)}
      >
        Exportar JSON
      </button>
    </div>
  );
}
