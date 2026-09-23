import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, FileDown, KeyRound, ReceiptText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/InterfaceState'
import { dataDeISO, formatarData, formatarMoeda } from '../utils/formatters'
import api from '../services/api'

const TAMANHO_PAGINA = 10

export default function Fechamento() {
  const navigate = useNavigate()
  const { isDono } = useAuth()
  const [aba, setAba] = useState('hoje')

  return <div className="page-shell"><div className="page-content max-w-5xl">
    <PageHeader
      titulo="Fechamento"
      subtitulo={aba === 'hoje' ? 'Conferência do expediente de hoje.' : 'Fechamentos anteriores, do mais recente para o mais antigo.'}
      onBack={() => navigate('/caixa')}
    />
    {isDono() && <div role="tablist" aria-label="Período" className="mt-6 inline-flex rounded-xl border border-marinho-borda bg-marinho-claro p-1">
      <Aba ativa={aba === 'hoje'} onClick={() => setAba('hoje')}>Hoje</Aba>
      <Aba ativa={aba === 'historico'} onClick={() => setAba('historico')}>Histórico</Aba>
    </div>}
    {aba === 'hoje' ? <AbaHoje /> : <AbaHistorico />}
  </div></div>
}

function Aba({ ativa, onClick, children }) {
  return <button type="button" role="tab" aria-selected={ativa} onClick={onClick} className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${ativa ? 'bg-ouro text-marinho' : 'text-texto-secundario hover:text-texto'}`}>{children}</button>
}

function AbaHoje() {
  const [caixa, setCaixa] = useState(null)
  const [estado, setEstado] = useState('carregando')
  useEffect(() => { carregar() }, [])

  async function carregar() {
    setEstado('carregando')
    try {
      const response = await api.get('/caixa/hoje')
      setCaixa(response.data)
      setEstado('pronto')
    } catch (error) {
      setEstado(error.response?.status === 404 ? 'sem-caixa' : 'erro')
    }
  }

  if (estado === 'carregando') return <LoadingState texto="Carregando conferência" />
  if (estado === 'erro') return <ErrorState mensagem="Não foi possível carregar a conferência do caixa." onRetry={carregar} />
  if (estado === 'sem-caixa') return <Aviso icone={ReceiptText} titulo="Caixa não aberto" texto="Ainda não há caixa aberto hoje. Abra o caixa para começar a registrar o expediente." />
  return <div className="mt-6 max-w-xl"><Comprovante caixa={caixa} /><BotaoPdf data={caixa.data} /></div>
}

function AbaHistorico() {
  const [itens, setItens] = useState([])
  const [ultima, setUltima] = useState(true)
  const [pagina, setPagina] = useState(0)
  const [estado, setEstado] = useState('carregando')
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [erroMais, setErroMais] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [detalhe, setDetalhe] = useState({ estado: 'vazio', caixa: null })
  const detalheRef = useRef(null)
  // Garante que só a resposta do último dia clicado seja exibida
  const requisicaoAtual = useRef(null)

  useEffect(() => { carregarPrimeiraPagina() }, [])

  // No celular o comprovante fica abaixo da lista; rola até ele quando termina de carregar
  useEffect(() => {
    if (detalhe.estado !== 'vazio' && detalhe.estado !== 'carregando' && window.innerWidth < 1024) {
      detalheRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [detalhe])

  async function buscarPagina(numero) {
    const response = await api.get('/caixa/historico/lista', { params: { page: numero, size: TAMANHO_PAGINA } })
    return response.data
  }

  async function carregarPrimeiraPagina() {
    setEstado('carregando')
    try {
      const dados = await buscarPagina(0)
      setItens(dados.conteudo)
      setPagina(0)
      setUltima(dados.ultima)
      setEstado('pronto')
    } catch {
      setEstado('erro')
    }
  }

  async function verMais() {
    if (carregandoMais) return
    setCarregandoMais(true)
    setErroMais(false)
    try {
      const dados = await buscarPagina(pagina + 1)
      setItens((atuais) => [...atuais, ...dados.conteudo.filter((novo) => !atuais.some((a) => a.id === novo.id))])
      setPagina(pagina + 1)
      setUltima(dados.ultima)
    } catch {
      setErroMais(true)
    } finally {
      setCarregandoMais(false)
    }
  }

  async function abrirDetalhe(item) {
    setSelecionado(item.id)
    setDetalhe({ estado: 'carregando', caixa: null })
    requisicaoAtual.current = item.id
    try {
      const response = await api.get('/caixa/historico', { params: { data: item.data } })
      if (requisicaoAtual.current === item.id) setDetalhe({ estado: 'pronto', caixa: response.data })
    } catch {
      if (requisicaoAtual.current === item.id) setDetalhe({ estado: 'erro', caixa: null })
    }
  }

  if (estado === 'carregando') return <LoadingState texto="Carregando histórico" />
  if (estado === 'erro') return <ErrorState mensagem="Não foi possível carregar o histórico de fechamentos." onRetry={carregarPrimeiraPagina} />
  if (itens.length === 0) return <Aviso icone={ReceiptText} titulo="Nenhum fechamento ainda" texto="Quando o caixa for fechado, o dia aparece aqui com o comprovante completo." />

  const itemSelecionado = itens.find((i) => i.id === selecionado)

  return <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
    <section aria-label="Fechamentos anteriores">
      <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-marinho-borda bg-marinho-claro">
        {itens.map((item) => <li key={item.id}><LinhaHistorico item={item} ativo={item.id === selecionado} onClick={() => abrirDetalhe(item)} /></li>)}
      </ul>
      {erroMais && <p className="mt-3 text-center text-sm text-erro">Não foi possível carregar mais fechamentos.</p>}
      {!ultima && <button type="button" onClick={verMais} disabled={carregandoMais} className="mt-4 w-full rounded-xl border border-marinho-borda py-3 text-sm font-semibold text-ouro hover:bg-marinho-claro disabled:opacity-50">
        {carregandoMais ? 'Carregando…' : erroMais ? 'Tentar novamente' : 'Ver mais'}
      </button>}
    </section>

    <section ref={detalheRef} aria-live="polite" className="scroll-mt-6 lg:sticky lg:top-9">
      {detalhe.estado === 'vazio' && <div className="hidden min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-marinho-borda px-6 text-center lg:flex">
        <ReceiptText className="text-texto-terciario" size={28} />
        <p className="mt-3 text-sm text-texto-secundario">Selecione um dia para ver o comprovante.</p>
      </div>}
      {detalhe.estado === 'carregando' && <LoadingState texto="Abrindo comprovante" />}
      {detalhe.estado === 'erro' && <ErrorState mensagem="Não foi possível abrir o comprovante deste dia." onRetry={() => abrirDetalhe(itemSelecionado)} />}
      {detalhe.estado === 'pronto' && <><Comprovante caixa={detalhe.caixa} /><BotaoPdf data={detalhe.caixa.data} /></>}
    </section>
  </div>
}

function LinhaHistorico({ item, ativo, onClick }) {
  const data = dataDeISO(item.data)
  const diaSemana = formatarData(data, { weekday: 'long' })
  return <button type="button" onClick={onClick} aria-current={ativo ? 'true' : undefined} className={`flex w-full items-center gap-3 px-4 py-3.5 sm:gap-4 text-left transition-colors ${ativo ? 'bg-ouro-fosco' : 'hover:bg-marinho-hover'}`}>
    <div className={`w-12 flex-shrink-0 rounded-lg border py-1.5 text-center ${ativo ? 'border-ouro text-ouro' : 'border-marinho-borda text-texto'}`}>
      <p className="font-numero text-lg font-bold leading-none">{String(data.getDate()).padStart(2, '0')}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-texto-secundario">{formatarData(data, { month: 'short' }).replace('.', '')}</p>
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-texto">{diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}</p>
      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-texto-secundario">
        <span className="whitespace-nowrap">{item.totalServicos || 0} {item.totalServicos === 1 ? 'serviço' : 'serviços'}</span>
        <span className="flex items-center gap-1 whitespace-nowrap"><KeyRound size={12} />{item.totalChaves || 0} {item.totalChaves === 1 ? 'chave' : 'chaves'}</span>
      </p>
    </div>
    <strong className="font-numero text-sm text-texto">{formatarMoeda(item.saldoFinal)}</strong>
    <ChevronRight size={16} className={ativo ? 'text-ouro' : 'text-texto-terciario'} />
  </button>
}

function Comprovante({ caixa }) {
  const fechado = caixa.status === 'FECHADO'
  const servicos = caixa.servicos || []
  return <section className="relative overflow-hidden rounded-2xl bg-[#F3F0E8] px-5 py-7 text-[#102035] shadow-2xl sm:px-8"><div className="absolute inset-x-0 top-0 h-1 bg-ouro" />
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-[#102035]/25 pb-5"><div><p className="font-display text-2xl font-extrabold">CHAVEIRO ABENÇOADO</p><p className="mt-1 text-xs text-[#102035]/60">Conferência de caixa</p></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${fechado ? 'bg-[#102035] text-white' : 'bg-[#F5B731] text-[#102035]'}`}>{fechado ? 'Fechado' : 'Parcial'}</span></div>
    <p className="py-4 text-center font-numero text-xs uppercase tracking-wider text-[#102035]/60">{formatarData(dataDeISO(caixa.data), { day: '2-digit', month: 'long', year: 'numeric' })}</p>
    <div className="border-y border-dashed border-[#102035]/25 py-2"><Linha label="Saldo de abertura" valor={caixa.valorAbertura} /><Linha label="Entradas" valor={caixa.totalEntradas} sinal="+" /><Linha label="Saídas" valor={caixa.totalSaidas} sinal="−" /></div>
    <div className="flex items-end justify-between gap-4 py-6"><span className="font-display text-lg font-bold">Saldo final</span><strong className="font-numero text-2xl sm:text-3xl">{formatarMoeda(caixa.saldoFinal)}</strong></div>

    <div className="border-t border-dashed border-[#102035]/25 pt-5">
      <p className="font-display text-sm font-bold uppercase tracking-[0.14em]">Serviços realizados</p>
      {servicos.length === 0
        ? <p className="mt-3 text-sm text-[#102035]/60">Nenhum serviço registrado neste dia.</p>
        : <ul className="mt-2">{servicos.map((s) => <li key={s.nome} className="flex items-baseline gap-3 py-2 text-sm">
            <span className="w-8 flex-shrink-0 font-numero font-semibold text-[#102035]/60">{s.quantidade}×</span>
            <span className="min-w-0 flex-1">{s.nome}</span>
            <span className="font-numero font-semibold">{formatarMoeda(s.valorTotal)}</span>
          </li>)}</ul>}
    </div>

    <div className="mt-5 grid grid-cols-2 border-t border-dashed border-[#102035]/25 pt-5 text-center"><div className="border-r border-[#102035]/15"><strong className="font-numero text-2xl">{caixa.totalServicos || 0}</strong><p className="mt-1 text-[10px] uppercase tracking-wider text-[#102035]/60">Serviços</p></div><div><strong className="font-numero text-2xl">{caixa.totalChaves || 0}</strong><p className="mt-1 text-[10px] uppercase tracking-wider text-[#102035]/60">Chaves cortadas</p></div></div>
    {caixa.observacao && <p className="mt-5 border-t border-dashed border-[#102035]/25 pt-4 text-xs text-[#102035]/70">Observação: {caixa.observacao}</p>}
  </section>
}

// No celular abre o compartilhamento do aparelho (WhatsApp etc.); no computador baixa o arquivo
function BotaoPdf({ data }) {
  const { isDono } = useAuth()
  const [estado, setEstado] = useState('parado')
  if (!isDono()) return null

  async function baixar() {
    if (estado === 'gerando') return
    setEstado('gerando')
    try {
      const response = await api.get('/caixa/historico/pdf', { params: { data }, responseType: 'blob' })
      const nome = `fechamento-${data}.pdf`
      const arquivo = new File([response.data], nome, { type: 'application/pdf' })
      const celular = window.matchMedia('(pointer: coarse)').matches
      if (celular && navigator.canShare?.({ files: [arquivo] })) {
        try {
          await navigator.share({ files: [arquivo], title: `Fechamento ${formatarData(dataDeISO(data))}` })
        } catch (error) {
          if (error.name !== 'AbortError') throw error
        }
      } else {
        const url = URL.createObjectURL(arquivo)
        const link = document.createElement('a')
        link.href = url
        link.download = nome
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
      setEstado('parado')
    } catch {
      setEstado('erro')
    }
  }

  return <div className="mt-4 flex flex-wrap items-center gap-3">
    <button type="button" onClick={baixar} disabled={estado === 'gerando'} className="flex items-center gap-2 rounded-xl border border-marinho-borda px-4 py-2.5 text-sm font-semibold text-ouro hover:bg-marinho-claro disabled:opacity-50">
      <FileDown size={16} />{estado === 'gerando' ? 'Gerando PDF…' : 'Baixar PDF'}
    </button>
    {estado === 'erro' && <p role="alert" className="text-sm text-erro">Não foi possível gerar o PDF. Tente novamente.</p>}
  </div>
}

function Aviso({ icone: Icone, titulo, texto }) {
  return <div className="mt-6 flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-marinho-borda px-6 text-center">
    <Icone className="text-ouro" size={28} />
    <p className="mt-3 font-semibold text-texto">{titulo}</p>
    <p className="mt-1 max-w-sm text-sm text-texto-secundario">{texto}</p>
  </div>
}

function Linha({ label, valor, sinal = '' }) { return <div className="flex justify-between gap-4 py-2.5 text-sm"><span className="text-[#102035]/65">{label}</span><span className="font-numero font-semibold">{sinal} {formatarMoeda(valor)}</span></div> }
