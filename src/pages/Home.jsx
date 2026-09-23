import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, House, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ChaveDoDia from '../components/ChaveDoDia'
import { ErrorState, LoadingState } from '../components/InterfaceState'
import { dataLocalISO, formatarData, formatarMoeda } from '../utils/formatters'
import api from '../services/api'

const PAGAMENTO = { DINHEIRO: 'Dinheiro', PIX: 'PIX', CARTAO_DEBITO: 'Débito', CARTAO_CREDITO: 'Crédito' }

export default function Home() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [caixa, setCaixa] = useState(null)
  const [servicos, setServicos] = useState([])
  const [estado, setEstado] = useState('carregando')
  const [servicoAbertoId, setServicoAbertoId] = useState(null)

  useEffect(() => { carregarDados() }, [])

  async function carregarDados() {
    setEstado('carregando')
    const [resCaixa, resServicos] = await Promise.allSettled([api.get('/caixa/hoje'), api.get(`/servicos?data=${dataLocalISO()}`)])
    const caixaNaoAberto = resCaixa.status === 'rejected' && resCaixa.reason?.response?.data?.erro?.includes('não foi aberto')
    if (resCaixa.status === 'fulfilled') setCaixa(resCaixa.value.data)
    else setCaixa(null)
    if (resServicos.status === 'fulfilled') setServicos(resServicos.value.data)
    setEstado((resCaixa.status === 'fulfilled' || caixaNaoAberto) && resServicos.status === 'fulfilled' ? 'pronto' : 'erro')
  }

  if (estado === 'carregando') return <div className="page-shell"><LoadingState texto="Preparando o balcão" /></div>
  if (estado === 'erro') return <div className="page-shell"><ErrorState mensagem="Não foi possível carregar o movimento de hoje." onRetry={carregarDados} /></div>

  const ordenados = [...servicos].sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
  const recentes = [...ordenados].reverse().slice(0, 7)
  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Equipe'

  return (
    <div className="page-shell"><div className="page-content">
      <header className="flex items-start justify-between gap-4">
        <div><p className="section-label">Chaveiro Abençoado</p><h1 className="mt-1 font-display text-3xl font-extrabold leading-none text-texto lg:text-4xl">Movimento de hoje</h1><p className="mt-2 text-sm text-texto-secundario">{formatarData(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })} · Olá, {primeiroNome}</p></div>
        <button onClick={() => navigate('/servicos/registrar')} className="hidden items-center gap-2 rounded-xl bg-ouro px-4 py-3 font-display font-bold text-marinho sm:flex"><Plus size={18} /> Registrar serviço</button>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <section>
          <StatusCaixa caixa={caixa} onAbrir={() => navigate('/caixa')} />
          <div className="mt-7 flex items-end gap-4"><strong className="font-display text-7xl font-extrabold leading-[0.78] text-texto lg:text-8xl">{caixa?.totalChaves || 0}</strong><span className="pb-1 font-display text-xs font-bold uppercase tracking-[0.18em] text-texto-secundario">chaves<br />cortadas</span></div>
          <div className="mt-8 rounded-2xl bg-marinho-claro/45 px-4 py-5 sm:px-6">
            <ChaveDoDia servicos={ordenados} />
            <p className="mt-3 border-t border-marinho-borda pt-3 text-[11px] leading-relaxed text-texto-terciario">Cada dente representa um dos últimos 24 serviços. A altura acompanha o valor do atendimento; o total de chaves aparece acima.</p>
          </div>
          <div className="mt-5 grid grid-cols-3 divide-x divide-marinho-borda border-y border-marinho-borda py-4">
            <Dado valor={caixa?.totalEntradas} rotulo="Entradas" cor="text-sucesso" />
            <Dado valor={caixa?.totalSaidas} rotulo="Saídas" cor="text-erro" />
            <Dado valor={caixa?.saldoFinal} rotulo="Saldo" cor="text-ouro" />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between border-b border-marinho-borda pb-3"><h2 className="section-label">Últimos atendimentos</h2>{recentes.length > 0 && <span className="text-xs text-texto-secundario">{servicos.length} no dia</span>}</div>
          {recentes.length === 0 ? <div className="py-16 text-center lg:text-left"><p className="text-sm text-texto">O balcão ainda está sem movimento.</p><button onClick={() => navigate('/servicos/registrar')} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ouro">Registrar primeiro serviço <ArrowRight size={15} /></button></div> :
            <div>{recentes.map((servico) => (
              <LinhaServico
                key={servico.id}
                servico={servico}
                aberto={servicoAbertoId === servico.id}
                onToggle={() => setServicoAbertoId((idAtual) => idAtual === servico.id ? null : servico.id)}
              />
            ))}</div>}
        </section>
      </div>
    </div></div>
  )
}

function StatusCaixa({ caixa, onAbrir }) {
  if (!caixa) return <button onClick={onAbrir} className="flex items-center gap-2 rounded-full border border-ouro/40 bg-ouro-fosco px-3 py-1.5 text-xs font-medium text-ouro"><span className="h-2 w-2 rounded-full border border-ouro" /> Caixa não aberto · abrir agora</button>
  const aberto = caixa.status === 'ABERTO'
  return <button onClick={onAbrir} className="flex items-center gap-2 rounded-full border border-marinho-borda px-3 py-1.5 text-xs text-texto-secundario"><span className={`h-2 w-2 rounded-full ${aberto ? 'bg-sucesso' : 'bg-texto-terciario'}`} /> Caixa {aberto ? 'aberto' : 'fechado'}{caixa.valorAbertura > 0 && ` · abertura ${formatarMoeda(caixa.valorAbertura)}`}</button>
}

function Dado({ valor, rotulo, cor }) { return <div className="px-2 first:pl-0 last:pr-0 sm:px-4"><p className={`font-numero text-sm font-semibold sm:text-base ${cor}`}>{formatarMoeda(valor)}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-texto-secundario">{rotulo}</p></div> }

function LinhaServico({ servico, aberto, onToggle }) {
  const hora = new Date(servico.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const observacao = servico.observacao?.trim()
  const idObservacao = `observacao-servico-${servico.id}`

  return (
    <div className="border-b border-white/5">
      <button
        type="button"
        onClick={observacao ? onToggle : undefined}
        aria-expanded={observacao ? aberto : undefined}
        aria-controls={observacao ? idObservacao : undefined}
        className={`grid w-full grid-cols-[42px_1fr_auto] items-center gap-3 py-3.5 text-left ${observacao ? 'group cursor-pointer' : 'cursor-default'}`}
      >
        <span className="font-numero text-[11px] text-texto-terciario">{hora}</span>
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 truncate text-sm text-texto">
            <span className="truncate">{servico.tipoServicoNome}</span>
            {servico.domicilio && <House size={12} aria-label="Atendimento externo" className="text-ouro" />}
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-[10px] text-texto-secundario">
            {PAGAMENTO[servico.formaPagamento] || servico.formaPagamento}
            {servico.quantidade > 1 && ` · ${servico.quantidade} unidades`}
            {servico.statusPagamento === 'PENDENTE' && <span className="text-ouro"> · pagamento pendente</span>}
            {observacao && <span className="text-texto-terciario">· tem observação</span>}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <strong className="font-numero text-sm text-ouro">{formatarMoeda(servico.valorTotal)}</strong>
          {observacao && <ChevronDown size={15} className={`text-texto-terciario transition-transform group-hover:text-ouro ${aberto ? 'rotate-180 text-ouro' : ''}`} />}
        </span>
      </button>

      {observacao && aberto && (
        <div id={idObservacao} className="mb-3 ml-[54px] border-l-2 border-ouro/60 pl-3 pr-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-texto-terciario">Observação do atendimento</p>
          <p className="mt-1 text-xs leading-relaxed text-texto-secundario">{observacao}</p>
        </div>
      )}
    </div>
  )
}
