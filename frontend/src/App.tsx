// App.tsx — Finanzas (datos de ejemplo en memoria: se pierden al recargar)
// Requiere Tailwind v4 ya configurado (@import "tailwindcss" en index.css).
//
// Paleta (buscá y reemplazá estos hex para probar otras):
//   Papel   #E8EEF0   fondo plano
//   Tinta   #1E2B57   texto, botón principal, líneas
//   Verde   #2E7D55   ingresos
//   Rojo    #C2334D   alerta cuando egresás más de lo que ingresa
//   Tintas de categorías (de más oscura a más clara):
//           #1E2B57  #4B5B90  #7C8AB5  #AEB8D6
//   Texto sobre tinta #F4F6F4

import { useEffect, useState } from "react";
import Movimientos from "./components/Movimientos";
import ModalMovimiento from "./components/ModalMovimiento";
import type { Movimiento } from "./lib/types";
import { ars } from "./lib/utils";

export default function App() {
  const [movimientosArray, setMovimientosArray] = useState<Movimiento[]>([]);

  const obtenerMovimientos = async () => {
    const respuesta = await fetch("http://localhost:3000/movimientos")
    const datos = await respuesta.json()
    setMovimientosArray(datos)
  }

  useEffect(() => {
    obtenerMovimientos()
  },[])

  const [modalAbierto, setModalAbierto] = useState(false);

  const ingresos = movimientosArray
    .filter((m) => Number(m.monto) > 0)
    .reduce((acc, m) => acc + Number(m.monto), 0);

  console.log(ingresos)

  const egresos = movimientosArray
    .filter((m) => Number(m.monto) < 0)
    .reduce((acc, m) => acc + Math.abs(Number(m.monto)), 0);

  const balance = ingresos - egresos;
  const enPositivo = balance >= 0;

  const sinIngresos = ingresos === 0;
  const usado = sinIngresos
    ? egresos > 0
      ? 100
      : 0
    : Math.round((egresos / ingresos) * 100);

  const mensaje =
    movimientosArray.length === 0
      ? "Todavía no cargaste movimientos"
      : sinIngresos
        ? "Todavía no registraste ingresos"
        : enPositivo
          ? `Te queda el ${100 - usado}% de tus ingresos`
          : `Egresaste un ${usado - 100}% más de lo que ingresó`;

  const colorMensaje = sinIngresos
    ? "text-[#1E2B57]/70"
    : enPositivo
      ? "text-[#2E7D55]"
      : "text-[#C2334D]";

  return (
    <main className="app-font min-h-screen bg-[#E8EEF0] text-[#1E2B57]">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-14 px-6 py-10 sm:py-16">
        {/* Balance */}
        <section>
          <p className="text-[#1E2B57]/70">Balance</p>
          <p className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
            {ars.format(balance)}
          </p>

          <div
            role="img"
            aria-label={`Egresos: ${usado}% de los ingresos`}
            className="mt-6 h-1 overflow-hidden rounded-full bg-[#1E2B57]/10"
          >
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${enPositivo ? "bg-[#2E7D55]" : "bg-[#C2334D]"}`}
              style={{ width: `${Math.min(usado, 100)}%` }}
            />
          </div>
          <p className={`mt-3 text-sm ${colorMensaje}`}>{mensaje}</p>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setModalAbierto(true)}
              className="flex-1 rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
            >
              Agregar Movimiento
            </button>
          </div>
        </section>

        {/* Ingresos y egresos */}
        <dl className="grid grid-cols-2 gap-6 border-t border-[#1E2B57]/15 pt-6">
          <div>
            <dt className="text-sm text-[#1E2B57]/70">Ingresos</dt>
            <dd className="mt-1 text-2xl font-medium">
              {ars.format(ingresos)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#1E2B57]/70">Egresos</dt>
            <dd className="mt-1 text-2xl font-medium">{ars.format(egresos)}</dd>
          </div>
        </dl>

        {/* Últimos movimientos */}
        <Movimientos movimientosArray={movimientosArray} />
      </div>

      <ModalMovimiento
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        setMovimientosArray={setMovimientosArray}
      />
    </main>
  );
}