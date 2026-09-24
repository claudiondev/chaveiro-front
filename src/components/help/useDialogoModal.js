import { useEffect, useRef } from 'react'

const SELETOR_FOCAVEL = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

// Comportamento comum aos diálogos modais de ajuda (HelpWelcome, HelpPanel, GuidedTour):
// prende o foco dentro do container, fecha com Escape, restaura o foco só ao fechar (não
// a cada re-render) e trava a rolagem do fundo. `onFechar` pode mudar de identidade a
// cada render sem reabrir o efeito — fica numa ref, então trocar de passo no tour não
// reexecuta a configuração de foco (o bug que fazia a tela "pular" a cada passo).
export function useDialogoModal(containerRef, onFechar) {
  const onFecharRef = useRef(onFechar)
  onFecharRef.current = onFechar

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const overflowAnterior = document.body.style.overflow
    const focoAnterior = document.activeElement
    document.body.style.overflow = 'hidden'

    const primeiroFocavel = container.querySelector(SELETOR_FOCAVEL)
    ;(primeiroFocavel || container).focus({ preventScroll: true })

    function aoTeclar(event) {
      if (event.key === 'Escape') {
        onFecharRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const focaveis = Array.from(container.querySelectorAll(SELETOR_FOCAVEL))
      if (focaveis.length === 0) return
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]

      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault()
        ultimo.focus()
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', aoTeclar)
      focoAnterior?.focus?.({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
