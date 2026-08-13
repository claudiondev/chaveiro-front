import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import BottomNav from './components/BottomNav'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Home from './pages/Home'
import Precos from './pages/Precos'
import RegistrarServico from './pages/RegistrarServico'
import Caixa from './pages/Caixa'
import Fechamento from './pages/Fechamento'
import Relatorios from './pages/Relatorios'
import Menu from './pages/Menu'

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-marinho max-w-md mx-auto relative">
      {children}
      <BottomNav />
    </div>
  )
}

export default function App() {
  const { usuario } = useAuth()
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (
    <div className="min-h-screen bg-marinho">
      <Routes>
        <Route path="/login" element={
          usuario ? <Navigate to="/" replace /> : <Login />
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout><Home /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/servicos" element={
          <ProtectedRoute>
            <AppLayout><Precos /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/servicos/registrar" element={
          <ProtectedRoute>
            <AppLayout><RegistrarServico /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/caixa" element={
          <ProtectedRoute>
            <AppLayout><Caixa /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/fechamento" element={
          <ProtectedRoute>
            <AppLayout><Fechamento /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/relatorios" element={
          <ProtectedRoute apenaDono>
            <AppLayout><Relatorios /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/menu" element={
          <ProtectedRoute>
            <AppLayout><Menu /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
