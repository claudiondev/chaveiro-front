import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/InterfaceState'
import { dataLocalISO, formatarMoeda } from '../utils/formatters'
import api from '../services/api'

const PERIODOS = ['diario', 'semanal', 'mensal']
const LABELS = { diario: 'Hoje', semanal: 'Semana', mensal: 'Mês', DINHEIRO: 'Dinheiro', PIX: 'PIX', CARTAO_DEBITO: 'Débito', CARTAO_CREDITO: 'Crédito' }

export default function Relatorios() {
  const navigate = useNavigate()
  const [periodo, setPeriodo] = useState('diario')
  const [dados, setDados] = useState(null)
  const [estado, setEstado] = useState('carregando')
  useEffect(() => { carregar() }, [periodo])

  async function carregar() {
    setEstado('carregando')
    try {
      const agora = new Date()
      const url = periodo === 'diario' ? `/relatorios/diario?data=${dataLocalISO(agora)}` : periodo === 'semanal' ? '/relatorios/semanal' : `/relatorios/mensal?mes=${agora.getMonth() + 1}&ano=${agora.getFullYear()}`
      const response = await api.get(url); setDados(response.data); setEstado('pronto')
    } catch { setDados(null); setEstado('erro') }
  }

  const pagamentos = Object.entries(dados?.entradasPorFormaPagamento || {}).map(([nome, valor]) => ({ nome: LABELS[nome] || nome, valor }))
  const saidas = Object.entries(dados?.saidasPorCategoria || {}).filter(([, valor]) => valor > 0).map(([nome, valor]) => ({ nome: nome.charAt(0) + nome.slice(1).toLowerCase(), valor }))

  return <div className="page-shell"><div className="page-content">
    <PageHeader titulo="Relatórios" subtitulo="Compare o movimento por forma de pagamento e categoria." onBack={() => navigate('/menu')} acao={<span className="hidden rounded-full bg-ouro-fosco px-3 py-1.5 text-[10px] font-bold tracking-wider text-ouro sm:block">ACESSO DO DONO</span>} />
    <div className="mt-7 inline-flex rounded-xl bg-marinho-claro p-1">{PERIODOS.map((item) => <button key={item} onClick={() => setPeriodo(item)} aria-pressed={periodo === item} className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${periodo === item ? 'bg-ouro text-marinho' : 'text-texto-secundario'}`}>{LABELS[item]}</button>)}</div>
    {estado === 'carregando' && <LoadingState texto="Montando relatório" />}
    {estado === 'erro' && <ErrorState mensagem="Não foi possível carregar o relatório deste período." onRetry={carregar} />}
    {estado === 'pronto' && <div className="mt-8">
      <section className="grid gap-5 border-y border-marinho-borda py-6 sm:grid-cols-3"><Indicador label="Faturamento" valor={formatarMoeda(dados?.totalEntradas)} destaque /><Indicador label="Serviços" valor={dados?.totalServicos || 0} /><Indicador label="Chaves" valor={dados?.totalChaves || 0} /></section>
      <div className="mt-9 grid gap-10 lg:grid-cols-2"><Barras titulo="Entradas por pagamento" itens={pagamentos} cor="bg-ouro" vazio="Nenhuma entrada neste período." /><Barras titulo="Saídas por categoria" itens={saidas} cor="bg-erro" vazio="Nenhuma saída neste período." total={dados?.totalSaidas} /></div>
    </div>}
  </div></div>
}

function Indicador({ label, valor, destaque }) { return <div><p className="section-label">{label}</p><p className={`mt-2 font-numero text-3xl font-bold ${destaque ? 'text-ouro' : 'text-texto'}`}>{valor}</p></div> }
function Barras({ titulo, itens, cor, vazio, total }) {
  const maior = Math.max(...itens.map((item) => Number(item.valor) || 0), 1)
  return <section><div className="flex items-center justify-between border-b border-marinho-borda pb-3"><h2 className="section-label">{titulo}</h2>{total != null && <span className="font-numero text-xs text-erro">{formatarMoeda(total)}</span>}</div>{itens.length === 0 ? <p className="py-10 text-sm text-texto-secundario">{vazio}</p> : <div className="mt-5 space-y-5">{itens.map((item) => <div key={item.nome}><div className="mb-2 flex justify-between gap-4 text-sm"><span className="text-texto-secundario">{item.nome}</span><strong className="font-numero text-texto">{formatarMoeda(item.valor)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-marinho-claro"><div className={`h-full rounded-full ${cor}`} style={{ width: `${Math.max((item.valor / maior) * 100, 2)}%` }} /></div></div>)}</div>}</section>
}
