import { useLocation, useNavigate } from 'react-router-dom'
import { Home, KeyRound, Wallet, MoreHorizontal, Plus } from 'lucide-react'

const tabs = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/servicos', label: 'Serviços', icon: KeyRound },
  { path: '/caixa', label: 'Caixa', icon: Wallet },
  { path: '/menu', label: 'Mais', icon: MoreHorizontal },
]

const ROTA_REGISTRAR = '/servicos/registrar'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(path) {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const mostrarAcao = location.pathname !== ROTA_REGISTRAR

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div
        className="max-w-md mx-auto px-4 flex items-center gap-2.5"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        <nav className="pointer-events-auto flex-1 flex items-center justify-between gap-1 rounded-full border border-marinho-borda bg-marinho-claro/85 backdrop-blur-xl shadow-flutuante p-2">
          {tabs.map((tab) => {
            const active = isActive(tab.path)
            const Icon = tab.icon

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center rounded-full px-3.5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ouro
                  ${active ? 'bg-ouro-fosco text-ouro' : 'text-texto-secundario active:scale-95'}`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} className="flex-shrink-0" />
                <span
                  className={`font-display font-bold text-xs tracking-wide overflow-hidden whitespace-nowrap transition-all duration-300
                    ${active ? 'max-w-[84px] pl-1.5 opacity-100' : 'max-w-0 opacity-0'}`}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </nav>

        {mostrarAcao && (
          <button
            onClick={() => navigate(ROTA_REGISTRAR)}
            aria-label="Registrar novo serviço"
            className="pointer-events-auto flex-shrink-0 w-14 h-14 rounded-full bg-ouro text-marinho flex items-center justify-center shadow-ouro active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ouro focus-visible:ring-offset-2 focus-visible:ring-offset-marinho"
          >
            <Plus size={26} strokeWidth={2.6} />
          </button>
        )}
      </div>
    </div>
  )
}
