import { useRef } from 'react'
import { CircleHelp, Sparkles } from 'lucide-react'
import { useDialogoModal } from './useDialogoModal'

export default function HelpWelcome({ onStart, onDismiss }) {
  const dialogoRef = useRef(null)
  useDialogoModal(dialogoRef, onDismiss)

  return <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 p-5">
    <section ref={dialogoRef} tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="welcome-help-title" className="w-full max-w-md rounded-3xl border border-marinho-borda bg-marinho-claro p-6 shadow-flutuante sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ouro-fosco text-ouro"><Sparkles size={23} /></div>
      <p className="section-label mt-6">Primeiro acesso</p>
      <h2 id="welcome-help-title" className="mt-2 font-display text-3xl font-bold leading-tight text-texto">Conheça o balcão de trabalho</h2>
      <p className="mt-3 text-sm leading-relaxed text-texto-secundario">Um guia rápido mostra onde encontrar cada função. Ele não registra nem altera nada enquanto você aprende.</p>
      <div className="mt-6 flex items-center gap-2 rounded-xl bg-marinho px-4 py-3 text-xs text-texto-secundario"><CircleHelp size={17} className="flex-shrink-0 text-ouro" /> Depois, use “Ajuda” no canto superior para consultar novamente.</div>
      <div className="mt-7 flex flex-col gap-2 sm:flex-row-reverse"><button type="button" onClick={onStart} className="rounded-xl bg-ouro px-5 py-3 font-display font-bold text-marinho sm:flex-1">Conhecer agora</button><button type="button" onClick={onDismiss} className="rounded-xl px-5 py-3 text-sm font-semibold text-texto-secundario sm:flex-1">Agora não</button></div>
    </section>
  </div>
}
