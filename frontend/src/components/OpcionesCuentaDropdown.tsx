import { useState, useRef, useEffect } from "react";
import { ChevronDown, Upload, Download } from "lucide-react";

export default function OpcionesCuentaDropdown({
  onImportar,
  onExportarCSV,
  onExportarJSON,
}: {
  onImportar: () => void;
  onExportarCSV: () => void;
  onExportarJSON: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAbierto(false);
      }
    }

    if (abierto) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [abierto]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        aria-expanded={abierto}
        aria-haspopup="menu"
        onClick={() => setAbierto((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg  text-sm font-medium text-[#1E2B57] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57] cursor-pointer"
      >
        <span>Opciones</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            abierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {abierto && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-slate-100 bg-[#1E2B57] text-[#E8EEF0]  p-1.5 shadow-xl ring-1 ring-black/5 z-20 transition-all"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onImportar();
              setAbierto(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium  transition hover:bg-slate-100 hover:text-[#1E2B57]"
          >
            <Upload className="h-4 w-4" />
            Importar Archivo
          </button>

          <div className="my-1 h-px bg-[#E8EEF0]" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onExportarCSV();
              setAbierto(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-[#1E2B57]"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onExportarJSON();
              setAbierto(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 hover:text-[#1E2B57]"
          >
            <Download className="h-4 w-4" />
            Exportar JSON
          </button>
        </div>
      )}
    </div>
  );
}
