import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import SignUp from "./pages/signup"
import SignIn from "./pages/signin"
import Home from "./pages/home"
import { useEffect, useState } from "react"
import { supabase } from "./lib/supabaseClient"
import type { Session } from "@supabase/supabase-js"
import ChatRoomPage from "./pages/chat-room"
import { OnePieceLoader } from "./components/loader"

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {      
      setSession(session)
      setTimeout(() => setLoading(false), 500)
      // setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {      
      setSession(session)
    })
    

    // 3. Cleanup
    return () => {
      listener?.subscription.unsubscribe()
    }

  }, [])

  if (loading) {
    return <OnePieceLoader/>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            session ? <Home /> : <Navigate to="/auth/sign-in" replace />
          }
        />
        <Route
          path="/chat/:id"
          element={
            session ? <ChatRoomPage /> : <Navigate to="/auth/sign-in" replace />
          }
        />
        <Route
          path="/auth/sign-up"
          element={
            session ? <Navigate to="/" replace /> : <SignUp />
          }
        />
        <Route
          path="/auth/sign-in"
          element={
            session ? <Navigate to="/" replace /> : <SignIn />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App