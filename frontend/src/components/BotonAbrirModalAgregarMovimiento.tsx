type Props = {
  setMostrarModalAgregarMovimiento: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function BotonAbrirModalAgregarMovimiento({
  setMostrarModalAgregarMovimiento,
}: Props) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => setMostrarModalAgregarMovimiento(true)}
      className="cursor-pointer rounded-lg bg-[#1E2B57] px-5 py-3.5 font-medium text-[#F4F6F4] transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E2B57]"
    >
      Agregar Movimiento
    </button>
  );
}
