export default function Card({ children, className = '', destaque = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-marinho-claro border rounded-card p-4
        ${destaque ? 'border-ouro' : 'border-marinho-borda'}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}
