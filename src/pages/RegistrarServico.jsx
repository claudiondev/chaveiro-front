import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, House, Minus, Plus, Search } from 'lucide-react'
import Chip from '../components/Chip'
import GoldButton from '../components/GoldButton'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/InterfaceState'
import { formatarMoeda } from '../utils/formatters'
import api from '../services/api'

const PAGAMENTOS = [
  { valor: 'DINHEIRO', label: 'Dinheiro' }, { valor: 'PIX', label: 'PIX' },
  { valor: 'CARTAO_DEBITO', label: 'Débito' }, { valor: 'CARTAO_CREDITO', label: 'Crédito' },
]

export default function RegistrarServico() {
  const navigate = useNavigate()
  const location = useLocation()
  const [tipos, setTipos] = useState([])
  const [busca, setBusca] = useState('')
  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [quantidade, setQuantidade] = useState(1)
  const [pagamento, setPagamento] = useState('PIX')
  const [domicilio, setDomicilio] = useState(false)
  const [endereco, setEndereco] = useState('')
  const [observacao, setObservacao] = useState('')
  const [estado, setEstado] = useState('carregando')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => { carregarTipos() }, [])

  async function carregarTipos() {
    setEstado('carregando')
    try {
      const response = await api.get('/tipos-servico')
      setTipos(response.data)
      const inicial = response.data.find((tipo) => tipo.id === location.state?.tipoId)
      if (inicial) setTipoSelecionado(inicial)
      setEstado('pronto')
    } catch { setEstado('erro') }
  }

  const filtrados = useMemo(() => tipos.filter((tipo) => tipo.nome.toLowerCase().includes(busca.trim().toLowerCase())), [tipos, busca])
  const valorUnitario = tipoSelecionado ? (domicilio && tipoSelecionado.precoExterno > 0 ? tipoSelecionado.precoExterno : tipoSelecionado.preco) : 0
  const total = valorUnitario * quantidade
  function selecionar(tipo) { setTipoSelecionado(tipo); setQuantidade(1); setErro('') }

  async function handleRegistrar() {
    if (!tipoSelecionado || enviando) return
    setEnviando(true); setErro('')
    try {
      await api.post('/servicos', { tipoServicoId: tipoSelecionado.id, quantidade, formaPagamento: pagamento, domicilio, endereco: domicilio ? endereco : null, observacao: observacao || null })
      navigate('/')
    } catch (err) { setErro(err.response?.data?.erro || 'Não foi possível registrar o serviço.') }
    finally { setEnviando(false) }
  }

  return (
    <div className="page-shell"><div className="page-content">
      <PageHeader titulo="Registrar serviço" subtitulo="Escolha o serviço, confira o atendimento e registre no movimento do dia." onBack={() => navigate(-1)} />
      {estado === 'carregando' && <LoadingState texto="Carregando serviços" />}
      {estado === 'erro' && <ErrorState mensagem="Não foi possível carregar os serviços." onRetry={carregarTipos} />}
      {estado === 'pronto' && <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start">
        <section data-tour="registro-escolha" className={tipoSelecionado ? 'hidden lg:block' : 'block'}>
          <h2 className="section-label">1 · Escolha o serviço</h2>
          <div className="relative mt-3"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-terciario" /><label htmlFor="busca-registro" className="sr-only">Buscar serviço</label><input id="busca-registro" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar na tabela" className="field pl-11" /></div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-marinho-borda bg-marinho-claro/55">
            {filtrados.length === 0 && <p className="px-4 py-10 text-center text-sm text-texto-secundario">Nenhum serviço encontrado.</p>}
            {filtrados.map((tipo) => <button key={tipo.id} onClick={() => selecionar(tipo)} className={`flex w-full items-center gap-3 border-b border-white/5 px-4 py-3.5 text-left last:border-0 hover:bg-white/[0.035] ${tipoSelecionado?.id === tipo.id ? 'bg-ouro-fosco' : ''}`}>
              <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${tipoSelecionado?.id === tipo.id ? 'border-ouro bg-ouro text-marinho' : 'border-marinho-borda'}`}>{tipoSelecionado?.id === tipo.id && <Check size={13} />}</span><span className="min-w-0 flex-1 truncate text-sm text-texto">{tipo.nome}</span><strong className="font-numero text-sm text-ouro">{formatarMoeda(tipo.preco)}</strong>
            </button>)}
          </div>
        </section>

        <section data-tour="registro-ficha" className={`${tipoSelecionado ? 'block' : 'hidden lg:block'} lg:sticky lg:top-8`}>
          <h2 className="section-label">2 · Ficha do atendimento</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-marinho-borda bg-marinho-claro/65">
            {!tipoSelecionado ? <div className="px-6 py-16 text-center"><p className="text-sm text-texto">Selecione um serviço na tabela.</p><p className="mt-1 text-xs text-texto-secundario">Os detalhes do atendimento aparecerão aqui.</p></div> : <>
              <div className="flex items-start justify-between gap-4 border-b border-marinho-borda p-5"><div><p className="text-xs text-texto-secundario">Serviço selecionado</p><h3 className="mt-1 font-display text-xl font-bold text-texto">{tipoSelecionado.nome}</h3><p className="mt-1 font-numero text-sm text-ouro">{formatarMoeda(valorUnitario)} por unidade</p></div><button onClick={() => { setTipoSelecionado(null); setBusca('') }} className="text-xs font-semibold text-ouro lg:hidden">Trocar serviço</button></div>
              <div className="space-y-6 p-5">
                <div><span className="section-label">Quantidade</span><div className="mt-3 flex items-center gap-4"><button onClick={() => setQuantidade((valor) => Math.max(1, valor - 1))} aria-label="Diminuir quantidade" className="flex h-11 w-11 items-center justify-center rounded-xl border border-marinho-borda text-texto"><Minus size={17} /></button><output className="min-w-10 text-center font-numero text-2xl font-bold text-texto">{quantidade}</output><button onClick={() => setQuantidade((valor) => valor + 1)} aria-label="Aumentar quantidade" className="flex h-11 w-11 items-center justify-center rounded-xl border border-marinho-borda text-ouro"><Plus size={17} /></button></div></div>
                <div><span className="section-label">Pagamento</span><div className="mt-3 flex flex-wrap gap-2">{PAGAMENTOS.map((item) => <Chip key={item.valor} label={item.label} ativo={pagamento === item.valor} onClick={() => setPagamento(item.valor)} />)}</div></div>
                <div className="border-t border-marinho-borda pt-5"><label className="flex cursor-pointer items-center justify-between gap-4"><span><strong className="flex items-center gap-2 text-sm font-medium text-texto"><House size={16} /> Atendimento externo</strong><span className="mt-1 block text-xs text-texto-secundario">Usa o preço externo cadastrado para o serviço.</span></span><input type="checkbox" checked={domicilio} onChange={(event) => setDomicilio(event.target.checked)} className="h-5 w-5 accent-[#F5B731]" /></label>{domicilio && <div className="mt-4"><label htmlFor="endereco" className="mb-2 block text-xs text-texto-secundario">Endereço do atendimento</label><input id="endereco" value={endereco} onChange={(event) => setEndereco(event.target.value)} placeholder="Rua, número e referência" className="field" required /></div>}</div>
                <div><label htmlFor="observacao" className="mb-2 block text-xs text-texto-secundario">Observação (opcional)</label><textarea id="observacao" value={observacao} onChange={(event) => setObservacao(event.target.value)} placeholder="Detalhes úteis do atendimento" rows="2" className="field resize-none" /></div>
              </div>
              <div data-tour="registro-total" className="border-t border-marinho-borda bg-marinho/50 p-5"><div className="mb-4 flex items-end justify-between gap-4"><span className="text-sm text-texto-secundario">Total a receber</span><strong className="font-numero text-2xl text-ouro">{formatarMoeda(total)}</strong></div>{erro && <p className="mb-3 text-sm text-erro" role="alert">{erro}</p>}<GoldButton onClick={handleRegistrar} desabilitado={enviando || (domicilio && !endereco.trim())}>{enviando ? 'Registrando…' : 'Registrar serviço'}</GoldButton></div>
            </>}
          </div>
        </section>
      </div>}
    </div></div>
  )
}
