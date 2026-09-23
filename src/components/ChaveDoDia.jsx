import { useState } from 'react'
import { formatarMoeda } from '../utils/formatters'

const MAX_DENTES = 24
const BASE_Y = 102
const ALTURA_MIN = 8
const ALTURA_MAX = 48
const X_INICIO = 64
const X_FIM = 328

export default function ChaveDoDia({ servicos = [] }) {
  const [denteAtivo, setDenteAtivo] = useState(null)
  const total = servicos.length
  const cortes = servicos.slice(-MAX_DENTES)
  const maiorValor = Math.max(...cortes.map((s) => s.valorTotal || 0), 0)

  const passo = Math.min(20, (X_FIM - X_INICIO) / Math.max(cortes.length, 1))
  const larguraDente = Math.max(passo - 4, 3)

  function alturaDente(valor) {
    if (maiorValor <= 0) return ALTURA_MIN
    return ALTURA_MIN + ((valor || 0) / maiorValor) * (ALTURA_MAX - ALTURA_MIN)
  }

  function detalhesServico(servico) {
    const hora = new Date(servico.dataHora).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const quantidade = servico.quantidade || 1
    return {
      hora,
      nome: servico.tipoServicoNome || 'Serviço',
      resumo: `${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'} · ${formatarMoeda(servico.valorTotal)}`,
    }
  }

  const descricao = total === 0
    ? 'Perfil do dia: nenhum serviço registrado ainda'
    : `Perfil do dia: ${total} ${total === 1 ? 'serviço' : 'serviços'}, maior valor R$ ${maiorValor.toFixed(0)}`

  return (
    <div>
      <svg
        viewBox="0 0 340 140"
        className="w-full h-auto"
        role="img"
        aria-label={descricao}
      >
        {/* Cabeça da chave */}
        <circle
          cx="24"
          cy="109"
          r="19"
          fill="none"
          strokeWidth="6"
          className={total === 0 ? 'stroke-marinho-borda' : 'stroke-ouro'}
        />
        <circle cx="24" cy="109" r="7" className="fill-marinho" />

        {/* Pescoço + lâmina */}
        <rect x="42" y="103" width="22" height="12" rx="2" className="fill-marinho-borda" />
        <rect
          x="56"
          y={BASE_Y}
          width={X_FIM - 56 + 4}
          height="14"
          rx="3"
          className="fill-marinho-borda"
        />

        {/* Um dente por serviço — altura proporcional ao valor */}
        {cortes.map((servico, i) => {
          const h = alturaDente(servico.valorTotal)
          const id = servico.id ?? i
          const ativo = denteAtivo === id
          const x = X_INICIO + i * passo
          const detalhes = detalhesServico(servico)
          const tooltipX = Math.min(Math.max(x + larguraDente / 2 - 67, 4), 202)
          return (
            <g
              key={id}
              role="button"
              tabIndex="0"
              aria-label={`${detalhes.nome}, ${detalhes.hora}, ${detalhes.resumo}`}
              onMouseEnter={() => setDenteAtivo(id)}
              onMouseLeave={() => setDenteAtivo(null)}
              onFocus={() => setDenteAtivo(id)}
              onBlur={() => setDenteAtivo(null)}
              onClick={() => setDenteAtivo((atual) => atual === id ? null : id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setDenteAtivo((atual) => atual === id ? null : id)
                }
              }}
              className="cursor-pointer outline-none"
            >
              <rect
                x={x - 3}
                y={BASE_Y - h - 4}
                width={larguraDente + 6}
                height={h + 8}
                fill="transparent"
              />
              <rect
                x={x}
                y={BASE_Y - h}
                width={larguraDente}
                height={h}
                rx="1.5"
                className={`animate-cortar transition-colors ${ativo ? 'fill-texto' : 'fill-ouro'}`}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'bottom',
                  animationDelay: `${i * 30}ms`,
                }}
              />

              {ativo && (
                <foreignObject x={tooltipX} y="2" width="134" height="52" className="pointer-events-none overflow-visible">
                  <div className="rounded-lg border border-ouro/40 bg-marinho px-2.5 py-2 shadow-flutuante">
                    <p className="truncate text-[9px] font-semibold text-texto">{detalhes.nome}</p>
                    <p className="mt-0.5 truncate text-[8px] text-texto-secundario">
                      {detalhes.hora} · {detalhes.resumo}
                    </p>
                  </div>
                </foreignObject>
              )}
            </g>
          )
        })}
      </svg>

      <div className="mt-2 flex items-baseline justify-between gap-3">
        {total === 0 ? (
          <p className="font-body text-xs text-texto-secundario">
            A lâmina ainda está lisa.
          </p>
        ) : (
          <>
            <p className="font-body text-[11px] text-texto-secundario">
              {total > MAX_DENTES ? `últimos ${MAX_DENTES} de ${total} serviços` : `${total} ${total === 1 ? 'serviço' : 'serviços'} hoje`}
            </p>
            <p className="font-body text-[11px] text-texto-secundario">
              maior{' '}
              <span className="font-numero font-semibold text-texto">
                R$ {maiorValor.toFixed(0)}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
