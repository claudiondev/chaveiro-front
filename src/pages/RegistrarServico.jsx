import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Search, Minus, Plus } from 'lucide-react'
import Card from '../components/Card'
import Chip from '../components/Chip'
import GoldButton from '../components/GoldButton'
import api from '../services/api'

const PAGAMENTOS = [
  { valor: 'DINHEIRO', label: 'Dinheiro' },
  { valor: 'PIX', label: 'PIX' },
  { valor: 'CARTAO_DEBITO', label: 'Débito' },
  { valor: 'CARTAO_CREDITO', label: 'Crédito' },
]

export default function RegistrarServico() {
  const navigate = useNavigate()
  const location = useLocation()
  const tipoIdInicial = location.state?.tipoId || null

  const [tipos, setTipos] = useState([])
  const [busca, setBusca] = useState('')
  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [quantidade, setQuantidade] = useState(1)
  const [pagamento, setPagamento] = useState('PIX')
  const [domicilio, setDomicilio] = useState(false)
  const [endereco, setEndereco] = useState('')
  const [observacao, setObservacao] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarTipos()
  }, [])

  async function carregarTipos() {
    try {
      const response = await api.get('/tipos-servico')
      setTipos(response.data)

      if (tipoIdInicial) {
        const tipo = response.data.find((t) => t.id === tipoIdInicial)
        if (tipo) setTipoSelecionado(tipo)
      }
    } catch (err) {
      // silencia
    }
  }

  const filtrados = tipos.filter((t) =>
    t.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const valorUnitario = tipoSelecionado
    ? (domicilio && tipoSelecionado.precoExterno > 0
      ? tipoSelecionado.precoExterno
      : tipoSelecionado.preco)
    : 0
  const total = valorUnitario * quantidade

  async function handleRegistrar() {
    if (!tipoSelecionado) return

    setEnviando(true)
    setErro('')

    try {
      await api.post('/servicos', {
        tipoServicoId: tipoSelecionado.id,
        quantidade,
        formaPagamento: pagamento,
        domicilio,
        endereco: domicilio ? endereco : null,
        observacao: observacao || null,
      })
      navigate('/')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar serviço')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-marinho pb-24">
      {/* Header */}
      <div className="px-5 pt-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-marinho-claro border border-marinho-borda rounded-xl
            flex items-center justify-center text-texto"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-display font-bold text-xl text-texto">REGISTRAR SERVIÇO</h1>
      </div>

      {/* Busca de tipo */}
      <div className="px-5 mt-5">
        <label className="block text-texto-secundario text-xs font-medium mb-2 tracking-wider font-body">
          TIPO DE SERVIÇO
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-texto-terciario" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar serviço..."
            className="w-full bg-marinho-claro border-2 border-marinho-borda rounded-xl pl-10 pr-4 py-3.5
              text-texto font-body text-sm focus:border-ouro placeholder:text-texto-terciario"
          />
        </div>

        {/* Grid de tipos */}
        <div className="grid grid-cols-2 gap-2 mt-3 max-h-44 overflow-y-auto">
          {filtrados.map((tipo) => (
            <button
              key={tipo.id}
              onClick={() => { setTipoSelecionado(tipo); setQuantidade(1) }}
              className={`text-left rounded-xl p-3 border-2
                ${tipoSelecionado?.id === tipo.id
                  ? 'border-ouro bg-ouro-fosco'
                  : 'border-marinho-borda bg-marinho-claro'
                }`}
            >
              <p className="text-xs text-texto font-medium font-body leading-snug">{tipo.nome}</p>
              <p className="text-xs text-ouro font-numero font-bold mt-1">R$ {tipo.preco?.toFixed(0)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quantidade */}
      <div className="px-5 mt-5">
        <label className="block text-texto-secundario text-xs font-medium mb-2 tracking-wider font-body">
          QUANTIDADE
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
            className="w-12 h-12 rounded-xl bg-marinho-claro border border-marinho-borda
              flex items-center justify-center text-texto"
          >
            <Minus size={18} />
          </button>
          <span className="font-numero font-bold text-2xl text-texto min-w-[32px] text-center">
            {quantidade}
          </span>
          <button
            onClick={() => setQuantidade((q) => q + 1)}
            className="w-12 h-12 rounded-xl bg-marinho-claro border border-marinho-borda
              flex items-center justify-center text-ouro"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Forma de pagamento */}
      <div className="px-5 mt-5">
        <label className="block text-texto-secundario text-xs font-medium mb-2 tracking-wider font-body">
          FORMA DE PAGAMENTO
        </label>
        <div className="flex gap-2 flex-wrap">
          {PAGAMENTOS.map((p) => (
            <Chip
              key={p.valor}
              label={p.label}
              ativo={pagamento === p.valor}
              onClick={() => setPagamento(p.valor)}
            />
          ))}
        </div>
      </div>

      {/* Toggle domicílio */}
      <div className="px-5 mt-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium font-body text-texto">Atendimento domicílio</p>
            <p className="text-xs text-texto-secundario font-body">+ taxa de deslocamento</p>
          </div>
          <button
            onClick={() => setDomicilio((d) => !d)}
            className={`w-12 h-7 rounded-full relative transition-colors
              ${domicilio ? 'bg-ouro' : 'bg-marinho-borda'}`}
          >
            <div className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white transition-all
              ${domicilio ? 'left-[23px]' : 'left-[3px]'}`}
            />
          </button>
        </div>

        {domicilio && (
          <input
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço completo..."
            className="w-full mt-3 bg-marinho-claro border-2 border-marinho-borda rounded-xl px-4 py-3.5
              text-texto font-body text-sm focus:border-ouro placeholder:text-texto-terciario"
          />
        )}
      </div>

      {/* Total e botão */}
      <div className="px-5 mt-5">
        {erro && (
          <p className="text-erro text-sm font-body text-center mb-3">{erro}</p>
        )}

        <Card className="flex justify-between items-center mb-3">
          <p className="text-texto-secundario text-sm font-body">Total do serviço</p>
          <p className="font-numero font-extrabold text-3xl text-ouro">
            R$ {total.toFixed(2).replace('.', ',')}
          </p>
        </Card>

        <GoldButton
          onClick={handleRegistrar}
          desabilitado={!tipoSelecionado || enviando}
        >
          {enviando ? 'Registrando...' : 'REGISTRAR SERVIÇO'}
        </GoldButton>
      </div>
    </div>
  )
}
