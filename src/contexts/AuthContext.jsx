import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const dadosUsuario = localStorage.getItem('usuario')
    if (token && dadosUsuario) {
      setUsuario(JSON.parse(dadosUsuario))
    }
    setCarregando(false)
  }, [])

  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha })
    const { token, role, nome } = response.data

    const dadosUsuario = { nome, email, role }
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario))
    setUsuario(dadosUsuario)

    return dadosUsuario
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
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
