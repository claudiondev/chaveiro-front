import { AlertTriangle, RotateCcw } from 'lucide-react'

export function LoadingState({ texto = 'Carregando dados' }) {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 text-texto-secundario" role="status">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-ouro border-t-transparent" />
      <span className="text-sm">{texto}</span>
    </div>
  )
}

export function ErrorState({ mensagem = 'Não foi possível carregar os dados.', onRetry }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
      <AlertTriangle className="text-ouro" size={28} />
      <p className="mt-3 text-sm text-texto">{mensagem}</p>
      <p className="mt-1 max-w-sm text-xs text-texto-secundario">Confira sua conexão e tente novamente.</p>
      {onRetry && <button onClick={onRetry} className="mt-5 flex items-center gap-2 rounded-xl border border-marinho-borda px-4 py-2.5 text-sm font-semibold text-ouro"><RotateCcw size={15} /> Tentar novamente</button>}
    </div>
  )
}
