import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TemaProvider } from './context/TemaContext.jsx'
import './index.css'

// Los "Provider" envuelven la app para que cualquier página pueda usar la sesión y el tema
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TemaProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TemaProvider>
    </BrowserRouter>
  </React.StrictMode>
)
