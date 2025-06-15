import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChatContextProvider } from './contexts/chat-context.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { UserProvider } from './contexts/user-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
