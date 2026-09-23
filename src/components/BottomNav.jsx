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
    <>
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-marinho-borda bg-marinho/95 px-5 py-7 lg:flex lg:flex-col">
      <button onClick={() => navigate('/')} className="flex items-center gap-3 text-left">
        <img src="/logo.png" alt="" className="h-11 w-11 object-contain" />
        <span>
          <strong className="block font-display text-lg leading-none text-texto">CHAVEIRO</strong>
          <span className="font-display text-sm font-semibold tracking-[0.18em] text-ouro">ABENÇOADO</span>
        </span>
      </button>

      <nav aria-label="Navegação principal" className="mt-10 space-y-1.5">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const Icon = tab.icon
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} aria-current={active ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${active ? 'bg-ouro-fosco text-ouro' : 'text-texto-secundario hover:bg-marinho-claro hover:text-texto'}`}>
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {mostrarAcao && (
        <button onClick={() => navigate(ROTA_REGISTRAR)} className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-ouro px-4 py-3.5 font-display font-bold text-marinho shadow-ouro active:scale-[0.98]">
          <Plus size={19} /> Registrar serviço
        </button>
      )}
    </aside>

    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none lg:hidden">
      <div
        className="max-w-md mx-auto px-4 flex items-center gap-2.5"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        <nav aria-label="Navegação principal" className="pointer-events-auto flex-1 flex items-center justify-between gap-1 rounded-2xl border border-marinho-borda bg-marinho-claro/95 backdrop-blur-xl shadow-flutuante p-1.5">
          {tabs.map((tab) => {
            const active = isActive(tab.path)
            const Icon = tab.icon

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2
                  ${active ? 'bg-ouro-fosco text-ouro' : 'text-texto-secundario active:scale-95'}`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} className="flex-shrink-0" />
                <span className="font-display text-[10px] font-bold leading-none tracking-wide">{tab.label}</span>
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
    </>
  )
}
