import { CircleHelp, X } from 'lucide-react'

export default function HelpNudge({ guia, onStart, onDismiss }) {
  return <aside className="fixed right-4 top-4 z-[70] w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-ouro/35 bg-marinho-claro p-4 shadow-flutuante" aria-label={`Conhecer ${guia.titulo}`}>
    <div className="flex items-start gap-3"><CircleHelp size={20} className="mt-0.5 flex-shrink-0 text-ouro" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-texto">Conhecer esta tela?</p><p className="mt-1 text-xs leading-relaxed text-texto-secundario">Veja em poucos passos como usar {guia.titulo.toLowerCase()}.</p></div><button type="button" onClick={onDismiss} aria-label="Não mostrar este guia novamente" className="text-texto-terciario hover:text-texto"><X size={18} /></button></div>
    <button type="button" onClick={onStart} className="mt-3 text-sm font-bold text-ouro">Mostrar passo a passo</button>
  </aside>
}
