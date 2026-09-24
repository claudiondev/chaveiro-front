import { CircleHelp } from 'lucide-react'
import { useHelp } from '../../contexts/HelpContext'

export default function HelpButton() {
  const { guiaAtual, abrirAjuda } = useHelp()
  if (!guiaAtual) return null

  return (
    <button type="button" onClick={abrirAjuda} aria-label={`Ajuda sobre ${guiaAtual.titulo}`}
      className="flex h-10 items-center gap-2 rounded-xl border border-marinho-borda px-3 text-sm font-semibold text-texto-secundario hover:border-ouro hover:text-ouro">
      <CircleHelp size={18} /><span className="hidden sm:inline">Ajuda</span>
    </button>
  )
}
