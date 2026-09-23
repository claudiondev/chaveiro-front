import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { ErrorState, LoadingState } from '../components/InterfaceState'
import { formatarData, formatarMoeda } from '../utils/formatters'
import api from '../services/api'

export default function Fechamento() {
  const navigate = useNavigate()
  const [caixa, setCaixa] = useState(null)
  const [estado, setEstado] = useState('carregando')
  useEffect(() => { carregar() }, [])
  async function carregar() { setEstado('carregando'); try { const response = await api.get('/caixa/hoje'); setCaixa(response.data); setEstado('pronto') } catch { setEstado('erro') } }
  if (estado === 'carregando') return <div className="page-shell"><LoadingState texto="Carregando conferência" /></div>
  if (estado === 'erro') return <div className="page-shell"><ErrorState mensagem="Não foi possível carregar a conferência do caixa." onRetry={carregar} /></div>
  const fechado = caixa.status === 'FECHADO'
  return <div className="page-shell"><div className="page-content max-w-3xl"><PageHeader titulo={fechado ? 'Fechamento do dia' : 'Resumo parcial'} subtitulo={fechado ? 'Conferência final do expediente.' : 'O caixa ainda está aberto; os valores podem mudar.'} onBack={() => navigate('/caixa')} />
    <section className="relative mt-8 overflow-hidden rounded-2xl bg-[#F3F0E8] px-5 py-7 text-[#102035] shadow-2xl sm:px-8"><div className="absolute inset-x-0 top-0 h-1 bg-ouro" /><div className="flex items-start justify-between gap-4 border-b border-dashed border-[#102035]/25 pb-5"><div><p className="font-display text-2xl font-extrabold">CHAVEIRO ABENÇOADO</p><p className="mt-1 text-xs text-[#102035]/60">Conferência de caixa</p></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${fechado ? 'bg-[#102035] text-white' : 'bg-[#F5B731] text-[#102035]'}`}>{fechado ? 'Fechado' : 'Parcial'}</span></div>
      <p className="py-4 text-center font-numero text-xs uppercase tracking-wider text-[#102035]/60">{formatarData(new Date(), { day: '2-digit', month: 'long', year: 'numeric' })}</p>
      <div className="border-y border-dashed border-[#102035]/25 py-2"><Linha label="Saldo de abertura" valor={caixa.valorAbertura} /><Linha label="Entradas" valor={caixa.totalEntradas} sinal="+" /><Linha label="Saídas" valor={caixa.totalSaidas} sinal="−" /></div>
      <div className="flex items-end justify-between gap-4 py-6"><span className="font-display text-lg font-bold">Saldo final</span><strong className="font-numero text-2xl sm:text-3xl">{formatarMoeda(caixa.saldoFinal)}</strong></div>
      <div className="grid grid-cols-2 border-t border-dashed border-[#102035]/25 pt-5 text-center"><div className="border-r border-[#102035]/15"><strong className="font-numero text-2xl">{caixa.totalServicos || 0}</strong><p className="mt-1 text-[10px] uppercase tracking-wider text-[#102035]/60">Serviços</p></div><div><strong className="font-numero text-2xl">{caixa.totalChaves || 0}</strong><p className="mt-1 text-[10px] uppercase tracking-wider text-[#102035]/60">Chaves cortadas</p></div></div>
      {caixa.observacao && <p className="mt-5 border-t border-dashed border-[#102035]/25 pt-4 text-xs text-[#102035]/70">Observação: {caixa.observacao}</p>}
    </section>
  </div></div>
}
function Linha({ label, valor, sinal = '' }) { return <div className="flex justify-between gap-4 py-2.5 text-sm"><span className="text-[#102035]/65">{label}</span><span className="font-numero font-semibold">{sinal} {formatarMoeda(valor)}</span></div> }
