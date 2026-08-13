export default function KeyCounter({ totalChaves = 0, entradas = 0, saidas = 0, saldo = 0 }) {
  return (
    <div className="bg-marinho-claro border border-marinho-borda rounded-card p-5 text-center relative overflow-hidden">
      {/* Linha decorativa dourada no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-transparent via-ouro to-transparent" />

      <p className="text-[11px] text-texto-secundario tracking-widest font-body">
        CHAVES CORTADAS HOJE
      </p>
      <p className="font-numero font-bold text-5xl text-ouro leading-tight mt-1 text-shadow-gold">
        {totalChaves}
      </p>

      {/* Stats do dia */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/5">
        <div className="text-center">
          <p className="font-numero font-bold text-base text-sucesso">
            R$ {entradas.toFixed(0)}
          </p>
          <p className="text-[10px] text-texto-terciario font-body mt-0.5">entradas</p>
        </div>
        <div className="text-center">
          <p className="font-numero font-bold text-base text-erro">
            R$ {saidas.toFixed(0)}
          </p>
          <p className="text-[10px] text-texto-terciario font-body mt-0.5">saídas</p>
        </div>
        <div className="text-center">
          <p className="font-numero font-bold text-base text-ouro">
            R$ {saldo.toFixed(0)}
          </p>
          <p className="text-[10px] text-texto-terciario font-body mt-0.5">caixa</p>
        </div>
      </div>
    </div>
  )
}
