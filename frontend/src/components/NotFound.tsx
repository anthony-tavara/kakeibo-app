import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className=" bg-[#E8EEF0] flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-[#1E2B57]">
      <p className="text-sm font-medium tracking-widest text-[#1E2B57]/50">
        ERROR 404
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        No encontramos esta página
      </h1>
      <p className="max-w-sm text-[#1E2B57]/70">
        La cuenta o la ruta que buscás no existe, o cambió de lugar.
      </p>
      <Link
        to="/1"
        className="mt-4 rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
