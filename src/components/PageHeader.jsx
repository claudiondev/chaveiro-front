import { ChevronLeft } from 'lucide-react'

export default function PageHeader({ titulo, subtitulo, onBack, acao }) {
  return (
    <header className="flex items-start gap-3">
      {onBack && <button onClick={onBack} aria-label="Voltar" className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-marinho-borda text-texto hover:bg-marinho-claro"><ChevronLeft size={19} /></button>}
      <div className="min-w-0 flex-1">
        <p className="section-label">Balcão de trabalho</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-none text-texto lg:text-4xl">{titulo}</h1>
        {subtitulo && <p className="mt-2 max-w-2xl text-sm text-texto-secundario">{subtitulo}</p>}
      </div>
      {acao}
    </header>
  )
}
