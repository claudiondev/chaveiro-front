import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListChecks, UserPlus, BarChart3, Settings, ClipboardList, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import GoldButton from '../components/GoldButton'
import api from '../services/api'

export default function Menu() {
  const { usuario, isDono, logout } = useAuth()
  const navigate = useNavigate()

  // Modal cadastro funcionário
  const [modalCadastro, setModalCadastro] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const itensMenu = [
    { icon: ListChecks, label: 'Tipos de serviço', sub: 'Tabela de preços', path: '/servicos' },
    ...(isDono() ? [{ icon: UserPlus, label: 'Cadastrar funcionário', sub: 'Novo acesso', action: () => setModalCadastro(true) }] : []),
    ...(isDono() ? [{ icon: BarChart3, label: 'Relatórios', sub: 'Acesso restrito', path: '/relatorios' }] : []),
  ]

  async function handleCadastro(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      await api.post('/auth/cadastro', { nome, email, senha })
      setSucesso(`${nome} cadastrado com sucesso!`)
      setNome('')
      setEmail('')
      setSenha('')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar')
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-marinho pb-24">
      <div className="px-5 pt-6">
        <h1 className="font-display font-bold text-xl text-texto mb-4">MAIS</h1>

        {/* Card do perfil */}
        <Card className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-ouro-fosco border border-ouro flex items-center justify-center text-2xl flex-shrink-0">
            👨‍🔧
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-base text-texto">{usuario?.nome}</p>
            <p className="text-texto-secundario text-xs font-body truncate">{usuario?.email}</p>
            <span className="inline-block mt-1.5 bg-ouro-fosco border border-ouro rounded-md px-2 py-0.5">
              <span className="text-ouro text-[10px] font-display font-bold">{usuario?.role}</span>
            </span>
          </div>
        </Card>

        {/* Itens do menu */}
        <div className="flex flex-col gap-2">
          {itensMenu.map((item) => {
            const Icon = item.icon
            return (
              <Card
                key={item.label}
                onClick={() => item.path ? navigate(item.path) : item.action?.()}
                className="flex items-center gap-3.5 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-marinho border border-marinho-borda
                  flex items-center justify-center text-texto-secundario flex-shrink-0"
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium font-body text-texto">{item.label}</p>
                  <p className="text-xs text-texto-secundario font-body mt-0.5">{item.sub}</p>
                </div>
                <span className="text-texto-terciario text-lg">›</span>
              </Card>
            )
          })}

          {/* Link para fechamento */}
          {isDono() && (
            <Card
              destaque
              onClick={() => navigate('/fechamento')}
              className="flex items-center gap-3.5 cursor-pointer mt-1"
            >
              <div className="w-11 h-11 rounded-xl bg-ouro-fosco border border-ouro
                flex items-center justify-center text-ouro flex-shrink-0"
              >
                <ClipboardList size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold font-body text-ouro">Fechamento do dia</p>
                <p className="text-xs text-texto-secundario font-body mt-0.5">Encerrar caixa</p>
              </div>
              <span className="text-ouro text-lg">›</span>
            </Card>
          )}
        </div>

        {/* Modal cadastro funcionário */}
        {modalCadastro && (
          <Card className="mt-4">
            <h2 className="font-display font-bold text-base text-texto mb-3">CADASTRAR FUNCIONÁRIO</h2>
            <form onSubmit={handleCadastro} className="flex flex-col gap-2.5">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                required
                className="w-full bg-marinho border-2 border-marinho-borda rounded-xl px-4 py-3
                  text-texto font-body text-sm focus:border-ouro placeholder:text-texto-terciario"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                className="w-full bg-marinho border-2 border-marinho-borda rounded-xl px-4 py-3
                  text-texto font-body text-sm focus:border-ouro placeholder:text-texto-terciario"
              />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha (mín. 8 caracteres)"
                required
                className="w-full bg-marinho border-2 border-marinho-borda rounded-xl px-4 py-3
                  text-texto font-body text-sm focus:border-ouro placeholder:text-texto-terciario"
              />

              {erro && <p className="text-erro text-sm font-body">{erro}</p>}
              {sucesso && <p className="text-sucesso text-sm font-body">{sucesso}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setModalCadastro(false); setErro(''); setSucesso('') }}
                  className="flex-1 py-3 rounded-xl border border-marinho-borda text-texto-secundario font-display font-bold text-sm"
                >
                  Cancelar
                </button>
                <div className="flex-1">
                  <GoldButton tipo="submit" pequeno>Cadastrar</GoldButton>
                </div>
              </div>
            </form>
          </Card>
        )}

        {/* Botão sair */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-3.5 rounded-xl border border-erro text-erro font-display font-semibold text-sm
            flex items-center justify-center gap-2 active:bg-erro/10"
        >
          <LogOut size={16} /> Sair da conta
        </button>
      </div>
    </div>
  )
}
