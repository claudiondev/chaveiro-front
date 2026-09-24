import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from './AuthContext'
import { guiaDaRota } from '../help/helpCatalog'
import HelpPanel from '../components/help/HelpPanel'
import GuidedTour from '../components/help/GuidedTour'
import HelpWelcome from '../components/help/HelpWelcome'
import HelpNudge from '../components/help/HelpNudge'

const HelpContext = createContext()
const VERSAO_APRESENTACAO = 1

export function HelpProvider({ children }) {
  const { usuario } = useAuth()
  const location = useLocation()
  const [progressos, setProgressos] = useState({})
  const [carregado, setCarregado] = useState(false)
  const [painelAberto, setPainelAberto] = useState(false)
  const [tour, setTour] = useState(null)
  const [mostrarApresentacao, setMostrarApresentacao] = useState(false)
  const apresentacaoAvaliada = useRef(null)
  const guiaAtual = useMemo(
    () => guiaDaRota(location.pathname, usuario?.role),
    [location.pathname, usuario?.role]
  )

  useEffect(() => {
    setPainelAberto(false)
    setTour(null)
  }, [location.pathname])

  useEffect(() => {
    if (!usuario) {
      setProgressos({})
      setCarregado(false)
      setMostrarApresentacao(false)
      apresentacaoAvaliada.current = null
      return
    }

    const chaveCache = `ajuda-progressos:${usuario.email}`
    let cache = {}
    try { cache = JSON.parse(localStorage.getItem(chaveCache) || '{}') } catch { cache = {} }
    setProgressos(cache)
    setCarregado(false)

    let ativo = true
    api.get('/ajuda/progressos')
      .then(({ data }) => {
        if (!ativo) return
        const remotos = Object.fromEntries(data.map((item) => [item.guia, item]))
        setProgressos(remotos)
        localStorage.setItem(chaveCache, JSON.stringify(remotos))
      })
      .catch(() => {})
      .finally(() => ativo && setCarregado(true))
    return () => { ativo = false }
  }, [usuario])

  useEffect(() => {
    if (!usuario || !carregado || location.pathname !== '/') return
    if (apresentacaoAvaliada.current === usuario.email) return
    apresentacaoAvaliada.current = usuario.email
    const progresso = progressos.APRESENTACAO
    if (!progresso || progresso.versao < VERSAO_APRESENTACAO) setMostrarApresentacao(true)
  }, [carregado, location.pathname, progressos, usuario])

  async function salvarProgresso(id, versao, status) {
    if (!usuario) return
    const item = { guia: id, versao, status, atualizadoEm: new Date().toISOString() }
    const atualizados = { ...progressos, [id]: item }
    setProgressos(atualizados)
    localStorage.setItem(`ajuda-progressos:${usuario.email}`, JSON.stringify(atualizados))
    try {
      const response = await api.put(`/ajuda/progressos/${id}`, { versao, status })
      setProgressos((atuais) => ({ ...atuais, [id]: response.data }))
    } catch {
      // O cache local mantém a ajuda funcional durante falhas de conexão.
    }
  }

  function iniciarTour(guia = guiaAtual) {
    if (!guia) return
    setPainelAberto(false)
    setTour({ guia, etapa: 0 })
  }

  function concluirTour() {
    if (tour?.guia) salvarProgresso(tour.guia.id, tour.guia.versao, 'CONCLUIDO')
    setTour(null)
  }

  function dispensarGuia() {
    if (guiaAtual) salvarProgresso(guiaAtual.id, guiaAtual.versao, 'DISPENSADO')
  }

  const progressoAtual = guiaAtual ? progressos[guiaAtual.id] : null
  const guiaPendente = guiaAtual && (!progressoAtual || progressoAtual.versao < guiaAtual.versao)
  const etapasTour = tour?.guia.etapas.filter((etapa) => !etapa.role || etapa.role === usuario?.role) || []
  // Nudge não é modal (não bloqueia a tela); os outros três são — enquanto qualquer um
  // deles está aberto, o resto do app (inclusive o aviso de instalar o PWA) fica inert:
  // não recebe clique nem Tab, então não compete pelo foco com o diálogo de ajuda.
  const modalAberto = mostrarApresentacao || painelAberto || !!tour

  const valor = {
    guiaAtual,
    abrirAjuda: () => guiaAtual && setPainelAberto(true),
    iniciarTour,
  }

  return (
    <HelpContext.Provider value={valor}>
      <div inert={modalAberto ? '' : undefined}>{children}</div>
      {painelAberto && guiaAtual && <HelpPanel guia={guiaAtual} onClose={() => setPainelAberto(false)} onStart={() => iniciarTour()} />}
      {tour && <GuidedTour etapas={etapasTour} etapa={tour.etapa} onChange={(etapa) => setTour({ ...tour, etapa })} onClose={() => setTour(null)} onComplete={concluirTour} />}
      {mostrarApresentacao && guiaAtual && <HelpWelcome
        onStart={() => { setMostrarApresentacao(false); salvarProgresso('APRESENTACAO', VERSAO_APRESENTACAO, 'CONCLUIDO'); iniciarTour() }}
        onDismiss={() => { setMostrarApresentacao(false); salvarProgresso('APRESENTACAO', VERSAO_APRESENTACAO, 'DISPENSADO') }}
      />}
      {!modalAberto && carregado && guiaPendente && <HelpNudge guia={guiaAtual} onStart={() => iniciarTour()} onDismiss={dispensarGuia} />}
    </HelpContext.Provider>
  )
}

export function useHelp() {
  const context = useContext(HelpContext)
  if (!context) throw new Error('useHelp deve ser usado dentro de HelpProvider')
  return context
}
