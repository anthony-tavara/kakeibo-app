import { useEffect, useRef, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { CATEGORIAS } from "../lib/types";
import type { Movimiento, Tipo } from "../lib/types";
import { hoyISO } from "../lib/utils";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  setMovimientosArray: Dispatch<SetStateAction<Movimiento[]>>;
};

type Errores = {
  monto?: string;
  descripcion?: string;
  fecha?: string;
};

const campo =
  "mt-1 w-full rounded-lg border border-[#1E2B57]/25 bg-white/50 px-4 py-3 outline-none transition focus:border-[#1E2B57] focus-visible:ring-2 focus-visible:ring-[#1E2B57]/25 aria-[invalid=true]:border-[#C2334D]";

export default function ModalMovimiento({
  abierto,
  onCerrar,
  setMovimientosArray,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  const [tipo, setTipo] = useState<boolean>(false);
  const [monto, setMonto] = useState(""); // solo dígitos, ej: "48200"
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(hoyISO());
  const [errores, setErrores] = useState<Errores>({});

  const agregarMovimiento = async () => {
    await fetch("http://localhost:3000/movimientos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        esIngreso: tipo,
        monto: monto,
        titulo: titulo,
        detalle: descripcion,
        fecha: fecha,
      }),
    })
    .then((r) => r.json())
    .then((data) => console.log("Respuesta del servidor:", data))
    .catch((err) => console.error("Error en la petición:", err));
  }

  // Sincroniza el estado con el <dialog> nativo (foco atrapado y cierre con Esc)
  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) {
      dialogo.showModal();
      dialogo.querySelector<HTMLInputElement>("#mov-monto")?.focus();
    }
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  // Deja el formulario limpio para la próxima vez que se abra
  function reiniciar() {
    setTipo(false);
    setMonto("");
    setDescripcion("");
    setFecha(hoyISO());
    setErrores({});
  }

  function guardar(e: FormEvent) {
    e.preventDefault();

    const valor = Number(monto);
    const nuevos: Errores = {};
    if (!valor) nuevos.monto = "Ingresá un monto mayor a 0";
    /* if (!descripcion.trim()) nuevos.descripcion = "Agregá una descripción"; */
    if (!fecha) nuevos.fecha = "Elegí una fecha";

    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      const primero = nuevos.monto
        ? "#mov-monto"
        : nuevos.descripcion
          ? "#mov-desc"
          : "#mov-fecha";
      ref.current?.querySelector<HTMLElement>(primero)?.focus();
      return;
    }

    const nuevo: Movimiento = {
      id: Date.now(),
      titulo: descripcion.trim(),
      esIngreso: true,
      detalle: "",
      fecha,
      monto: 0,
    };

    // Versión con (prev) => ...: siempre parte del estado más reciente
    setMovimientosArray((prev) => [nuevo, ...prev]);
    onCerrar();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-modal"
      onClose={() => {
        // Se dispara siempre que se cierra (Esc, botones o fondo)
        reiniciar();
        onCerrar();
      }}
      onClick={(e) => {
        // Un clic en el fondo oscuro cierra el modal
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-[#E8EEF0] p-0 text-[#1E2B57] shadow-2xl backdrop:bg-[#1E2B57]/40"
    >
      <form
        noValidate
        className="flex flex-col gap-6 p-6"
        onSubmit={guardar}
      >
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

        {/* Tipo */}
        <div
          role="group"
          aria-label="Tipo de movimiento"
          className="grid grid-cols-2 rounded-lg border border-[#1E2B57]/25 p-1"
        >
          {(["egreso", "ingreso"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {setTipo(!tipo)
                console.log(tipo)
              }}
              className={`rounded-md py-2.5 font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57] ${
                tipo === (t === "egreso" ? true : false)
                  ? "bg-[#1E2B57] text-[#F4F6F4]"
                  : "text-[#1E2B57]/70 hover:text-[#1E2B57]"
              }`}
            >
              {t === "egreso" ? "Egreso" : "Ingreso"}
            </button>
          ))}
        </div>

        {/* Monto */}
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
                // Deja solo dígitos, sin ceros a la izquierda y con un tope razonable
                setMonto(
                  e.target.value.replace(/\D/g, "").slice(0, 12).replace(/^0+/, ""),
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
              /* setErrores((prev) => ({ ...prev, descripcion: undefined })); */
            }}
            /* aria-invalid={!!errores.descripcion}
            aria-describedby={errores.descripcion ? "err-desc" : undefined} */
            className={campo}
          />
          {/* {errores.descripcion && (
            <p id="err-desc" className="mt-2 text-sm text-[#C2334D]">
              {errores.descripcion}
            </p>
          )} */}
        </div>

        {/* Descripción */}
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
              /* setErrores((prev) => ({ ...prev, descripcion: undefined })); */
            }}
            aria-invalid={!!errores.descripcion}
            aria-describedby={errores.descripcion ? "err-desc" : undefined}
            className={campo}
          />
          {errores.descripcion && (
            <p id="err-desc" className="mt-2 text-sm text-[#C2334D]">
              {errores.descripcion}
            </p>
          )}
        </div>

        {/* Fecha */}
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

        {/* Acciones */}
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
            onClick={() => agregarMovimiento()}
            className="flex-[2] rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
          >
            Guardar movimiento
          </button>
        </div>
      </form>
    </dialog>
  );
}