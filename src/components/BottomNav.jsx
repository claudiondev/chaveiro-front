import { useLocation, useNavigate } from 'react-router-dom'
import { Home, KeyRound, Wallet, MoreHorizontal } from 'lucide-react'

const tabs = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/servicos', label: 'Serviços', icon: KeyRound },
  { path: '/caixa', label: 'Caixa', icon: Wallet },
  { path: '/menu', label: 'Mais', icon: MoreHorizontal },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(path) {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-marinho/95 backdrop-blur-sm border-t border-marinho-borda z-50">
      <div className="max-w-md mx-auto flex">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const Icon = tab.icon

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 pb-6
                ${active ? 'text-ouro' : 'text-texto-secundario'}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[10px] font-body ${active ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
