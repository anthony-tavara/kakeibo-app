import { useEffect, useState } from "react";
import Movimientos from "../components/Movimientos";
import ModalAgregarMovimiento from "../components/ModalAgregarMovimiento";
import type { Movimiento, Cuenta } from "../lib/types";
import Balance from "../components/Balance";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import ModalEditarMovimiento from "../components/ModalEditarMovimiento";
import ModalEliminarMovimiento from "../components/ModalEliminarMovimiento";
import BotonImportarArchivo from "../components/BotonImportarArchivo";
import BotonExportarArchivo from "../components/BotonExportarArchivo";
import BotonAbrirModalAgregarMovimiento from "../components/BotonAbrirModalAgregarMovimiento";
export const API_URL = import.meta.env.VITE_API_URL;

export default function Cuenta() {
  const { id } = useParams<{ id: string }>();
  const [cuenta, setCuenta] = useState<Cuenta>({ id: "", nombre: "" });
  const [seEncontroCuenta, setSeEncontroCuenta] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [movimientosArray, setMovimientosArray] = useState<Movimiento[]>([]);
  const [movimientoEditar, setMovimientoEditar] = useState<Movimiento>();
  const [movimientoEliminar, setMovimientoEliminar] = useState<Movimiento>();

  function eliminarMovimiento(id: string) {
    setMovimientosArray((prev) => prev.filter((m) => m.id !== id));
  }

  useEffect(() => {
    const obtenerCuenta = async () => {
      const respuesta = await fetch(`${API_URL}/cuentas/${id}`);
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
        const respuesta = await fetch(`${API_URL}/cuentas/${id}/movimientos`);
        const datos = await respuesta.json();
        setMovimientosArray(datos);
      } finally {
        setCargando(false);
      }
    };

    obtenerCuenta();
    obtenerMovimientos();
  }, [id]);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarModalEditarMov, setMostrarModalEditarMov] = useState(false);
  const [mostrarModalEliminarMov, setMostrarModalEliminarMov] = useState(false);

  return (
    <>
      {cargando && <Loading />}

      {!seEncontroCuenta && <NotFound />}

      <main className="app-font min-h-screen bg-[#E8EEF0] text-[#1E2B57]">
        <div className="mx-auto flex w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-14 px-6 py-10 sm:py-16">
          <div className="flex flex-col gap-3">
            <Balance cuenta={cuenta} movimientosArray={movimientosArray} />
            <BotonAbrirModalAgregarMovimiento
              setMostrarModalAgregarMovimiento={setModalAbierto}
            />
            <BotonImportarArchivo
              cuentaId={cuenta.id}
              setMovimientosArray={setMovimientosArray}
            />
            <BotonExportarArchivo movimientos={movimientosArray} />
          </div>

          <Movimientos
            cuentaId={cuenta.id}
            setMovimientos={setMovimientosArray}
            onAbrirModalEditarMov={() => setMostrarModalEditarMov(true)}
            onAbrirModalEliminarMov={() => setMostrarModalEliminarMov(true)}
            setMovimientoEliminar={setMovimientoEliminar}
            movimientosArray={movimientosArray}
            setMovimientoEditar={setMovimientoEditar}
          />
        </div>

        <ModalAgregarMovimiento
          cuentaId={cuenta.id}
          abierto={modalAbierto}
          onCerrar={() => setModalAbierto(false)}
          setMovimientosArray={setMovimientosArray}
        />

        {movimientoEditar && (
          <ModalEditarMovimiento
            cuentaId={cuenta.id}
            movimientosArray={movimientosArray}
            movimientoEditar={movimientoEditar}
            abierto={mostrarModalEditarMov}
            onCerrar={() => setMostrarModalEditarMov(false)}
          />
        )}
        {movimientoEliminar && (
          <ModalEliminarMovimiento
            key={movimientoEliminar.id}
            cuentaId={cuenta.id}
            movimiento={movimientoEliminar}
            abierto={mostrarModalEliminarMov}
            onCerrar={() => setMostrarModalEliminarMov(false)}
            onConfirmar={eliminarMovimiento}
          />
        )}
      </main>
    </>
  );
}
