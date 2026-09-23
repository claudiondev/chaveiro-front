const MAX_DENTES = 24
const BASE_Y = 62
const ALTURA_MIN = 8
const ALTURA_MAX = 48
const X_INICIO = 64
const X_FIM = 328

export default function ChaveDoDia({ servicos = [] }) {
  const total = servicos.length
  const cortes = servicos.slice(-MAX_DENTES)
  const maiorValor = Math.max(...cortes.map((s) => s.valorTotal || 0), 0)

  const passo = Math.min(20, (X_FIM - X_INICIO) / Math.max(cortes.length, 1))
  const larguraDente = Math.max(passo - 4, 3)

  function alturaDente(valor) {
    if (maiorValor <= 0) return ALTURA_MIN
    return ALTURA_MIN + ((valor || 0) / maiorValor) * (ALTURA_MAX - ALTURA_MIN)
  }

  const descricao = total === 0
    ? 'Perfil do dia: nenhum serviço registrado ainda'
    : `Perfil do dia: ${total} ${total === 1 ? 'serviço' : 'serviços'}, maior valor R$ ${maiorValor.toFixed(0)}`

  return (
    <div>
      <svg
        viewBox="0 0 340 100"
        className="w-full h-auto"
        role="img"
        aria-label={descricao}
      >
        {/* Cabeça da chave */}
        <circle
          cx="24"
          cy="69"
          r="19"
          fill="none"
          strokeWidth="6"
          className={total === 0 ? 'stroke-marinho-borda' : 'stroke-ouro'}
        />
        <circle cx="24" cy="69" r="7" className="fill-marinho" />

        {/* Pescoço + lâmina */}
        <rect x="42" y="63" width="22" height="12" rx="2" className="fill-marinho-borda" />
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
          return (
            <rect
              key={servico.id ?? i}
              x={X_INICIO + i * passo}
              y={BASE_Y - h}
              width={larguraDente}
              height={h}
              rx="1.5"
              className="fill-ouro animate-cortar"
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'bottom',
                animationDelay: `${i * 30}ms`,
              }}
            />
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
