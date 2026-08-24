import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    // Captura o evento de instalação do PWA
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Só mostra se o usuário ainda não dispensou
      const dispensado = localStorage.getItem('pwa-dispensado')
      if (!dispensado) setMostrar(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Esconde se já está instalado como PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setMostrar(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstalar() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setMostrar(false)
    }
    setDeferredPrompt(null)
  }

  function handleDispensar() {
    setMostrar(false)
    localStorage.setItem('pwa-dispensado', 'true')
  }

  if (!mostrar) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-marinho-claro border border-ouro rounded-xl p-4 flex items-center gap-3 shadow-lg shadow-black/30">
        <div className="w-10 h-10 rounded-lg bg-ouro-fosco border border-ouro flex items-center justify-center flex-shrink-0">
          <Download size={18} className="text-ouro" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-texto text-sm font-display font-bold">Instalar app</p>
          <p className="text-texto-terciario text-xs font-body">Acesse rápido pela tela inicial</p>
        </div>
        <button
          onClick={handleInstalar}
          className="bg-ouro text-marinho font-display font-bold text-sm px-4 py-2 rounded-lg flex-shrink-0"
        >
          Instalar
        </button>
        <button
          onClick={handleDispensar}
          className="text-texto-terciario p-1 flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
