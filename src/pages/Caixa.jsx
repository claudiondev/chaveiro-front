import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Chip from '../components/Chip'
import GoldButton from '../components/GoldButton'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/InterfaceState'
import { formatarData, formatarMoeda } from '../utils/formatters'
import api from '../services/api'

export default function Caixa() {
  const { isDono } = useAuth()
  const navigate = useNavigate()
  const [caixa, setCaixa] = useState(null)
  const [estado, setEstado] = useState('carregando')
  const [formulario, setFormulario] = useState(null)
  const [valorAbertura, setValorAbertura] = useState('')
  const [tipoMov, setTipoMov] = useState('SAIDA')
  const [valorMov, setValorMov] = useState('')
  const [descricaoMov, setDescricaoMov] = useState('')
  const [categoriaMov, setCategoriaMov] = useState('OUTROS')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [confirmarFechamento, setConfirmarFechamento] = useState(false)

  useEffect(() => { carregarCaixa() }, [])

  async function carregarCaixa() {
    setEstado('carregando'); setErro('')
    try { const response = await api.get('/caixa/hoje'); setCaixa(response.data); setEstado('pronto') }
    catch (err) { if (err.response?.data?.erro?.includes('não foi aberto')) { setCaixa(null); setEstado('nao_aberto') } else setEstado('erro') }
  }

  async function executar(acao) {
    if (enviando) return
    setEnviando(true); setErro('')
    try { await acao(); setFormulario(null); await carregarCaixa() }
    catch (err) { setErro(err.response?.data?.erro || 'Não foi possível concluir a operação.') }
    finally { setEnviando(false) }
  }

  const abrirCaixa = () => executar(async () => { await api.post('/caixa/abertura', { valorAbertura: parseFloat(valorAbertura) }); setValorAbertura('') })
  const registrarMovimentacao = () => executar(async () => { await api.post('/caixa/movimentacao', { tipo: tipoMov, valor: parseFloat(valorMov), descricao: descricaoMov, categoriaSaida: tipoMov === 'SAIDA' ? categoriaMov : null }); setValorMov(''); setDescricaoMov('') })
  async function fecharCaixa() {
    if (enviando) return
    setEnviando(true); setErro('')
    try { await api.post('/caixa/fechamento', {}); navigate('/fechamento') }
    catch (err) { setErro(err.response?.data?.erro || 'Não foi possível fechar o caixa.'); setConfirmarFechamento(false) }
    finally { setEnviando(false) }
  }

  if (estado === 'carregando') return <div className="page-shell"><LoadingState texto="Conferindo o caixa" /></div>
  if (estado === 'erro') return <div className="page-shell"><ErrorState mensagem="Não foi possível consultar o caixa de hoje." onRetry={carregarCaixa} /></div>

  return <div className="page-shell"><div className="page-content">
    <PageHeader titulo="Caixa do dia" subtitulo={formatarData(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })} />

    {estado === 'nao_aberto' ? <section className="mx-auto mt-14 max-w-lg text-center"><p className="font-display text-3xl font-bold text-texto">O balcão ainda não abriu o caixa.</p><p className="mt-2 text-sm text-texto-secundario">Informe o dinheiro disponível no início do expediente.</p>{formulario !== 'abertura' ? <button onClick={() => setFormulario('abertura')} className="mt-7 rounded-xl bg-ouro px-6 py-3.5 font-display font-bold text-marinho">Abrir caixa</button> : <div className="mt-7 rounded-2xl border border-marinho-borda bg-marinho-claro/60 p-5 text-left"><label htmlFor="valor-abertura" className="section-label">Valor de abertura</label><input id="valor-abertura" type="number" min="0" step="0.01" value={valorAbertura} onChange={(e) => setValorAbertura(e.target.value)} placeholder="0,00" className="field mt-3 font-numero text-lg" />{erro && <p className="mt-3 text-sm text-erro">{erro}</p>}<GoldButton onClick={abrirCaixa} desabilitado={!valorAbertura || enviando} className="mt-4">{enviando ? 'Abrindo…' : 'Confirmar abertura'}</GoldButton></div>}</section> : <>
      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <section>
          <div className="border-y border-marinho-borda py-6"><p className="section-label">Saldo atual</p><p className="mt-2 font-numero text-4xl font-bold text-ouro sm:text-5xl">{formatarMoeda(caixa?.saldoFinal)}</p><div className="mt-6 grid grid-cols-3 divide-x divide-marinho-borda"><Resumo label="Abertura" valor={caixa?.valorAbertura} /><Resumo label="Entradas" valor={caixa?.totalEntradas} cor="text-sucesso" /><Resumo label="Saídas" valor={caixa?.totalSaidas} cor="text-erro" /></div></div>
          <div className="mt-5 flex flex-wrap gap-3"><button onClick={() => { setFormulario('movimento'); setTipoMov('ENTRADA'); setErro('') }} className="flex items-center gap-2 rounded-xl border border-marinho-borda px-4 py-3 text-sm font-semibold text-sucesso"><ArrowUp size={16} /> Registrar entrada</button><button onClick={() => { setFormulario('movimento'); setTipoMov('SAIDA'); setErro('') }} className="flex items-center gap-2 rounded-xl border border-marinho-borda px-4 py-3 text-sm font-semibold text-erro"><ArrowDown size={16} /> Registrar saída</button></div>
          <p className="mt-6 text-xs text-texto-secundario">{caixa?.totalServicos || 0} serviços · {caixa?.totalChaves || 0} chaves cortadas · Caixa {caixa?.status === 'ABERTO' ? 'aberto' : 'fechado'}</p>
        </section>

        <section>
          {formulario === 'movimento' ? <div className="rounded-2xl border border-marinho-borda bg-marinho-claro/60 p-5"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold text-texto">Nova movimentação</h2><button onClick={() => { setFormulario(null); setErro('') }} aria-label="Fechar formulário" className="text-texto-secundario"><X size={18} /></button></div><div className="mt-5 flex gap-2"><Chip label="Saída" ativo={tipoMov === 'SAIDA'} onClick={() => setTipoMov('SAIDA')} /><Chip label="Entrada" ativo={tipoMov === 'ENTRADA'} onClick={() => setTipoMov('ENTRADA')} /></div><label htmlFor="valor-mov" className="mt-5 block text-xs text-texto-secundario">Valor</label><input id="valor-mov" type="number" min="0.01" step="0.01" value={valorMov} onChange={(e) => setValorMov(e.target.value)} placeholder="0,00" className="field mt-2 font-numero" /><label htmlFor="descricao-mov" className="mt-4 block text-xs text-texto-secundario">Descrição</label><input id="descricao-mov" value={descricaoMov} onChange={(e) => setDescricaoMov(e.target.value)} placeholder="Ex.: compra de material" className="field mt-2" />{tipoMov === 'SAIDA' && <div className="mt-4 flex flex-wrap gap-2">{['ALIMENTACAO', 'FORNECEDOR', 'TAXAS', 'OUTROS'].map((cat) => <Chip key={cat} label={cat.charAt(0) + cat.slice(1).toLowerCase()} ativo={categoriaMov === cat} onClick={() => setCategoriaMov(cat)} />)}</div>}{erro && <p className="mt-3 text-sm text-erro">{erro}</p>}<GoldButton onClick={registrarMovimentacao} desabilitado={!valorMov || !descricaoMov.trim() || enviando} className="mt-5">{enviando ? 'Registrando…' : `Registrar ${tipoMov === 'SAIDA' ? 'saída' : 'entrada'}`}</GoldButton></div> : <div className="rounded-2xl bg-marinho-claro/40 p-6"><p className="section-label">Conferência</p><p className="mt-3 text-sm leading-relaxed text-texto-secundario">Registre retiradas, despesas ou entradas avulsas para manter o saldo do dia correto.</p><Plus className="mt-8 text-ouro" size={24} /></div>}
        </section>
      </div>

      {isDono() && caixa?.status === 'ABERTO' && <section className="mt-10 border-t border-marinho-borda pt-6">{!confirmarFechamento ? <button onClick={() => setConfirmarFechamento(true)} className="text-sm font-semibold text-ouro">Fechar caixa do dia</button> : <div className="flex flex-col gap-4 rounded-2xl border border-ouro/40 bg-ouro-fosco p-5 sm:flex-row sm:items-center"><div className="flex-1"><p className="font-semibold text-texto">Confirmar fechamento?</p><p className="mt-1 text-xs text-texto-secundario">O saldo final será registrado e o caixa deixará de receber movimentações.</p>{erro && <p className="mt-2 text-sm text-erro">{erro}</p>}</div><div className="flex gap-2"><button onClick={() => setConfirmarFechamento(false)} className="rounded-xl border border-marinho-borda px-4 py-2.5 text-sm text-texto">Cancelar</button><button onClick={fecharCaixa} disabled={enviando} className="rounded-xl bg-ouro px-4 py-2.5 text-sm font-bold text-marinho disabled:opacity-50">{enviando ? 'Fechando…' : 'Confirmar'}</button></div></div>}</section>}
    </>}
  </div></div>
}

function Resumo({ label, valor, cor = 'text-texto' }) { return <div className="px-3 first:pl-0"><p className="text-[10px] uppercase tracking-wider text-texto-secundario">{label}</p><p className={`mt-1 font-numero text-sm font-semibold sm:text-base ${cor}`}>{formatarMoeda(valor)}</p></div> }
