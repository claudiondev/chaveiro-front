import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from './AuthContext'
import { guiaDaRota } from '../help/helpCatalog'
import { devePrevalecer } from '../help/precedencia'
import { lerJson, escreverJson } from '../utils/armazenamentoSeguro'
import HelpPanel from '../components/help/HelpPanel'
import GuidedTour from '../components/help/GuidedTour'
import HelpWelcome from '../components/help/HelpWelcome'
import HelpNudge from '../components/help/HelpNudge'

const HelpContext = createContext()
const VERSAO_APRESENTACAO = 1

const chaveConfirmados = (email) => `ajuda-progressos:${email}`
const chavePendentes = (email) => `ajuda-pendentes:${email}`

export function HelpProvider({ children }) {
  const { usuario } = useAuth()
  const location = useLocation()
  // Confirmados: última resposta aceita do servidor (ou o cache dela). Pendentes:
  // mudanças feitas localmente que ainda não foram confirmadas — sobrevivem a reload
  // (persistidas à parte) e são reenviadas ao reconectar ou reautenticar.
  const [confirmados, setConfirmados] = useState({})
  const [pendentes, setPendentes] = useState({})
  const [carregado, setCarregado] = useState(false)
  const [painelAberto, setPainelAberto] = useState(false)
  const [tour, setTour] = useState(null)
  const [mostrarApresentacao, setMostrarApresentacao] = useState(false)
  const apresentacaoAvaliada = useRef(null)
  // Incrementado a cada troca de usuário: uma resposta assíncrona de uma sessão anterior
  // (ex: trocou de conta rápido no mesmo aparelho) é descartada em vez de aplicada aqui.
  const sessaoRef = useRef(0)
  const guiaAtual = useMemo(
    () => guiaDaRota(location.pathname, usuario?.role),
    [location.pathname, usuario?.role]
  )

  useEffect(() => {
    setPainelAberto(false)
    setTour(null)
  }, [location.pathname])

  useEffect(() => {
    sessaoRef.current += 1
    const minhaSessao = sessaoRef.current

    if (!usuario) {
      setConfirmados({})
      setPendentes({})
      setCarregado(false)
      setMostrarApresentacao(false)
      apresentacaoAvaliada.current = null
      return
    }

    const email = usuario.email
    const cachePendentes = lerJson(chavePendentes(email), {})
    setConfirmados(lerJson(chaveConfirmados(email), {}))
    setPendentes(cachePendentes)
    setCarregado(false)

    api.get('/ajuda/progressos')
      .then(({ data }) => {
        if (sessaoRef.current !== minhaSessao) return
        const remotos = Object.fromEntries(data.map((item) => [item.guia, item]))
        setConfirmados(remotos)
        escreverJson(chaveConfirmados(email), remotos)

        // Reconcilia: uma pendência só sobrevive se ainda "vencer" o que o servidor tem
        // agora (senão o servidor já reflete essa mudança, ou algo mais novo a superou).
        const restantes = Object.fromEntries(
          Object.entries(cachePendentes).filter(([id, pendente]) => devePrevalecer(remotos[id], pendente))
        )
        setPendentes(restantes)
        escreverJson(chavePendentes(email), restantes)

        Object.entries(restantes).forEach(([id, pendente]) => reenviar(email, id, pendente, minhaSessao))
      })
      .catch(() => {})
      .finally(() => { if (sessaoRef.current === minhaSessao) setCarregado(true) })
  }, [usuario])

  // Reenvia pendências assim que a conexão volta
  useEffect(() => {
    function aoReconectar() {
      if (!usuario) return
      Object.entries(pendentes).forEach(([id, pendente]) => reenviar(usuario.email, id, pendente, sessaoRef.current))
    }
    window.addEventListener('online', aoReconectar)
    return () => window.removeEventListener('online', aoReconectar)
  }, [usuario, pendentes])

  useEffect(() => {
    if (!usuario || !carregado || location.pathname !== '/') return
    if (apresentacaoAvaliada.current === usuario.email) return
    apresentacaoAvaliada.current = usuario.email
    const progresso = progressoEfetivo('APRESENTACAO')
    if (!progresso || progresso.versao < VERSAO_APRESENTACAO) setMostrarApresentacao(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carregado, location.pathname, usuario])

  // Estado que a UI enxerga: pendente vence o confirmado quando ainda é o mais atual
  function progressoEfetivo(id) {
    const pendente = pendentes[id]
    const confirmado = confirmados[id]
    if (pendente && devePrevalecer(confirmado, pendente)) return pendente
    return confirmado
  }

  function aplicarConfirmacao(email, itemConfirmado, pendenteEnviado, minhaSessao) {
    if (sessaoRef.current !== minhaSessao) return // sessão trocou enquanto a chamada estava no ar
    setConfirmados((atuais) => {
      if (!devePrevalecer(atuais[itemConfirmado.guia], itemConfirmado)) return atuais
      const novos = { ...atuais, [itemConfirmado.guia]: itemConfirmado }
      escreverJson(chaveConfirmados(email), novos)
      return novos
    })
    setPendentes((atuais) => {
      const atual = atuais[itemConfirmado.guia]
      if (!atual || atual.atualizadoEm !== pendenteEnviado.atualizadoEm) return atuais
      const { [itemConfirmado.guia]: _removido, ...resto } = atuais
      escreverJson(chavePendentes(email), resto)
      return resto
    })
  }

  // Tenta confirmar uma pendência no servidor; erro de rede/servidor não propaga —
  // o item continua pendente, persistido, pra tentar de novo mais tarde.
  function reenviar(email, id, pendente, minhaSessao) {
    api.put(`/ajuda/progressos/${id}`, { versao: pendente.versao, status: pendente.status })
      .then(({ data }) => aplicarConfirmacao(email, data, pendente, minhaSessao))
      .catch(() => {})
  }

  function salvarProgresso(id, versao, status) {
    if (!usuario) return
    const email = usuario.email
    const minhaSessao = sessaoRef.current
    const item = { guia: id, versao, status, atualizadoEm: new Date().toISOString() }

    setPendentes((atuais) => {
      const novos = { ...atuais, [id]: item }
      escreverJson(chavePendentes(email), novos)
      return novos
    })

    reenviar(email, id, item, minhaSessao)
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

  const progressoAtual = guiaAtual ? progressoEfetivo(guiaAtual.id) : null
  const guiaPendente = guiaAtual && (!progressoAtual || progressoAtual.versao < guiaAtual.versao)
  const etapasTour = tour?.guia.etapas.filter((etapa) => !etapa.role || etapa.role === usuario?.role) || []
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
