import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { encerrarSessaoLocal } from '../utils/sessao'
import { escreverJson, escreverTexto, lerJson, lerTexto } from '../utils/armazenamentoSeguro'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = lerTexto('token')
    const dadosUsuario = lerJson('usuario', null)
    if (token && dadosUsuario) {
      setUsuario(dadosUsuario)
    }
    setCarregando(false)
  }, [])

  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha })
    const { token, role, nome } = response.data

    const dadosUsuario = { nome, email, role }
    escreverTexto('token', token)
    escreverJson('usuario', dadosUsuario)
    setUsuario(dadosUsuario)

    return dadosUsuario
  }

  function logout() {
    encerrarSessaoLocal()
    setUsuario(null)
  }

  function isDono() {
    return usuario?.role === 'DONO'
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout, isDono }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
