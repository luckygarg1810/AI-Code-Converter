import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ChatApp from './assets/components/ChatApp.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChatApp />
  </StrictMode>,
)
