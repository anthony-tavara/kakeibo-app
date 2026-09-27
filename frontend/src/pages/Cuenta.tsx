import { useEffect, useState } from "react";
import Movimientos from "../components/Movimientos";
import ModalAgregarMovimiento from "../components/ModalAgregarMovimiento";
import type { Movimiento, Cuenta } from "../lib/types";
import Monto from "../components/Balance";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import ModalEditarMovimiento from "../components/ModalEditarMovimiento";
export const API_URL = import.meta.env.VITE_API_URL;

export default function Cuenta() {
  const { id } = useParams<{ id: string }>();
  const [cuenta, setCuenta] = useState<Cuenta>({ id: "", nombre: "" });
  const [seEncontroCuenta, setSeEncontroCuenta] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [movimientosArray, setMovimientosArray] = useState<Movimiento[]>([]);
  const [movimientoEditar, setMovimientoEditar] = useState<Movimiento>();

  const obtenerCuenta = async () => {
    const respuesta = await fetch(`${API_URL}/${id}`);
    const datos = await respuesta.json();
    if (!datos?.[0]) {
      setSeEncontroCuenta(false);
      return;
    }
    setCuenta(datos[0]);
    return datos;
  };

  const obtenerMovimientos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/${id}/movimientos`);
      const datos = await respuesta.json();
      setMovimientosArray(datos);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    setCargando(true);
    obtenerCuenta();
    obtenerMovimientos();
  }, []);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarModalEditarMov, setMostrarModalEditarMov] = useState(false);

  return (
    <>
      {cargando && <Loading />}

      {!seEncontroCuenta && <NotFound />}

      <main className="app-font min-h-screen bg-[#E8EEF0] text-[#1E2B57]">
        <div className="mx-auto flex w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-14 px-6 py-10 sm:py-16">
          <Monto
            cuenta={cuenta}
            setCargando={setCargando}
            movimientosArray={movimientosArray}
            setModalAbierto={setModalAbierto}
            setMovimientosArray={setMovimientosArray}
          />
          <Movimientos
            onAbrirModalEditarMov={() => setMostrarModalEditarMov(true)}
            movimientosArray={movimientosArray}
            setMovimientoEditar={setMovimientoEditar}
          />
        </div>

        <ModalAgregarMovimiento
          abierto={modalAbierto}
          onCerrar={() => setModalAbierto(false)}
          setMovimientosArray={setMovimientosArray}
        />

        <ModalEditarMovimiento
          movimientosArray={movimientosArray}
          movimientoEditar={movimientoEditar}
          abierto={mostrarModalEditarMov}
          onCerrar={() => setMostrarModalEditarMov(false)}
        />
      </main>
    </>
  );
}
