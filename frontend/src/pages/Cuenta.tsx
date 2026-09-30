import { useEffect, useRef, useState } from "react";
import Movimientos from "../components/Movimientos";
import ModalAgregarMovimiento from "../components/ModalAgregarMovimiento";
import type { Movimiento, Cuenta, NuevoMovimiento } from "../lib/types";
import Balance from "../components/Balance";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
import ModalEditarMovimiento from "../components/ModalEditarMovimiento";
import ModalEliminarMovimiento from "../components/ModalEliminarMovimiento";
import BotonAbrirModalAgregarMovimiento from "../components/BotonAbrirModalAgregarMovimiento";
import OpcionesCuentaDropdown from "../components/OpcionesCuentaDropdown";
import { importarArchivo } from "../lib/importarArchivos";
import { toast } from "sonner";
import { exportarJson, exportarCsv } from "../lib/exportarArchivos";
import ModalVisualizarMovimientos from "../components/ModalVisualizarMovimientos";
import { guardarMovimiento } from "../lib/movimientos";
export const API_URL = import.meta.env.VITE_API_URL;

export default function Cuenta() {
  const inputRef = useRef<HTMLInputElement>(null);

  function abrirSelector() {
    inputRef.current?.click();
  }

  const [guardando, setGuardando] = useState(false);
  const [modalImportarMovimientos, setModalImportarMovimientos] =
    useState(false);

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

  const [nuevosMovimientos, setNuevosMovimientos] =
    useState<NuevoMovimiento[]>();

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { validos, cantidadInvalidos } = await importarArchivo(file);

      if (cantidadInvalidos > 0) {
        toast.warning(
          `${cantidadInvalidos} movimiento(s) inválido(s) fueron ignorados.`,
        );
      }

      if (validos.length === 0) {
        toast.error("Ningún movimiento del archivo es válido.");
        return;
      }

      setNuevosMovimientos(validos);
      setModalImportarMovimientos(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al importar el archivo.",
      );
    } finally {
      e.target.value = "";
    }
  }

  async function handleConfirmar() {
    if (!nuevosMovimientos) return;
    setGuardando(true);
    try {
      const movimientos: Movimiento[] = [];
      for (const m of nuevosMovimientos)
        movimientos.push(await guardarMovimiento(cuenta.id, m));

      setMovimientosArray((prev) => [...prev, ...movimientos]);
      toast.success("Se agregaron los movimientos correctamente.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al guardar movimiento.",
      );
    } finally {
      setGuardando(false);
      setModalImportarMovimientos(false);
    }
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
        <div className="mx-auto flex w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 px-6 py-10 sm:py-16">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <h1 className="text-sm md:text-lg font-semibold text-[#1E2B57]/70">
                {cuenta.nombre}
              </h1>
              <OpcionesCuentaDropdown
                onImportar={abrirSelector}
                onExportarCSV={() =>
                  exportarCsv(movimientosArray, "movimientos")
                }
                onExportarJSON={() =>
                  exportarJson(movimientosArray, "movimientos")
                }
              />
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleArchivo}
                className="hidden"
                id="import-file"
              />
            </div>
            <Balance movimientosArray={movimientosArray} />
            <BotonAbrirModalAgregarMovimiento
              setMostrarModalAgregarMovimiento={setModalAbierto}
            />
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

        {nuevosMovimientos && (
          <ModalVisualizarMovimientos
            abierto={modalImportarMovimientos}
            guardando={guardando}
            movimientos={nuevosMovimientos}
            onCerrar={() => setModalImportarMovimientos(false)}
            onConfirmar={handleConfirmar}
          />
        )}
      </main>
    </>
  );
}
