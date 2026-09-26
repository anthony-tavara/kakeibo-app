import { useRef } from "react";
import type { Movimiento } from "../lib/types";
import { esMovimientoValido } from "../lib/movimientos";

interface ImportarJsonProps {
  setMovimientosArray: React.Dispatch<React.SetStateAction<Movimiento[]>>;
}

export default function ImportarJson({ setMovimientosArray }: ImportarJsonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (!Array.isArray(data)) {
          alert("El archivo no contiene un array de movimientos.");
          return;
        }

        const validos = data.filter(esMovimientoValido);
        const invalidos = data.length - validos.length;

        if (invalidos > 0) {
          alert(`${invalidos} movimiento(s) inválido(s) fueron ignorados.`);
        }

        setMovimientosArray((prev) => {
          const idsExistentes = new Set(prev.map((m) => m.id));
          const nuevos = validos.filter((m) => !idsExistentes.has(m.id));
          return [...prev, ...nuevos];
        });
      } catch (err) {
        alert("El archivo no es un JSON válido.");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        onChange={handleFile}
        className="hidden"
        id="import-json"
      />
      <label
        htmlFor="import-json"
        className="cursor-pointer text-center flex-1 rounded-lg bg-[#E8EEF0] border border-[#1E2B57]/20 px-5 py-3.5 font-medium text-[#1E2B57] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
      >
        Importar JSON
      </label>
    </>
  );
}