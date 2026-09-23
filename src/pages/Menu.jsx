import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, ChevronRight, ClipboardList, ListChecks, LogOut, UserPlus, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import GoldButton from '../components/GoldButton'
import PageHeader from '../components/PageHeader'
import api from '../services/api'

export default function Menu() {
  const { usuario, isDono, logout } = useAuth()
  const navigate = useNavigate()
  const [cadastro, setCadastro] = useState(false)
  const [nome, setNome] = useState(''); const [email, setEmail] = useState(''); const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(''); const [sucesso, setSucesso] = useState(''); const [enviando, setEnviando] = useState(false)
  const inicial = usuario?.nome?.trim()?.charAt(0)?.toUpperCase() || 'U'

  async function handleCadastro(event) {
    event.preventDefault(); if (enviando) return
    setEnviando(true); setErro(''); setSucesso('')
    try { await api.post('/auth/cadastro', { nome, email, senha }); setSucesso(`${nome} agora tem acesso à equipe.`); setNome(''); setEmail(''); setSenha('') }
    catch (err) { setErro(err.response?.data?.erro || 'Não foi possível cadastrar o funcionário.') }
    finally { setEnviando(false) }
  }
  function sair() { logout(); navigate('/login') }

  return <div className="page-shell"><div className="page-content max-w-4xl"><PageHeader titulo="Equipe e administração" subtitulo="Acessos, relatórios e rotinas do Chaveiro Abençoado." />
    <section className="mt-8 flex items-center gap-4 border-y border-marinho-borda py-5"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-ouro font-display text-xl font-bold text-marinho">{inicial}</div><div className="min-w-0 flex-1"><p className="truncate font-medium text-texto">{usuario?.nome}</p><p className="truncate text-xs text-texto-secundario">{usuario?.email}</p></div><span className="text-[10px] font-bold uppercase tracking-wider text-ouro">{usuario?.role === 'DONO' ? 'Dono' : 'Funcionário'}</span></section>
    <div className="mt-8 grid gap-8 md:grid-cols-2"><section><h2 className="section-label">Operação</h2><div className="mt-3 divide-y divide-white/5 border-y border-marinho-borda"><Item icon={ListChecks} label="Tabela de serviços" descricao="Preços do balcão e externos" onClick={() => navigate('/servicos')} />{isDono() && <Item icon={ClipboardList} label="Fechamento do dia" descricao="Conferir o caixa" onClick={() => navigate('/fechamento')} />}</div></section>{isDono() && <section><h2 className="section-label">Administração</h2><div className="mt-3 divide-y divide-white/5 border-y border-marinho-borda"><Item icon={BarChart3} label="Relatórios" descricao="Movimento por período" onClick={() => navigate('/relatorios')} /><Item icon={UserPlus} label="Cadastrar funcionário" descricao="Criar acesso para a equipe" onClick={() => setCadastro(true)} /></div></section>}</div>
    {cadastro && <section className="mt-8 rounded-2xl border border-marinho-borda bg-marinho-claro/60 p-5"><div className="flex items-center justify-between"><div><h2 className="font-display text-xl font-bold text-texto">Novo acesso da equipe</h2><p className="mt-1 text-xs text-texto-secundario">Cadastre os dados que o funcionário usará para entrar.</p></div><button onClick={() => { setCadastro(false); setErro(''); setSucesso('') }} aria-label="Fechar cadastro" className="text-texto-secundario"><X size={19} /></button></div><form onSubmit={handleCadastro} className="mt-5 grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><label htmlFor="nome" className="mb-2 block text-xs text-texto-secundario">Nome completo</label><input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="field" required /></div><div><label htmlFor="email" className="mb-2 block text-xs text-texto-secundario">E-mail</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" required /></div><div><label htmlFor="senha" className="mb-2 block text-xs text-texto-secundario">Senha (mínimo 8 caracteres)</label><input id="senha" type="password" minLength="8" value={senha} onChange={(e) => setSenha(e.target.value)} className="field" required /></div>{erro && <p className="text-sm text-erro sm:col-span-2">{erro}</p>}{sucesso && <p className="text-sm text-sucesso sm:col-span-2">{sucesso}</p>}<GoldButton tipo="submit" desabilitado={enviando} className="sm:col-span-2">{enviando ? 'Cadastrando…' : 'Cadastrar funcionário'}</GoldButton></form></section>}
    <button onClick={sair} className="mt-10 flex items-center gap-2 text-sm font-semibold text-erro"><LogOut size={16} /> Sair da conta</button>
  </div></div>
}
function Item({ icon: Icon, label, descricao, onClick }) { return <button onClick={onClick} className="group flex w-full items-center gap-3 py-4 text-left"><Icon size={18} className="text-ouro" /><span className="flex-1"><strong className="block text-sm font-medium text-texto">{label}</strong><span className="mt-0.5 block text-xs text-texto-secundario">{descricao}</span></span><ChevronRight size={17} className="text-texto-terciario group-hover:text-ouro" /></button> }
