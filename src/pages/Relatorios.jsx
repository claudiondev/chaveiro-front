import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Card from '../components/Card'
import Chip from '../components/Chip'
import api from '../services/api'

const CORES_PIE = ['#6366F1', '#EC4899', '#14B8A6', '#F5B731']

export default function Relatorios() {
  const navigate = useNavigate()
  const [periodo, setPeriodo] = useState('diario')
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarRelatorio()
  }, [periodo])

  async function carregarRelatorio() {
    setCarregando(true)
    try {
      let url = '/relatorios/'
      if (periodo === 'diario') {
        const hoje = new Date().toISOString().split('T')[0]
        url += `diario?data=${hoje}`
      } else if (periodo === 'semanal') {
        url += 'semanal'
      } else {
        const agora = new Date()
        url += `mensal?mes=${agora.getMonth() + 1}&ano=${agora.getFullYear()}`
      }

      const response = await api.get(url)
      setDados(response.data)
    } catch (err) {
      setDados(null)
    } finally {
      setCarregando(false)
    }
  }

  // Dados para gráfico de área (entradas por forma de pagamento)
  const dadosGrafico = dados?.entradasPorFormaPagamento
    ? Object.entries(dados.entradasPorFormaPagamento).map(([forma, valor]) => ({
      forma: forma.replace('CARTAO_', 'C.'),
      valor,
    }))
    : []

  // Dados para pie chart (saídas por categoria)
  const dadosPie = dados?.saidasPorCategoria
    ? Object.entries(dados.saidasPorCategoria)
      .filter(([, valor]) => valor > 0)
      .map(([cat, valor]) => ({
        name: cat.charAt(0) + cat.slice(1).toLowerCase(),
        value: valor,
      }))
    : []

  return (
    <div className="min-h-screen bg-marinho pb-24">
      {/* Header */}
      <div className="px-5 pt-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/menu')}
          className="w-10 h-10 bg-marinho-claro border border-marinho-borda rounded-xl
            flex items-center justify-center text-texto"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="font-display font-bold text-xl text-texto">RELATÓRIOS</h1>
        <div className="ml-auto bg-ouro-fosco border border-ouro rounded-lg px-2.5 py-1">
          <span className="text-ouro text-[11px] font-display font-bold">DONO</span>
        </div>
      </div>

      {/* Período */}
      <div className="mx-5 mt-4 bg-marinho-claro border border-marinho-borda rounded-xl flex p-1">
        {['diario', 'semanal', 'mensal'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`flex-1 py-2.5 rounded-lg font-display font-semibold text-sm
              ${periodo === p ? 'bg-ouro text-marinho' : 'text-texto-secundario'}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {carregando ? (
        <div className="flex justify-center mt-10">
          <div className="w-8 h-8 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !dados ? (
        <p className="text-texto-secundario text-sm font-body text-center mt-10">
          Sem dados para o período
        </p>
      ) : (
        <div className="px-5 mt-4 flex flex-col gap-3">
          {/* Faturamento */}
          <Card>
            <p className="text-texto-secundario text-[11px] tracking-wider mb-1">
              FATURAMENTO — {periodo.toUpperCase()}
            </p>
            <p className="font-numero font-extrabold text-3xl text-ouro mb-4">
              R$ {dados.totalEntradas?.toFixed(0)}
            </p>

            {dadosGrafico.length > 0 && (
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={dadosGrafico}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5B731" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F5B731" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="forma"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#122240',
                      border: '1px solid #1E3A5F',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 12,
                    }}
                    formatter={(v) => [`R$ ${v}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke="#F5B731"
                    strokeWidth={2}
                    fill="url(#goldGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Resumo numérico */}
          <div className="grid grid-cols-2 gap-2.5">
            <Card>
              <p className="text-texto-secundario text-[11px] tracking-wider">SERVIÇOS</p>
              <p className="font-numero font-bold text-2xl text-texto mt-1">{dados.totalServicos}</p>
            </Card>
            <Card>
              <p className="text-texto-secundario text-[11px] tracking-wider">CHAVES</p>
              <p className="font-numero font-bold text-2xl text-ouro mt-1">{dados.totalChaves}</p>
            </Card>
          </div>

          {/* Despesas por categoria */}
          {dadosPie.length > 0 && (
            <Card>
              <p className="text-texto-secundario text-[11px] tracking-wider mb-3">
                SAÍDAS POR CATEGORIA
              </p>
              <div className="flex items-center gap-4">
                <PieChart width={90} height={90}>
                  <Pie
                    data={dadosPie}
                    cx={40}
                    cy={40}
                    innerRadius={25}
                    outerRadius={40}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {dadosPie.map((_, i) => (
                      <Cell key={i} fill={CORES_PIE[i % CORES_PIE.length]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex-1">
                  {dadosPie.map((item, i) => (
                    <div key={item.name} className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: CORES_PIE[i % CORES_PIE.length] }}
                        />
                        <span className="text-xs text-texto-secundario font-body">{item.name}</span>
                      </div>
                      <span className="text-xs font-numero font-semibold text-texto">
                        R$ {item.value.toFixed(0)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-white/5 pt-2 mt-1 flex justify-between">
                    <span className="text-xs text-texto-secundario">Total</span>
                    <span className="font-numero font-bold text-sm text-erro">
                      R$ {dados.totalSaidas?.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
