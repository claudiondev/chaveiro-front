import { useEffect, useRef } from 'react'
import { ArrowRight, CircleHelp, X } from 'lucide-react'

export default function HelpPanel({ guia, onClose, onStart }) {
  const fecharRef = useRef(null)

  useEffect(() => {
    const focoAnterior = document.activeElement
    fecharRef.current?.focus()
    const fecharComEscape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', fecharComEscape)
    return () => { window.removeEventListener('keydown', fecharComEscape); focoAnterior?.focus?.() }
  }, [onClose])

  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/65 sm:items-stretch sm:justify-end" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section role="dialog" aria-modal="true" aria-labelledby="help-title" className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border border-marinho-borda bg-marinho-claro p-5 shadow-flutuante sm:h-full sm:max-h-none sm:max-w-md sm:rounded-none sm:border-y-0 sm:border-r-0 sm:p-7">
      <div className="flex items-start gap-3"><span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ouro-fosco text-ouro"><CircleHelp size={20} /></span><div className="min-w-0 flex-1"><p className="section-label">Ajuda nesta tela</p><h2 id="help-title" className="mt-1 font-display text-2xl font-bold text-texto">{guia.titulo}</h2></div><button ref={fecharRef} type="button" onClick={onClose} aria-label="Fechar ajuda" className="flex h-10 w-10 items-center justify-center rounded-xl text-texto-secundario hover:bg-marinho hover:text-texto"><X size={20} /></button></div>
      <p className="mt-5 text-sm leading-relaxed text-texto-secundario">{guia.resumo}</p>
      <button type="button" onClick={onStart} className="mt-6 flex w-full items-center justify-between rounded-xl bg-ouro px-4 py-3.5 font-display font-bold text-marinho shadow-ouro">Mostrar passo a passo <ArrowRight size={18} /></button>
      <div className="mt-8"><h3 className="section-label">Dúvidas rápidas</h3><div className="mt-3 divide-y divide-white/5 border-y border-marinho-borda">{guia.dicas.map((dica) => <details key={dica.pergunta} className="group py-4"><summary className="cursor-pointer list-none pr-5 text-sm font-semibold text-texto marker:hidden">{dica.pergunta}</summary><p className="mt-2 pr-4 text-sm leading-relaxed text-texto-secundario">{dica.resposta}</p></details>)}</div></div>
    </section>
  </div>
}
