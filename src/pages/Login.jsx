import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import GoldButton from '../components/GoldButton'

export default function Login() {
  const [email, setEmail] = useState(''); const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(''); const [carregando, setCarregando] = useState(false); const [logoErro, setLogoErro] = useState(false)
  const { login } = useAuth(); const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault(); if (carregando) return
    setErro(''); setCarregando(true)
    try { await login(email, senha); navigate('/') }
    catch (err) { setErro(err.response?.data?.erro || 'E-mail ou senha não conferem. Tente novamente.') }
    finally { setCarregando(false) }
  }

  return <div className="min-h-screen bg-marinho px-5 py-10 sm:px-8"><div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-12 lg:grid-cols-[1fr_420px]">
    <section className="hidden lg:block"><p className="section-label">Balcão de trabalho</p><h1 className="mt-4 max-w-xl font-display text-6xl font-extrabold leading-[0.92] text-texto">O movimento da loja, do primeiro corte ao fechamento.</h1><div className="mt-10 h-px max-w-sm bg-marinho-borda"><div className="h-px w-28 bg-ouro" /></div></section>
    <main className="w-full"><div className="mb-9 flex items-center gap-4">{!logoErro ? <img src="/logo.png" alt="Chaveiro Abençoado" onError={() => setLogoErro(true)} className="h-20 w-20 object-contain" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ouro-fosco text-ouro"><KeyRound size={30} /></div>}<div><p className="font-display text-2xl font-extrabold leading-none text-texto">CHAVEIRO</p><p className="font-display text-base font-bold tracking-[0.2em] text-ouro">ABENÇOADO</p></div></div>
      <div className="border-t border-marinho-borda pt-7"><h2 className="font-display text-3xl font-bold text-texto">Acesso da equipe</h2><p className="mt-2 text-sm text-texto-secundario">Entre para registrar serviços e acompanhar o caixa.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5"><div><label htmlFor="login-email" className="mb-2 block text-xs font-medium text-texto-secundario">E-mail</label><input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="seu@email.com" className="field" required /></div><div><label htmlFor="login-senha" className="mb-2 block text-xs font-medium text-texto-secundario">Senha</label><input id="login-senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" placeholder="Sua senha" className="field" required /></div>{erro && <p className="rounded-xl border border-erro/30 bg-erro/10 px-4 py-3 text-sm text-erro" role="alert">{erro}</p>}<GoldButton tipo="submit" desabilitado={carregando}>{carregando ? 'Entrando…' : 'Entrar'}</GoldButton></form>
      </div><p className="mt-8 text-center text-[10px] uppercase tracking-wider text-texto-terciario">Uso interno · Chaveiro Abençoado</p>
    </main>
  </div></div>
}
