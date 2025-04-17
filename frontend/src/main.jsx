import React from 'react'
import ReactDom from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './AuthContext.jsx'
import { BrowserRouter,Router } from 'react-router-dom'
import ProjectRouter from './Routes.jsx'

ReactDom.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router>
      <ProjectRouter/>
    </Router>
  </AuthProvider>
   
)
