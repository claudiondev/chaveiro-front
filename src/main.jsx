import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { HelpProvider } from './contexts/HelpContext'
import './index.css'

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
    })
  } else {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => registrations.forEach((registration) => registration.unregister()))

    if ('caches' in window) {
      caches.keys().then((names) => names.forEach((name) => caches.delete(name)))
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HelpProvider>
          <App />
        </HelpProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
