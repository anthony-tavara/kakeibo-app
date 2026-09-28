import { useEffect, useState } from "react";
import type { Cuenta } from "../lib/types";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";

export const API_URL = import.meta.env.VITE_API_URL;

function inicial(nombre: string) {
  return nombre.trim().charAt(0).toUpperCase() || "?";
}

export default function HomePage() {
  const [cargando, setCargando] = useState(true);
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);

  useEffect(() => {
    const obtenerCuentas = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/cuentas`);
        const data = await respuesta.json();
        setCuentas(data);
      } finally {
        setCargando(false);
      }
    };

    obtenerCuentas();
  }, []);

  return (
    <>
      {cargando && <Loading />}

      <section className="mx-auto max-w-5xl px-6 py-14 text-[#1E2B57]">
        <h1 className="text-2xl font-bold tracking-tight">Tus cuentas</h1>
        <p className="mt-1 text-[#1E2B57]/60">
          Elegí una para ver sus movimientos
        </p>

        {cuentas.length === 0 ? (
          <p className="mt-10 text-sm text-[#1E2B57]/60">
            Todavía no creaste ninguna cuenta.
          </p>
        ) : (
          <ul className="mt-10 flex flex-col">
            {cuentas.map((c) => (
              <li
                key={c.id}
                className="border-b border-[#1E2B57]/10 first:border-t"
              >
                <Link
                  to={`/${c.id}`}
                  className="group flex items-center gap-4 py-4 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E2B57]"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1E2B57] text-lg font-medium text-[#F4F6F4] transition group-hover:bg-[#2E3F72]">
                    {inicial(c.nombre)}
                  </span>
                  <span className="flex-1">
                    <span className="block">{c.nombre}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
