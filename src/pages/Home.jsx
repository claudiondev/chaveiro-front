import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Wallet, ListChecks, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import KeyCounter from '../components/KeyCounter'
import TeethLine from '../components/TeethLine'
import api from '../services/api'

export default function Home() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [caixa, setCaixa] = useState(null)
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)

  const hoje = new Date()
  const saudacao = hoje.getHours() < 12 ? 'Bom dia' : hoje.getHours() < 18 ? 'Boa tarde' : 'Boa noite'
  const dataFormatada = hoje.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const dataHoje = hoje.toISOString().split('T')[0]

      const [resCaixa, resServicos] = await Promise.allSettled([
        api.get('/caixa/hoje'),
        api.get(`/servicos?data=${dataHoje}`),
      ])

      if (resCaixa.status === 'fulfilled') setCaixa(resCaixa.value.data)
      if (resServicos.status === 'fulfilled') setServicos(resServicos.value.data)
    } catch (err) {
      // Silencia erros na home
    } finally {
      setCarregando(false)
    }
  }

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Usuário'
  const totalChaves = caixa?.totalChaves || 0
  const totalEntradas = caixa?.totalEntradas || 0
  const totalSaidas = caixa?.totalSaidas || 0
  const saldoFinal = caixa?.saldoFinal || 0

  const acoes = [
    { label: 'Novo serviço', sub: 'registrar agora', icon: Plus, path: '/servicos/registrar', destaque: true },
    { label: 'Caixa', sub: caixa ? `R$ ${saldoFinal.toFixed(0)}` : 'ver status', icon: Wallet, path: '/caixa' },
    { label: 'Preços', sub: 'tabela completa', icon: ListChecks, path: '/servicos' },
    { label: 'Relatórios', sub: 'dono', icon: BarChart3, path: '/relatorios' },
  ]

  if (carregando) {
    return (
      <div className="min-h-screen bg-marinho flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marinho pb-24">
      {/* Header */}
      <div className="px-5 pt-6 flex justify-between items-start">
        <div>
          <p className="text-texto-secundario text-sm font-body">{saudacao},</p>
          <h1 className="font-display font-extrabold text-2xl text-texto tracking-tight mt-0.5">
            {primeiroNome.toUpperCase()}
          </h1>
          <p className="text-texto-terciario text-xs font-body mt-0.5">{dataFormatada}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-ouro-fosco border border-ouro flex items-center justify-center">
          <span className="text-ouro text-lg">🔑</span>
        </div>
      </div>

      {/* Contador de chaves */}
      <div className="px-5 mt-5">
        <KeyCounter
          totalChaves={totalChaves}
          entradas={totalEntradas}
          saidas={totalSaidas}
          saldo={saldoFinal}
        />
      </div>

      {/* Grid de ações */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-2.5">
        {acoes.map((acao) => {
          const Icon = acao.icon
          return (
            <button
              key={acao.path}
              onClick={() => navigate(acao.path)}
              className={`text-left rounded-xl p-3.5 border
                ${acao.destaque
                  ? 'border-ouro bg-ouro-fosco'
                  : 'border-marinho-borda bg-marinho-claro'
                }
                active:scale-[0.97]`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2
                ${acao.destaque ? 'bg-ouro/15 text-ouro' : 'bg-white/5 text-texto-secundario'}`}
              >
                <Icon size={16} />
              </div>
              <p className={`font-display font-bold text-sm
                ${acao.destaque ? 'text-ouro' : 'text-texto'}`}
              >
                {acao.label}
              </p>
              <p className="text-texto-terciario text-[10px] font-body mt-0.5">{acao.sub}</p>
            </button>
          )
        })}
      </div>

      {/* Divisor dentes de chave */}
      <div className="px-5 mt-3">
        <TeethLine />
      </div>

      {/* Atividade recente */}
      <div className="px-5">
        <h2 className="font-display font-bold text-xs text-texto-secundario tracking-wider mb-3">
          ATIVIDADE RECENTE
        </h2>

        {servicos.length === 0 ? (
          <p className="text-texto-terciario text-sm font-body text-center py-6">
            Nenhum serviço registrado hoje
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {servicos.slice(0, 5).map((servico) => (
              <div
                key={servico.id}
                className="flex items-center gap-3 py-2.5 border-b border-white/5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sucesso flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium font-body text-texto truncate">
                    {servico.tipoServicoNome}
                  </p>
                  <p className="text-[10px] text-texto-terciario font-body">
                    {new Date(servico.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    {' · '}
                    {servico.formaPagamento.replace('_', ' ')}
                  </p>
                </div>
                <p className="font-numero font-bold text-sm text-ouro flex-shrink-0">
                  +R$ {servico.valorTotal?.toFixed(0) || '0'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
