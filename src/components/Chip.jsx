export default function Chip({ label, ativo = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap flex-shrink-0
        ${ativo
          ? 'bg-ouro text-marinho font-semibold border border-ouro'
          : 'bg-marinho-claro text-texto-secundario border border-marinho-borda'
        }`}
    >
      {label}
    </button>
  )
}
