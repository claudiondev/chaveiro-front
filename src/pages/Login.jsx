import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import GoldButton from '../components/GoldButton'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [logoErro, setLogoErro] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await login(email, senha)
      navigate('/')
    } catch (err) {
      const mensagem = err.response?.data?.erro || 'Erro ao fazer login'
      setErro(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-marinho relative overflow-hidden flex flex-col">
      {/* Círculos decorativos */}
      <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full border border-ouro-fosco" />
      <div className="absolute -top-10 -right-5 w-36 h-36 rounded-full border border-ouro/5" />

      <div className="flex-1 px-7 pt-16 max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          {!logoErro ? (
            <img
              src="/logo.png"
              alt="Chaveiro Abençoado"
              className="w-44 h-44 mx-auto object-contain mb-4"
              onError={() => setLogoErro(true)}
            />
          ) : (
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-ouro-fosco border-2 border-ouro
              flex items-center justify-center">
              <KeyRound size={36} className="text-ouro" />
            </div>
          )}
          <h1 className="font-display font-extrabold text-2xl text-texto tracking-tight">
            CHAVEIRO ABENÇOADO
          </h1>
          <p className="text-texto-secundario text-sm mt-1 font-body">
            Gestão profissional do seu negócio
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-texto-secundario text-xs font-medium mb-1.5 tracking-wider font-body">
              E-MAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full bg-marinho-claro border-2 border-marinho-borda rounded-xl px-4 py-4
                text-texto font-body text-base
                focus:border-ouro placeholder:text-texto-terciario"
            />
          </div>

          <div>
            <label className="block text-texto-secundario text-xs font-medium mb-1.5 tracking-wider font-body">
              SENHA
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-marinho-claro border-2 border-marinho-borda rounded-xl px-4 py-4
                text-texto font-body text-base
                focus:border-ouro placeholder:text-texto-terciario"
            />
          </div>

          {erro && (
            <p className="text-erro text-sm font-body text-center">{erro}</p>
          )}

          <div className="mt-2">
            <GoldButton tipo="submit" desabilitado={carregando}>
              {carregando ? 'Entrando...' : 'ENTRAR'}
            </GoldButton>
          </div>
        </form>

        <p className="text-texto-terciario text-xs mt-10 text-center font-body">
          v1.0.0 · Chaveiro Abençoado
        </p>
      </div>
    </div>
  )
}
