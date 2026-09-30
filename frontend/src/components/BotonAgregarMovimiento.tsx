import type { Movimiento } from "../lib/types";
import ExportarArchivo from "./ExportarArchivo";
import ImportarArchivo from "./ImportarArchivo";

type Props = {
  cuentaId: string;
  movimientos: Movimiento[];
  setMovimientos: React.Dispatch<React.SetStateAction<Movimiento[]>>;
  setMostrarModalAgregarMovimiento: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function BotonAgregarMovimiento({
  cuentaId,
  movimientos,
  setMovimientos,
  setMostrarModalAgregarMovimiento,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setMostrarModalAgregarMovimiento(true)}
        className="cursor-pointer flex-1 rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
      >
        Agregar Movimiento
      </button>
      <ImportarArchivo
        cuentaId={cuentaId}
        setMovimientosArray={setMovimientos}
      />
      <ExportarArchivo movimientos={movimientos} />
    </div>
  );
}
