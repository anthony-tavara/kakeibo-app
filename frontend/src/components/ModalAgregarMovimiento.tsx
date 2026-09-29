import { useEffect, useRef, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Movimiento, NuevoMovimiento } from "../lib/types";
import { hoyISO } from "../lib/utils";
import { guardarMovimiento } from "../lib/movimientos";
import { toast } from "sonner";

type Props = {
  cuentaId: string;
  abierto: boolean;
  onCerrar: () => void;
  setMovimientosArray: Dispatch<SetStateAction<Movimiento[]>>;
};

type Errores = {
  monto?: string;
  titulo?: string;
  fecha?: string;
};

const campo =
  "mt-1 w-full rounded-lg border border-[#1E2B57]/25 bg-white/50 px-4 py-3 outline-none transition focus:border-[#1E2B57] focus-visible:ring-2 focus-visible:ring-[#1E2B57]/25 aria-[invalid=true]:border-[#C2334D]";

export default function ModalMovimiento({
  cuentaId,
  abierto,
  onCerrar,
  setMovimientosArray,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  const [tipo, setTipo] = useState<boolean>(false);
  const [monto, setMonto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(hoyISO());
  const [errores, setErrores] = useState<Errores>({});

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) {
      dialogo.showModal();
      dialogo.querySelector<HTMLInputElement>("#mov-monto")?.focus();
    }
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  function reiniciar() {
    setTipo(false);
    setTitulo("");
    setMonto("");
    setDescripcion("");
    setFecha(hoyISO());
    setErrores({});
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();

    const valor = Number(monto);
    const nuevos: Errores = {};
    if (!valor) nuevos.monto = "Ingresá un monto mayor a 0";
    if (!titulo.trim()) nuevos.titulo = "Agregá un titulo";
    if (!fecha) nuevos.fecha = "Elegí una fecha";

    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      const primero = nuevos.monto
        ? "#mov-monto"
        : nuevos.titulo
          ? "#mov-desc"
          : "#mov-fecha";
      ref.current?.querySelector<HTMLElement>(primero)?.focus();
      return;
    }

    const nuevo: NuevoMovimiento = {
      titulo: titulo,
      esIngreso: tipo,
      detalle: descripcion,
      fecha: fecha,
      monto: Number(monto),
    };

    try {
      const nuevoMovimiento = await guardarMovimiento(cuentaId, nuevo);
      setMovimientosArray((prev) => [nuevoMovimiento, ...prev]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al eliminar el movimiento.",
      );
    } finally {
      onCerrar();
      toast.success("Movimiento agregado correctamente.");
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-modal"
      onClose={() => {
        reiniciar();
        onCerrar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#E8EEF0] p-0 text-[#1E2B57] shadow-2xl backdrop:bg-[#1E2B57]/40"
    >
      <form noValidate className="flex flex-col gap-6 p-6" onSubmit={guardar}>
        <div className="flex items-center justify-between">
          <h2 id="titulo-modal" className="text-lg font-medium">
            Agregar movimiento
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

        <div
          role="group"
          aria-label="Tipo de movimiento"
          className="grid grid-cols-2 rounded-lg border border-[#1E2B57]/25 p-1"
        >
          {(["egreso", "ingreso"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipo(!tipo);
              }}
              className={`rounded-md py-2.5 font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57] ${
                tipo === (t === "egreso" ? false : true)
                  ? "bg-[#1E2B57] text-[#F4F6F4]"
                  : "text-[#1E2B57]/70 hover:text-[#1E2B57]"
              }`}
            >
              {t === "egreso" ? "Egreso" : "Ingreso"}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="mov-monto" className="text-sm text-[#1E2B57]/70">
            Monto
          </label>
          <div
            className={`mt-1 flex items-center gap-2 border-b-2 transition focus-within:border-[#1E2B57] ${
              errores.monto ? "border-[#C2334D]" : "border-[#1E2B57]/25"
            }`}
          >
            <span className="text-4xl font-bold text-[#1E2B57]/50">$</span>
            <input
              id="mov-monto"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={monto ? Number(monto).toLocaleString("es-AR") : ""}
              onChange={(e) => {
                setMonto(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 12)
                    .replace(/^0+/, ""),
                );
                setErrores((prev) => ({ ...prev, monto: undefined }));
              }}
              aria-invalid={!!errores.monto}
              aria-describedby={errores.monto ? "err-monto" : undefined}
              className="w-full bg-transparent py-2 text-4xl font-bold tracking-tight outline-none placeholder:text-[#1E2B57]/30"
            />
          </div>
          {errores.monto && (
            <p id="err-monto" className="mt-2 text-sm text-[#C2334D]">
              {errores.monto}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mov-desc" className="text-sm text-[#1E2B57]/70">
            Titulo
          </label>
          <input
            id="mov-desc"
            type="text"
            placeholder="Ej: Entretenimiento"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              setErrores((prev) => ({ ...prev, titulo: undefined }));
            }}
            aria-invalid={!!errores.titulo}
            aria-describedby={errores.titulo ? "err-titulo" : undefined}
            className={campo}
          />
          {errores.titulo && (
            <p id="err-desc" className="mt-2 text-sm text-[#C2334D]">
              {errores.titulo}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mov-desc" className="text-sm text-[#1E2B57]/70">
            Descripción
          </label>
          <input
            id="mov-desc"
            type="text"
            placeholder="Ej: Entrada de cine"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
            }}
            className={campo}
          />
        </div>

        <div>
          <label htmlFor="mov-fecha" className="text-sm text-[#1E2B57]/70">
            Fecha
          </label>
          <input
            id="mov-fecha"
            type="date"
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value);
              setErrores((prev) => ({ ...prev, fecha: undefined }));
            }}
            aria-invalid={!!errores.fecha}
            aria-describedby={errores.fecha ? "err-fecha" : undefined}
            className={campo}
          />
          {errores.fecha && (
            <p id="err-fecha" className="mt-2 text-sm text-[#C2334D]">
              {errores.fecha}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 rounded-lg border border-[#1E2B57] px-5 py-3.5 font-medium transition hover:bg-[#1E2B57]/5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-[2] rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
          >
            Guardar movimiento
          </button>
        </div>
      </form>
    </dialog>
  );
}
