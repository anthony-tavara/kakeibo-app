import { useEffect, useState } from "react";
import Movimientos from "../components/Movimientos";
import ModalAgregarMovimiento from "../components/ModalAgregarMovimiento";
import type { Movimiento } from "../lib/types";
import Monto from "../components/Balance";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
export const API_URL = import.meta.env.VITE_API_URL

export type Cuenta = {
  id: string;
  nombre: string;
}

export default function Cuenta() {
  const { id } = useParams<{ id: string }>();

  console.log(id)

  const [cuenta, setCuenta] = useState<Cuenta>({id : "", nombre: ""});
  const [cargando, setCargando] = useState(false);
  const [movimientosArray, setMovimientosArray] = useState<Movimiento[]>([]);

   const obtenerCuenta = async () => {
      const respuesta = await fetch(`${API_URL}/${id}`);
      const datos = await respuesta.json();
      setCuenta(datos[0])
      return datos
  };

  const obtenerMovimientos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}/movimientos`);
      const datos = await respuesta.json();
      console.log(datos)
      setMovimientosArray(datos);
    } finally {
      setCargando(false)
    }
  };

  useEffect(() => {
    setCargando(true);
    obtenerCuenta()
    obtenerMovimientos();
  }, []);

  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <>
      {cargando && <Loading />}

      <main className="app-font min-h-screen bg-[#E8EEF0] text-[#1E2B57]">
        <div className="mx-auto flex w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-14 px-6 py-10 sm:py-16">
          <Monto
          cuenta={cuenta}
          setCargando={setCargando}
            movimientosArray={movimientosArray}
            setModalAbierto={setModalAbierto}
            setMovimientosArray={setMovimientosArray}
          />
          <Movimientos movimientosArray={movimientosArray} />
        </div>

        <ModalAgregarMovimiento
          abierto={modalAbierto}
          onCerrar={() => setModalAbierto(false)}
          setMovimientosArray={setMovimientosArray}
        />
      </main>
    </>
  );
}
