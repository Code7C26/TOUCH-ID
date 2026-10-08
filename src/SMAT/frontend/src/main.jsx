import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AvisosProvider } from './context/AvisosContext.jsx'
import { TemaProvider } from './context/TemaContext.jsx'
import './index.css'

// Los "Provider" envuelven la app para que cualquier página pueda usar la sesión, el tema y los avisos
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TemaProvider>
        <AuthProvider>
          <AvisosProvider>
            <App />
          </AvisosProvider>
        </AuthProvider>
      </TemaProvider>
    </BrowserRouter>
  </React.StrictMode>
)
