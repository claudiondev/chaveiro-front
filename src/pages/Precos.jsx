import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, House, Plus, Search } from 'lucide-react'
import Chip from '../components/Chip'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/InterfaceState'
import { formatarMoeda } from '../utils/formatters'
import api from '../services/api'

const CATEGORIAS = ['Todos', 'CHAVE', 'FECHADURA', 'CONTROLE', 'CARIMBO', 'OUTROS']
const LABELS = { Todos: 'Todos', CHAVE: 'Chaves', FECHADURA: 'Fechaduras', CONTROLE: 'Controles', CARIMBO: 'Carimbos', OUTROS: 'Outros' }

export default function Precos() {
  const navigate = useNavigate()
  const [tipos, setTipos] = useState([])
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [estado, setEstado] = useState('carregando')

  useEffect(() => { carregarTipos() }, [])

  async function carregarTipos() {
    setEstado('carregando')
    try {
      const response = await api.get('/tipos-servico')
      setTipos(response.data)
      setEstado('pronto')
    } catch {
      setEstado('erro')
    }
  }

  const filtrados = useMemo(() => tipos.filter((tipo) => {
    const correspondeCategoria = categoria === 'Todos' || tipo.categoria === categoria
    const correspondeBusca = tipo.nome.toLowerCase().includes(busca.trim().toLowerCase())
    return correspondeCategoria && correspondeBusca
  }), [tipos, categoria, busca])

  return (
    <div className="page-shell"><div className="page-content">
      <PageHeader titulo="Tabela de serviços" subtitulo="Consulte os valores do balcão e inicie um atendimento com o serviço já selecionado."
        acao={<button data-tour="servicos-novo" onClick={() => navigate('/servicos/registrar')} className="hidden items-center gap-2 rounded-xl bg-ouro px-4 py-3 font-display font-bold text-marinho sm:flex"><Plus size={18} /> Novo serviço</button>} />

      <section data-tour="servicos-busca" className="mt-8 rounded-2xl bg-marinho-claro/70 p-3 sm:p-4">
        <label htmlFor="buscar-servico" className="sr-only">Buscar serviço</label>
        <div className="relative"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto-terciario" /><input id="buscar-servico" value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por nome do serviço" className="field pl-11" /></div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por categoria">
          {CATEGORIAS.map((item) => <Chip key={item} label={LABELS[item]} ativo={categoria === item} onClick={() => setCategoria(item)} />)}
        </div>
      </section>

      {estado === 'carregando' && <LoadingState texto="Carregando tabela de serviços" />}
      {estado === 'erro' && <ErrorState mensagem="Não foi possível carregar a tabela de serviços." onRetry={carregarTipos} />}
      {estado === 'pronto' && <section data-tour="servicos-lista" className="mt-6" aria-live="polite">
        <div className="mb-3 flex items-center justify-between border-b border-marinho-borda pb-3"><h2 className="section-label">{LABELS[categoria]}</h2><span className="text-xs text-texto-secundario">{filtrados.length} {filtrados.length === 1 ? 'serviço' : 'serviços'}</span></div>
        {filtrados.length === 0 ? <div className="py-14 text-center"><p className="text-sm text-texto">Nenhum serviço encontrado.</p><p className="mt-1 text-xs text-texto-secundario">Tente outro nome ou categoria.</p></div> :
          <div className="overflow-hidden rounded-2xl border border-marinho-borda bg-marinho-claro/55">
            <div className="hidden grid-cols-[1fr_150px_170px_44px] gap-4 border-b border-marinho-borda px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-texto-terciario md:grid"><span>Serviço</span><span>Balcão</span><span>Atendimento externo</span><span /></div>
            {filtrados.map((tipo) => <button key={tipo.id} onClick={() => navigate('/servicos/registrar', { state: { tipoId: tipo.id } })} className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-white/5 px-4 py-4 text-left last:border-0 hover:bg-white/[0.035] md:grid-cols-[1fr_150px_170px_44px] md:px-5">
              <span className="min-w-0"><strong className="block truncate text-sm font-medium text-texto">{tipo.nome}</strong><span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-texto-terciario">{LABELS[tipo.categoria] || tipo.categoria}</span></span>
              <strong className="font-numero text-sm text-ouro md:text-base">{formatarMoeda(tipo.preco)}</strong>
              <span className="col-span-2 flex items-center gap-1.5 text-xs text-texto-secundario md:col-span-1">{tipo.precoExterno > 0 ? <><House size={13} /> {formatarMoeda(tipo.precoExterno)}</> : 'Não cadastrado'}</span>
              <ArrowRight size={17} className="hidden text-texto-terciario transition-transform group-hover:translate-x-1 group-hover:text-ouro md:block" />
            </button>)}
          </div>}
      </section>}
    </div></div>
  )
}
