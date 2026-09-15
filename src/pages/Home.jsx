import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { House } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ChaveDoDia from '../components/ChaveDoDia'
import GoldButton from '../components/GoldButton'
import api from '../services/api'

const PAGAMENTO = {
  DINHEIRO: 'dinheiro',
  PIX: 'pix',
  CARTAO_DEBITO: 'cartão débito',
  CARTAO_CREDITO: 'cartão crédito',
}

export default function Home() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [caixa, setCaixa] = useState(null)
  const [servicos, setServicos] = useState([])
  const [carregando, setCarregando] = useState(true)

  const hoje = new Date()
  const saudacao = hoje.getHours() < 12 ? 'Bom dia' : hoje.getHours() < 18 ? 'Boa tarde' : 'Boa noite'
  const dataFormatada = hoje.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    // Data local: toISOString() converte para UTC e viraria o dia seguinte após as 21h no Brasil
    const dataHoje = [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, '0'),
      String(hoje.getDate()).padStart(2, '0'),
    ].join('-')

    const [resCaixa, resServicos] = await Promise.allSettled([
      api.get('/caixa/hoje'),
      api.get(`/servicos?data=${dataHoje}`),
    ])

    if (resCaixa.status === 'fulfilled') setCaixa(resCaixa.value.data)
    if (resServicos.status === 'fulfilled') setServicos(resServicos.value.data)
    setCarregando(false)
  }

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Usuário'
  const totalChaves = caixa?.totalChaves || 0
  const totalEntradas = caixa?.totalEntradas || 0
  const totalSaidas = caixa?.totalSaidas || 0
  const saldoFinal = caixa?.saldoFinal || 0

  const ordenados = [...servicos].sort(
    (a, b) => new Date(a.dataHora) - new Date(b.dataHora)
  )
  const recentes = [...ordenados].reverse().slice(0, 6)

  if (carregando) {
    return (
      <div className="min-h-screen bg-marinho flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marinho pb-32 px-5 pt-6">
      <StatusCaixa caixa={caixa} onAbrir={() => navigate('/caixa')} />

      <header className="mt-5">
        <p className="font-body text-sm text-texto-secundario">{saudacao},</p>
        <h1 className="font-display font-extrabold text-3xl text-texto tracking-tight leading-none mt-1">
          {primeiroNome.toUpperCase()}
        </h1>
        <p className="font-body text-xs text-texto-secundario mt-1.5">{dataFormatada}</p>
      </header>

      <div className="mt-8 flex items-end gap-3.5">
        <span className="font-display font-extrabold text-7xl leading-[0.78] text-texto">
          {totalChaves}
        </span>
        <span className="font-display font-bold text-[11px] uppercase tracking-[0.18em] text-texto-secundario leading-tight pb-1.5">
          chaves
          <br />
          cortadas
        </span>
      </div>

      <div className="mt-7">
        <ChaveDoDia servicos={ordenados} />
      </div>

      <div className="mt-6 pt-4 border-t border-marinho-borda grid grid-cols-3 gap-2">
        <Dado valor={totalEntradas} rotulo="entrou" cor="text-sucesso" />
        <Dado valor={totalSaidas} rotulo="saiu" cor="text-erro" />
        <Dado valor={saldoFinal} rotulo="em caixa" cor="text-ouro" />
      </div>

      {ordenados.length === 0 ? (
        <div className="mt-8">
          <p className="font-body text-sm text-texto-secundario">
            Registre o primeiro serviço do dia.
          </p>
          <GoldButton onClick={() => navigate('/servicos/registrar')} className="mt-4">
            Registrar serviço
          </GoldButton>
        </div>
      ) : (
        <section className="mt-8">
          <h2 className="font-display font-bold text-[11px] uppercase tracking-[0.18em] text-texto-secundario">
            Movimento
          </h2>
          <div className="mt-1">
            {recentes.map((servico) => (
              <LinhaServico key={servico.id} servico={servico} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function StatusCaixa({ caixa, onAbrir }) {
  if (!caixa) {
    return (
      <button
        onClick={onAbrir}
        className="flex items-center gap-2 text-ouro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ouro rounded"
      >
        <span className="w-1.5 h-1.5 rounded-full border border-ouro" />
        <span className="font-body text-xs">Caixa não aberto hoje — abrir</span>
      </button>
    )
  }

  const aberto = caixa.status === 'ABERTO'

  return (
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${aberto ? 'bg-sucesso' : 'bg-texto-terciario'}`} />
      <span className="font-body text-xs text-texto-secundario">
        Caixa {aberto ? 'aberto' : 'fechado'}
        {caixa.valorAbertura > 0 && (
          <>
            {' · abertura '}
            <span className="font-numero">R$ {caixa.valorAbertura.toFixed(0)}</span>
          </>
        )}
      </span>
    </div>
  )
}

function Dado({ valor, rotulo, cor }) {
  return (
    <div>
      <p className={`font-numero font-semibold text-base ${cor}`}>R$ {valor.toFixed(0)}</p>
      <p className="font-body text-[10px] text-texto-secundario mt-0.5">{rotulo}</p>
    </div>
  )
}

function LinhaServico({ servico }) {
  const hora = new Date(servico.dataHora).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const pendente = servico.statusPagamento === 'PENDENTE'
  const pagamento = PAGAMENTO[servico.formaPagamento] || servico.formaPagamento?.toLowerCase()

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5">
      <span className="font-numero text-[11px] text-texto-secundario w-10 flex-shrink-0">
        {hora}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-texto truncate flex items-center gap-1.5">
          <span className="truncate">{servico.tipoServicoNome}</span>
          {servico.domicilio && (
            <House size={11} className="text-texto-secundario flex-shrink-0" aria-label="a domicílio" />
          )}
        </p>
        <p className="font-body text-[10px] text-texto-secundario mt-0.5">
          {pagamento}
          {pendente && <span className="text-ouro"> · pendente</span>}
        </p>
      </div>

      {servico.quantidade > 1 && (
        <span className="font-numero text-[11px] text-texto-secundario flex-shrink-0">
          ×{servico.quantidade}
        </span>
      )}

      <span className="font-numero font-semibold text-sm text-ouro flex-shrink-0">
        R$ {servico.valorTotal?.toFixed(0) || '0'}
      </span>
    </div>
  )
}
