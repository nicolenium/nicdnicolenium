import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './i18n.js'
import App from './App.jsx'
import './index.css'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div style={{color: 'white', textAlign: 'center', marginTop: '20vh'}}>Loading...</div>}>
        <App />
      </Suspense>
    </I18nextProvider>
  </React.StrictMode>,
)
