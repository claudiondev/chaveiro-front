import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Lock, Stamp, Radio, Wrench } from 'lucide-react'
import Card from '../components/Card'
import Chip from '../components/Chip'
import api from '../services/api'

const ICONES_CATEGORIA = {
  CHAVE: KeyRound,
  FECHADURA: Lock,
  CARIMBO: Stamp,
  CONTROLE: Radio,
  OUTROS: Wrench,
}

const CATEGORIAS = ['Todos', 'CHAVE', 'FECHADURA', 'CONTROLE', 'CARIMBO']

export default function Precos() {
  const [tipos, setTipos] = useState([])
  const [categoria, setCategoria] = useState('Todos')
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    carregarTipos()
  }, [])

  async function carregarTipos() {
    try {
      const response = await api.get('/tipos-servico')
      setTipos(response.data)
    } catch (err) {
      // fallback silencioso
    } finally {
      setCarregando(false)
    }
  }

  const filtrados = categoria === 'Todos'
    ? tipos
    : tipos.filter((t) => t.categoria === categoria)

  const labelCategoria = (cat) => {
    const labels = { Todos: 'Todos', CHAVE: 'Chaves', FECHADURA: 'Fechaduras', CONTROLE: 'Controles', CARIMBO: 'Carimbos' }
    return labels[cat] || cat
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-marinho flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marinho pb-24">
      {/* Header */}
      <div className="px-5 pt-6 flex justify-between items-center">
        <h1 className="font-display font-bold text-xl text-texto">TABELA DE PREÇOS</h1>
        <button
          onClick={() => navigate('/servicos/registrar')}
          className="bg-ouro-fosco border border-ouro rounded-xl px-3.5 py-2 text-ouro text-sm font-display font-semibold"
        >
          + Registrar
        </button>
      </div>

      {/* Chips de categoria */}
      <div className="flex gap-2 px-5 mt-4 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIAS.map((cat) => (
          <Chip
            key={cat}
            label={labelCategoria(cat)}
            ativo={categoria === cat}
            onClick={() => setCategoria(cat)}
          />
        ))}
      </div>

      {/* Grid de serviços */}
      <div className="grid grid-cols-2 gap-2.5 px-5 mt-4">
        {filtrados.map((tipo) => {
          const Icon = ICONES_CATEGORIA[tipo.categoria] || Wrench
          return (
            <Card
              key={tipo.id}
              className="border-l-[3px] border-l-ouro"
              onClick={() => navigate('/servicos/registrar', { state: { tipoId: tipo.id } })}
            >
              <div className="text-ouro/60 mb-2">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <p className="text-texto-secundario text-xs font-body leading-snug mb-1">
                {tipo.nome}
              </p>
              <p className="font-numero font-bold text-lg text-ouro">
                R$ {tipo.preco?.toFixed(0)}
              </p>
              {tipo.precoExterno > 0 && (
                <p className="text-texto-terciario text-[10px] font-body mt-0.5">
                  externo: R$ {tipo.precoExterno.toFixed(0)}
                </p>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
