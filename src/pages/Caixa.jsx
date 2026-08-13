import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpCircle, ArrowDownCircle, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import GoldButton from '../components/GoldButton'
import Chip from '../components/Chip'
import api from '../services/api'

export default function Caixa() {
  const { isDono } = useAuth()
  const navigate = useNavigate()
  const [caixa, setCaixa] = useState(null)
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [semCaixa, setSemCaixa] = useState(false)

  // Modal de abertura
  const [modalAbrir, setModalAbrir] = useState(false)
  const [valorAbertura, setValorAbertura] = useState('')

  // Modal de movimentação
  const [modalMov, setModalMov] = useState(false)
  const [tipoMov, setTipoMov] = useState('SAIDA')
  const [valorMov, setValorMov] = useState('')
  const [descricaoMov, setDescricaoMov] = useState('')
  const [categoriaMov, setCategoriaMov] = useState('OUTROS')

  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarCaixa()
  }, [])

  async function carregarCaixa() {
    try {
      const response = await api.get('/caixa/hoje')
      setCaixa(response.data)
      setSemCaixa(false)
    } catch (err) {
      if (err.response?.data?.erro?.includes('não foi aberto')) {
        setSemCaixa(true)
      }
    } finally {
      setCarregando(false)
    }
  }

  async function abrirCaixa() {
    setErro('')
    try {
      await api.post('/caixa/abertura', {
        valorAbertura: parseFloat(valorAbertura),
      })
      setModalAbrir(false)
      setValorAbertura('')
      carregarCaixa()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao abrir caixa')
    }
  }

  async function registrarMovimentacao() {
    setErro('')
    try {
      await api.post('/caixa/movimentacao', {
        tipo: tipoMov,
        valor: parseFloat(valorMov),
        descricao: descricaoMov,
        categoriaSaida: tipoMov === 'SAIDA' ? categoriaMov : null,
      })
      setModalMov(false)
      setValorMov('')
      setDescricaoMov('')
      carregarCaixa()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao registrar movimentação')
    }
  }

  async function fecharCaixa() {
    if (!confirm('Confirma o fechamento do caixa de hoje?')) return
    try {
      await api.post('/caixa/fechamento', {})
      navigate('/fechamento')
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao fechar caixa')
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-marinho flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Caixa não aberto
  if (semCaixa) {
    return (
      <div className="min-h-screen bg-marinho pb-24">
        <div className="px-5 pt-6">
          <h1 className="font-display font-bold text-xl text-texto">CAIXA DO DIA</h1>
        </div>

        <div className="px-5 mt-10 text-center">
          <p className="text-texto-secundario font-body text-sm mb-6">
            O caixa ainda não foi aberto hoje
          </p>

          {!modalAbrir ? (
            <GoldButton onClick={() => setModalAbrir(true)}>ABRIR CAIXA</GoldButton>
          ) : (
            <Card className="text-left">
              <label className="block text-texto-secundario text-xs font-medium mb-2 tracking-wider font-body">
                VALOR DE ABERTURA
              </label>
              <input
                type="number"
                value={valorAbertura}
                onChange={(e) => setValorAbertura(e.target.value)}
                placeholder="0.00"
                className="w-full bg-marinho border-2 border-marinho-borda rounded-xl px-4 py-3.5
                  text-texto font-numero text-lg focus:border-ouro placeholder:text-texto-terciario mb-3"
              />
              {erro && <p className="text-erro text-sm font-body mb-3">{erro}</p>}
              <GoldButton onClick={abrirCaixa} desabilitado={!valorAbertura}>
                CONFIRMAR ABERTURA
              </GoldButton>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marinho pb-24">
      {/* Header */}
      <div className="px-5 pt-6 flex justify-between items-center">
        <h1 className="font-display font-bold text-xl text-texto">CAIXA DO DIA</h1>
        <span className="text-texto-secundario text-sm font-body">
          {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Card principal do saldo */}
      <div className="px-5 mt-4">
        <Card>
          <p className="text-texto-secundario text-[11px] tracking-wider mb-1">SALDO ATUAL</p>
          <p className="font-numero font-extrabold text-4xl text-ouro mb-4 text-shadow-gold">
            R$ {caixa.saldoFinal?.toFixed(2).replace('.', ',')}
          </p>

          <div className="flex gap-0 border-t border-white/5 pt-3.5">
            <div className="flex-1">
              <p className="text-texto-secundario text-[11px] mb-1">Abertura</p>
              <p className="font-numero font-semibold text-base text-texto">
                R$ {caixa.valorAbertura?.toFixed(0)}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-sucesso text-[11px] mb-1">↑ Entradas</p>
              <p className="font-numero font-bold text-base text-sucesso">
                R$ {caixa.totalEntradas?.toFixed(0)}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-erro text-[11px] mb-1">↓ Saídas</p>
              <p className="font-numero font-bold text-base text-erro">
                R$ {caixa.totalSaidas?.toFixed(0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Botão nova movimentação */}
      <div className="px-5 mt-3">
        {!modalMov ? (
          <button
            onClick={() => setModalMov(true)}
            className="w-full bg-marinho-claro border border-marinho-borda rounded-xl py-3.5
              flex items-center justify-center gap-2 text-ouro font-display font-bold text-sm"
          >
            <Plus size={16} /> Nova movimentação
          </button>
        ) : (
          <Card>
            <div className="flex gap-2 mb-3">
              <Chip label="Saída" ativo={tipoMov === 'SAIDA'} onClick={() => setTipoMov('SAIDA')} />
              <Chip label="Entrada" ativo={tipoMov === 'ENTRADA'} onClick={() => setTipoMov('ENTRADA')} />
            </div>

            <input
              type="number"
              value={valorMov}
              onChange={(e) => setValorMov(e.target.value)}
              placeholder="Valor"
              className="w-full bg-marinho border-2 border-marinho-borda rounded-xl px-4 py-3
                text-texto font-numero text-lg focus:border-ouro placeholder:text-texto-terciario mb-2"
            />
            <input
              value={descricaoMov}
              onChange={(e) => setDescricaoMov(e.target.value)}
              placeholder="Descrição"
              className="w-full bg-marinho border-2 border-marinho-borda rounded-xl px-4 py-3
                text-texto font-body text-sm focus:border-ouro placeholder:text-texto-terciario mb-2"
            />

            {tipoMov === 'SAIDA' && (
              <div className="flex gap-2 flex-wrap mb-3">
                {['ALIMENTACAO', 'FORNECEDOR', 'TAXAS', 'OUTROS'].map((cat) => (
                  <Chip
                    key={cat}
                    label={cat.charAt(0) + cat.slice(1).toLowerCase()}
                    ativo={categoriaMov === cat}
                    onClick={() => setCategoriaMov(cat)}
                  />
                ))}
              </div>
            )}

            {erro && <p className="text-erro text-sm font-body mb-2">{erro}</p>}

            <div className="flex gap-2">
              <button
                onClick={() => { setModalMov(false); setErro('') }}
                className="flex-1 py-3 rounded-xl border border-marinho-borda text-texto-secundario font-display font-bold text-sm"
              >
                Cancelar
              </button>
              <div className="flex-1">
                <GoldButton pequeno onClick={registrarMovimentacao} desabilitado={!valorMov || !descricaoMov}>
                  Registrar
                </GoldButton>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Botão fechar caixa (só DONO) */}
      {isDono() && caixa.status === 'ABERTO' && (
        <div className="px-5 mt-4">
          <button
            onClick={fecharCaixa}
            className="w-full py-3.5 rounded-xl border border-ouro text-ouro font-display font-bold text-sm
              active:bg-ouro-fosco"
          >
            FECHAR CAIXA DO DIA
          </button>
        </div>
      )}

      {/* Info do status */}
      <div className="px-5 mt-3 text-center">
        <p className="text-texto-terciario text-xs font-body">
          {caixa.totalServicos} serviço(s) · {caixa.totalChaves} chave(s) cortada(s)
        </p>
      </div>
    </div>
  )
}
