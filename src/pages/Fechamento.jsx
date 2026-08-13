import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, KeyRound } from 'lucide-react'
import Card from '../components/Card'
import api from '../services/api'

export default function Fechamento() {
  const navigate = useNavigate()
  const [caixa, setCaixa] = useState(null)

  useEffect(() => {
    carregarFechamento()
  }, [])

  async function carregarFechamento() {
    try {
      const response = await api.get('/caixa/hoje')
      setCaixa(response.data)
    } catch (err) {
      // silencia
    }
  }

  if (!caixa) {
    return (
      <div className="min-h-screen bg-marinho flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const resumo = [
    { label: 'Saldo abertura', valor: `R$ ${caixa.valorAbertura?.toFixed(2).replace('.', ',')}`, cor: 'text-texto' },
    { label: 'Total entradas', valor: `+ R$ ${caixa.totalEntradas?.toFixed(2).replace('.', ',')}`, cor: 'text-sucesso' },
    { label: 'Total saídas', valor: `- R$ ${caixa.totalSaidas?.toFixed(2).replace('.', ',')}`, cor: 'text-erro' },
  ]

  return (
    <div className="min-h-screen bg-marinho pb-24">
      {/* Header */}
      <div className="px-5 pt-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/caixa')}
          className="w-10 h-10 bg-marinho-claro border border-marinho-borda rounded-xl
            flex items-center justify-center text-texto"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-display font-bold text-xl text-texto">FECHAMENTO DO DIA</h1>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-3">
        {/* Resumo */}
        <Card>
          <p className="text-texto-secundario text-[11px] tracking-wider mb-3">
            RESUMO — {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </p>

          {resumo.map((item) => (
            <div
              key={item.label}
              className="flex justify-between py-2.5 border-b border-white/5 last:border-b-0"
            >
              <span className="text-texto-secundario text-sm font-body">{item.label}</span>
              <span className={`font-semibold text-sm font-numero ${item.cor}`}>{item.valor}</span>
            </div>
          ))}

          <div className="flex justify-between pt-3 mt-1">
            <span className="font-display font-bold text-base text-texto">Saldo final</span>
            <span className="font-numero font-extrabold text-2xl text-ouro">
              R$ {caixa.saldoFinal?.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </Card>

        {/* Badge de chaves */}
        <Card className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ouro-fosco flex items-center justify-center text-ouro">
              <KeyRound size={20} />
            </div>
            <div>
              <p className="text-sm font-medium font-body text-texto">Chaves cortadas hoje</p>
              <p className="text-xs text-texto-secundario font-body">Total de unidades</p>
            </div>
          </div>
          <p className="font-numero font-extrabold text-3xl text-ouro">
            {caixa.totalChaves}
          </p>
        </Card>

        {/* Status */}
        <Card>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${caixa.status === 'FECHADO' ? 'bg-erro' : 'bg-sucesso'}`} />
            <p className="font-body text-sm text-texto">
              Caixa {caixa.status === 'FECHADO' ? 'fechado' : 'aberto'}
            </p>
          </div>
          {caixa.observacao && (
            <p className="text-texto-secundario text-xs font-body mt-2 ml-6">
              {caixa.observacao}
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
