import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './i18n.js'  // ← This loads your new i18n config
import { I18nextProvider } from 'react-i18next'  // ← Add this
import i18n from './i18n.js'  // ← Add this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>  {/* ← Wrap App with this */}
        <App />
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
