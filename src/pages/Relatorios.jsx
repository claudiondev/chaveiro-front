import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, KeyRound } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/InterfaceState'
import { dataDeISO, dataLocalISO, formatarData, formatarMoeda } from '../utils/formatters'
import api from '../services/api'

const PERIODOS = ['diario', 'semanal', 'mensal']
const LABELS = {
  diario: 'Dia', semanal: 'Semana', mensal: 'Mês',
  DINHEIRO: 'Dinheiro', PIX: 'PIX', CARTAO_DEBITO: 'Débito', CARTAO_CREDITO: 'Crédito', AVULSA: 'Avulsa',
  ALIMENTACAO: 'Alimentação', FORNECEDOR: 'Fornecedor', TAXAS: 'Taxas', OUTROS: 'Outros',
}
const TOP_SERVICOS = 5

export default function Relatorios() {
  const navigate = useNavigate()
  const [periodo, setPeriodo] = useState('diario')
  const [referencia, setReferencia] = useState(() => new Date())
  const [dados, setDados] = useState(null)
  const [estado, setEstado] = useState('carregando')
  // Descarta respostas de navegações anteriores
  const requisicaoAtual = useRef(0)

  useEffect(() => { carregar() }, [periodo, referencia])

  async function carregar() {
    const id = ++requisicaoAtual.current
    setEstado('carregando')
    try {
      const response = await api.get(`/relatorios/${periodo}`, { params: parametros(periodo, referencia) })
      if (id !== requisicaoAtual.current) return
      setDados(response.data)
      setEstado('pronto')
    } catch {
      if (id !== requisicaoAtual.current) return
      setDados(null)
      setEstado('erro')
    }
  }

  function trocarPeriodo(novo) {
    setPeriodo(novo)
    setReferencia(new Date())
  }

  const noPeriodoAtual = contemHoje(periodo, referencia)
  const semMovimento = dados && !dados.totalServicos && !Number(dados.totalEntradas) && !Number(dados.totalSaidas)

  return <div className="page-shell"><div className="page-content">
    <PageHeader titulo="Relatórios" subtitulo="Movimento do caixa, serviços e equipe por período." onBack={() => navigate('/menu')} acao={<span className="hidden rounded-full bg-ouro-fosco px-3 py-1.5 text-[10px] font-bold tracking-wider text-ouro sm:block">ACESSO DO DONO</span>} />

    <div data-tour="relatorios-periodo" className="mt-7 flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-xl bg-marinho-claro p-1">{PERIODOS.map((item) => <button key={item} type="button" onClick={() => trocarPeriodo(item)} aria-pressed={periodo === item} className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${periodo === item ? 'bg-ouro text-marinho' : 'text-texto-secundario'}`}>{LABELS[item]}</button>)}</div>
      <div className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-marinho-borda px-1.5 py-1 sm:flex-none">
        <button type="button" onClick={() => setReferencia(deslocar(periodo, referencia, -1))} aria-label="Período anterior" className="flex h-9 w-9 items-center justify-center rounded-lg text-texto hover:bg-marinho-claro"><ChevronLeft size={18} /></button>
        <span className="min-w-[10rem] text-center text-sm font-semibold text-texto">{rotuloPeriodo(periodo, referencia)}</span>
        <button type="button" onClick={() => setReferencia(deslocar(periodo, referencia, 1))} disabled={noPeriodoAtual} aria-label="Próximo período" className="flex h-9 w-9 items-center justify-center rounded-lg text-texto hover:bg-marinho-claro disabled:opacity-30 disabled:hover:bg-transparent"><ChevronRight size={18} /></button>
      </div>
      {!noPeriodoAtual && <button type="button" onClick={() => setReferencia(new Date())} className="text-sm font-semibold text-ouro">Voltar para o atual</button>}
    </div>

    {estado === 'carregando' && <LoadingState texto="Montando relatório" />}
    {estado === 'erro' && <ErrorState mensagem="Não foi possível carregar o relatório deste período." onRetry={carregar} />}
    {estado === 'pronto' && semMovimento && <div className="mt-8 flex min-h-[35vh] flex-col items-center justify-center rounded-2xl border border-dashed border-marinho-borda px-6 text-center">
      <p className="font-semibold text-texto">Sem movimento neste período</p>
      <p className="mt-1 max-w-sm text-sm text-texto-secundario">Nenhum caixa com serviços ou movimentações. Use as setas para ver outro período.</p>
    </div>}
    {estado === 'pronto' && !semMovimento && <Conteudo dados={dados} periodo={periodo} />}
  </div></div>
}

function Conteudo({ dados, periodo }) {
  const totalEntradas = Number(dados.totalEntradas) || 0
  const pagamentos = ordenar(dados.entradasPorFormaPagamento).map(([chave, valor]) => ({ nome: LABELS[chave] || chave, valor, percentual: totalEntradas ? (valor / totalEntradas) * 100 : 0 }))
  const saidas = ordenar(dados.saidasPorCategoria).map(([chave, valor]) => ({ nome: LABELS[chave] || chave, valor }))
  const resultado = Number(dados.saldoTotal) || 0

  return <div className="mt-8">
    <section data-tour="relatorios-indicadores" className="grid grid-cols-2 gap-x-5 gap-y-6 border-y border-marinho-borda py-6 sm:grid-cols-3">
      <Indicador label="Entradas" valor={formatarMoeda(dados.totalEntradas)} cor="text-ouro" detalhe="dinheiro que entrou no caixa" />
      <Indicador label="Saídas" valor={formatarMoeda(dados.totalSaidas)} cor="text-erro" />
      <Indicador label="Resultado" valor={formatarMoeda(resultado)} cor={resultado < 0 ? 'text-erro' : 'text-sucesso'} />
      <Indicador label="Serviços" valor={dados.totalServicos || 0} detalhe={dados.totalGarantias ? `${dados.totalGarantias} ${dados.totalGarantias === 1 ? 'garantia' : 'garantias'}` : null} />
      <Indicador label="Chaves" valor={dados.totalChaves || 0} />
      <Indicador label="Fiado a receber" valor={formatarMoeda(dados.totalPendente)} detalhe="gerado no período" />
    </section>

    {periodo !== 'diario' && <Evolucao dias={dados.porDia || []} periodo={periodo} />}

    <div data-tour="relatorios-detalhes" className="mt-10 grid gap-10 lg:grid-cols-2">
      <Barras titulo="Entradas por pagamento" itens={pagamentos} cor="bg-ouro" vazio="Nenhuma entrada neste período." />
      <Barras titulo="Saídas por categoria" itens={saidas} cor="bg-erro" vazio="Nenhuma saída neste período." total={dados.totalSaidas} />
    </div>

    <div className="mt-10 grid gap-10 lg:grid-cols-2">
      <TopServicos servicos={dados.servicosPorTipo || []} />
      <Equipe funcionarios={dados.porFuncionario || []} />
    </div>
  </div>
}

function Indicador({ label, valor, cor = 'text-texto', detalhe }) {
  return <div className="min-w-0"><p className="section-label">{label}</p><p className={`mt-2 truncate font-numero text-2xl font-bold xl:text-3xl ${cor}`}>{valor}</p>{detalhe && <p className="mt-1 text-xs text-texto-secundario">{detalhe}</p>}</div>
}

function Evolucao({ dias, periodo }) {
  const hoje = dataLocalISO()
  const maior = Math.max(...dias.map((d) => Number(d.entradas) || 0), 1)
  const melhor = dias.reduce((a, b) => (Number(b.entradas) > Number(a?.entradas || 0) ? b : a), null)
  return <section className="mt-10">
    <div className="flex items-baseline justify-between gap-4 border-b border-marinho-borda pb-3">
      <h2 className="section-label">Entradas por dia</h2>
      {melhor && Number(melhor.entradas) > 0 && <span className="text-xs text-texto-secundario">Melhor dia: <strong className="font-numero text-texto">{formatarData(dataDeISO(melhor.data), { day: '2-digit', month: '2-digit' })}</strong> · {formatarMoeda(melhor.entradas)}</span>}
    </div>
    <div className={`mt-5 flex h-44 items-end ${periodo === 'mensal' ? 'gap-[3px] sm:gap-1.5' : 'gap-2 sm:gap-4'}`}>
      {dias.map((dia) => {
        const valor = Number(dia.entradas) || 0
        const futuro = dia.data > hoje
        const data = dataDeISO(dia.data)
        const descricao = `${formatarData(data, { weekday: 'short', day: '2-digit', month: '2-digit' })}: ${formatarMoeda(valor)} em entradas, ${dia.servicos} ${dia.servicos === 1 ? 'serviço' : 'serviços'}`
        return <div key={dia.data} className="group relative flex h-full flex-1 flex-col justify-end" title={descricao} aria-label={descricao} role="img">
          <div className={`w-full rounded-t ${futuro ? 'bg-marinho-claro' : dia.data === hoje ? 'bg-ouro' : 'bg-ouro/60 group-hover:bg-ouro'}`} style={{ height: `${Math.max((valor / maior) * 100, valor > 0 ? 3 : 1)}%` }} />
        </div>
      })}
    </div>
    <div className={`mt-2 flex ${periodo === 'mensal' ? 'gap-[3px] sm:gap-1.5' : 'gap-2 sm:gap-4'}`} aria-hidden="true">
      {dias.map((dia, i) => {
        const data = dataDeISO(dia.data)
        const mostrar = periodo === 'semanal' || i === 0 || (i + 1) % 5 === 0
        return <span key={dia.data} className="flex-1 text-center text-[10px] text-texto-terciario">{mostrar ? (periodo === 'semanal' ? formatarData(data, { weekday: 'short' }).replace('.', '') : data.getDate()) : ''}</span>
      })}
    </div>
  </section>
}

function Barras({ titulo, itens, cor, vazio, total }) {
  const maior = Math.max(...itens.map((item) => Number(item.valor) || 0), 1)
  return <section className="min-w-0"><div className="flex items-center justify-between border-b border-marinho-borda pb-3"><h2 className="section-label">{titulo}</h2>{total != null && <span className="font-numero text-xs text-erro">{formatarMoeda(total)}</span>}</div>{itens.length === 0 ? <p className="py-10 text-sm text-texto-secundario">{vazio}</p> : <div className="mt-5 space-y-5">{itens.map((item) => <div key={item.nome}><div className="mb-2 flex justify-between gap-4 text-sm"><span className="text-texto-secundario">{item.nome}{item.percentual != null && <span className="ml-2 font-numero text-xs text-texto-terciario">{item.percentual.toFixed(0)}%</span>}</span><strong className="font-numero text-texto">{formatarMoeda(item.valor)}</strong></div><div className="h-2 overflow-hidden rounded-full bg-marinho-claro"><div className={`h-full rounded-full ${cor}`} style={{ width: `${Math.max((item.valor / maior) * 100, 2)}%` }} /></div></div>)}</div>}</section>
}

function TopServicos({ servicos }) {
  const [todos, setTodos] = useState(false)
  const visiveis = todos ? servicos : servicos.slice(0, TOP_SERVICOS)
  const maior = Math.max(...servicos.map((s) => Number(s.valorTotal) || 0), 1)
  return <section className="min-w-0">
    <div className="flex items-center justify-between border-b border-marinho-borda pb-3"><h2 className="section-label">Serviços mais vendidos</h2><span className="text-xs text-texto-secundario">por valor</span></div>
    {servicos.length === 0 ? <p className="py-10 text-sm text-texto-secundario">Nenhum serviço neste período.</p> : <>
      <ol className="mt-3 divide-y divide-white/5">{visiveis.map((s, i) => <li key={s.nome} className="flex items-center gap-3 py-3">
        <span className="w-5 font-numero text-sm text-texto-terciario">{i + 1}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3"><span className="truncate text-sm text-texto">{s.nome}</span><strong className="font-numero text-sm text-texto">{formatarMoeda(s.valorTotal)}</strong></div>
          <div className="mt-1.5 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-marinho-claro"><div className="h-full rounded-full bg-ouro/70" style={{ width: `${Math.max((s.valorTotal / maior) * 100, 2)}%` }} /></div><span className="w-10 text-right font-numero text-xs text-texto-secundario">{s.quantidade}×</span></div>
        </div>
      </li>)}</ol>
      {servicos.length > TOP_SERVICOS && <button type="button" onClick={() => setTodos(!todos)} className="mt-2 text-sm font-semibold text-ouro">{todos ? 'Mostrar menos' : `Ver todos (${servicos.length})`}</button>}
    </>}
  </section>
}

function Equipe({ funcionarios }) {
  return <section className="min-w-0">
    <div className="flex items-center justify-between border-b border-marinho-borda pb-3"><h2 className="section-label">Por funcionário</h2><span className="text-xs text-texto-secundario">serviços feitos</span></div>
    {funcionarios.length === 0 ? <p className="py-10 text-sm text-texto-secundario">Nenhum serviço neste período.</p> : <div className="-mx-1 mt-2 overflow-x-auto px-1"><table className="w-full min-w-[20rem] text-sm">
      <thead><tr className="text-left text-[10px] uppercase tracking-wider text-texto-terciario"><th className="py-2 font-semibold">Nome</th><th className="py-2 text-right font-semibold">Serviços</th><th className="py-2 text-right font-semibold">Faturamento</th><th className="py-2 text-right font-semibold">Comissão</th></tr></thead>
      <tbody className="divide-y divide-white/5">{funcionarios.map((f) => <tr key={f.id}>
        <td className="py-3 pr-3"><p className="text-texto">{f.nome}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-texto-secundario"><KeyRound size={11} />{f.chaves} {f.chaves === 1 ? 'chave' : 'chaves'}</p></td>
        <td className="py-3 text-right font-numero text-texto">{f.servicos}</td>
        <td className="py-3 text-right font-numero text-texto">{formatarMoeda(f.faturamento)}</td>
        <td className="py-3 text-right font-numero">{f.percentualComissao != null ? <><span className="text-texto">{formatarMoeda(f.comissao)}</span><span className="block text-[10px] text-texto-terciario">{Number(f.percentualComissao)}%</span></> : <span className="text-texto-terciario">—</span>}</td>
      </tr>)}</tbody>
    </table></div>}
    <p className="mt-3 text-xs text-texto-terciario">Faturamento considera os serviços realizados, pagos ou fiado; garantias não entram.</p>
  </section>
}

function ordenar(mapa) {
  return Object.entries(mapa || {}).filter(([, valor]) => Number(valor) > 0).sort(([, a], [, b]) => b - a)
}

function parametros(periodo, referencia) {
  if (periodo === 'diario') return { data: dataLocalISO(referencia) }
  if (periodo === 'semanal') return { inicio: dataLocalISO(referencia) }
  return { mes: referencia.getMonth() + 1, ano: referencia.getFullYear() }
}

function deslocar(periodo, referencia, passo) {
  const nova = new Date(referencia)
  if (periodo === 'diario') nova.setDate(nova.getDate() + passo)
  else if (periodo === 'semanal') nova.setDate(nova.getDate() + passo * 7)
  else { nova.setDate(1); nova.setMonth(nova.getMonth() + passo) }
  return nova
}

function inicioDaSemana(data) {
  const inicio = new Date(data)
  inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7))
  return inicio
}

function contemHoje(periodo, referencia) {
  const hoje = new Date()
  if (periodo === 'diario') return dataLocalISO(referencia) >= dataLocalISO(hoje)
  if (periodo === 'semanal') return dataLocalISO(inicioDaSemana(referencia)) >= dataLocalISO(inicioDaSemana(hoje))
  return referencia.getFullYear() * 12 + referencia.getMonth() >= hoje.getFullYear() * 12 + hoje.getMonth()
}

function rotuloPeriodo(periodo, referencia) {
  if (periodo === 'diario') {
    if (dataLocalISO(referencia) === dataLocalISO()) return 'Hoje'
    const texto = formatarData(referencia, { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\./g, '')
    return texto.charAt(0).toUpperCase() + texto.slice(1)
  }
  if (periodo === 'semanal') {
    const inicio = inicioDaSemana(referencia)
    const fim = new Date(inicio)
    fim.setDate(fim.getDate() + 6)
    return `${formatarData(inicio, { day: '2-digit', month: '2-digit' })} a ${formatarData(fim, { day: '2-digit', month: '2-digit' })}`
  }
  const texto = formatarData(referencia, { month: 'long', year: 'numeric' })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
