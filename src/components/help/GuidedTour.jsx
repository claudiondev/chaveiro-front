import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useDialogoModal } from './useDialogoModal'

export default function GuidedTour({ etapas, etapa, onChange, onClose, onComplete }) {
  const [alvo, setAlvo] = useState(null)
  const cardRef = useRef(null)
  const atual = etapas[etapa]

  useEffect(() => {
    if (!atual) return
    const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const encontrarElemento = () => Array.from(document.querySelectorAll(`[data-tour="${atual.alvo}"]`))
      .find((elemento) => {
        const rect = elemento.getBoundingClientRect()
        return rect.width > 0 && rect.height > 0
      })
    encontrarElemento()?.scrollIntoView({ behavior: semAnimacao ? 'auto' : 'smooth', block: 'center' })
    const atualizar = () => {
      const elemento = encontrarElemento()
      if (!elemento) return setAlvo(null)
      const rect = elemento.getBoundingClientRect()
      setAlvo({ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 })
    }
    const timer = window.setTimeout(atualizar, 220)
    const observer = new MutationObserver(atualizar)
    observer.observe(document.body, { childList: true, subtree: true })
    atualizar()
    window.addEventListener('resize', atualizar)
    window.addEventListener('scroll', atualizar, true)
    return () => { window.clearTimeout(timer); observer.disconnect(); window.removeEventListener('resize', atualizar); window.removeEventListener('scroll', atualizar, true) }
  }, [atual])

  // Foco/Escape/rolagem do fundo: configurado uma vez (o card nunca desmonta entre
  // passos), então trocar de etapa não refoca nem briga com o scrollIntoView acima.
  useDialogoModal(cardRef, onClose)

  if (!atual) return null
  const ultima = etapa === etapas.length - 1
  const cardNoTopo = alvo && alvo.top > window.innerHeight / 2

  return <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={`Passo ${etapa + 1} de ${etapas.length}: ${atual.titulo}`}>
    <div className="absolute inset-0 bg-black/70" />
    {alvo && <div aria-hidden="true" className="fixed z-[91] rounded-2xl border-2 border-ouro shadow-[0_0_0_4px_rgba(245,183,49,0.18)]" style={alvo} />}
    <div ref={cardRef} tabIndex="-1" className={`fixed left-4 right-4 z-[92] mx-auto max-w-md rounded-2xl border border-ouro/40 bg-marinho-claro p-5 shadow-flutuante ${cardNoTopo ? 'top-5' : 'bottom-5'}`}>
      <div className="flex items-start gap-4"><div className="flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ouro">Passo {etapa + 1} de {etapas.length}</p><h2 className="mt-1 font-display text-2xl font-bold text-texto">{atual.titulo}</h2></div><button type="button" onClick={onClose} aria-label="Sair do passo a passo" className="text-texto-secundario hover:text-texto"><X size={20} /></button></div>
      <p className="mt-3 text-sm leading-relaxed text-texto-secundario">{atual.texto}</p>
      {!alvo && <p className="mt-3 rounded-lg bg-marinho px-3 py-2 text-xs text-texto-secundario">Esta opção não está disponível no estado atual da tela.</p>}
      <div className="mt-5 flex items-center justify-between gap-3"><button type="button" onClick={() => onChange(etapa - 1)} disabled={etapa === 0} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-texto disabled:opacity-30">Voltar</button><button type="button" onClick={ultima ? onComplete : () => onChange(etapa + 1)} className="rounded-xl bg-ouro px-5 py-2.5 text-sm font-bold text-marinho">{ultima ? 'Concluir' : 'Próximo'}</button></div>
    </div>
  </div>
}
