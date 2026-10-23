import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/baloo-2/latin-ext-400.css'
import '@fontsource/baloo-2/latin-ext-600.css'
import '@fontsource/baloo-2/latin-ext-700.css'
import '@fontsource/baloo-2/latin-ext-800.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
