import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Protege rotas que exigem autenticação
export default function ProtectedRoute({ children, apenaDono = false }) {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="min-h-screen bg-marinho flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (apenaDono && usuario.role !== 'DONO') {
    return <Navigate to="/" replace />
  }

  return children
}
