import AuthProvider from '@/context/AuthContext'
import '@/styles/globals.css'
import initFirebaseConfig from '@/firebase/firebase'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../context/ThemeContext'
import { SocketProvider } from '@/context/SocketContext'

initFirebaseConfig() // initialize firebase
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SocketProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  )
  }
