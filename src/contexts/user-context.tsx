import React, { createContext, useEffect, useState, useContext } from "react"
import { getAllProfiles } from "@/supabase-functions/profile"
import { getCurrentUser } from "@/supabase-functions/auth"
import { type Profile } from "@/supabase-functions/chat"

type UserContextType = {
  currentUser: Profile | null
  allUsers: Profile[] | null
  loading: boolean
  refetchUsers: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  allUsers: null,
  loading: true,
  refetchUsers: async () => {},
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [allUsers, setAllUsers] = useState<Profile[] | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    const user = await getCurrentUser()
    const profiles = await getAllProfiles()


    const current = profiles?.find((p) => p.id === user?.id) || null
    
    const others = profiles?.filter((p) => p.id !== user?.id) || []

    setCurrentUser(current)
    setAllUsers(others)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        loading,
        refetchUsers: fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
