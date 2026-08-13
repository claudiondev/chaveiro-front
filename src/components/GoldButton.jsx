export default function GoldButton({ children, onClick, tipo = 'button', pequeno = false, className = '', desabilitado = false }) {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={desabilitado}
      className={`w-full bg-ouro text-marinho font-display font-bold rounded-xl
        active:scale-[0.98] active:bg-ouro-escuro
        disabled:opacity-50 disabled:cursor-not-allowed
        ${pequeno ? 'text-sm py-2.5 px-4' : 'text-base py-4 px-6'}
        ${className}`}
    >
      {children}
    </button>
  )
}
