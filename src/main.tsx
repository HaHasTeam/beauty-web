import './index.css'
import './i18n'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import ScrollToTop from './components/scroll-to-top/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_PUBLIC_PATH as string}>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
