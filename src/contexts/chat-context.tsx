// contexts/chat-context.tsx
import React, { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import type { ChatRoom, Profile } from "@/supabase-functions/chat"
import { fetchUserChatRooms } from "@/supabase-functions/chat"
import { getCurrentUser } from "@/supabase-functions/auth"  // or profile file
import { getAllProfiles } from "@/supabase-functions/profile"

export type Message = {
  id: string
  content: string
  created_at: string
  sender_id: string
  room_id: string
  type: string | null
  file_url: string | null
  reply_to: string | null
  sender?: { username: string | null; avatar_url?: string | null }
}

type ChatContextType = {
  rooms: ChatRoom[]
  setRooms: React.Dispatch<React.SetStateAction<ChatRoom[]>>
  filteredGroupRooms: ChatRoom[]
  filteredOneToOneRooms: ChatRoom[]
  newUsersToChatWith: Profile[]
  chatPartnerIds: string[]
  loading: boolean
  refreshChatData: () => Promise<void>
}

const defaultValue: ChatContextType = {
  rooms: [],
  setRooms: () => {},
  filteredGroupRooms: [],
  filteredOneToOneRooms: [],
  newUsersToChatWith: [],
  chatPartnerIds: [],
  loading: true,
  refreshChatData: async () => {},
}

const ChatContext = createContext<ChatContextType>(defaultValue)

type Props = { children: ReactNode }

export const ChatContextProvider = ({ children }: Props) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [chatPartnerIds, setChatPartnerIds] = useState<string[]>([])
  const [allUsers, setAllUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  // const [currentUser, setCurrentUser] = useState<Profile | null>(null)

  // Fetch rooms + users + derive partner IDs
  const refreshChatData = async () => {
    setLoading(true)
    const me = await getCurrentUser()
    if (!me) return

    const profiles = await getAllProfiles()
    // const userProfile = profiles.find(p => p.id === me.id)
    // setCurrentUser(userProfile!)
    setAllUsers(profiles.filter((p) => p.id !== me.id))

    const fetchedRooms = await fetchUserChatRooms()
    setRooms(fetchedRooms)

    // partner IDs from one-to-one rooms
    const pIds = fetchedRooms
      .filter((r) => !r.is_group)
      .flatMap((r) => (r.members || []).map((m) => m.user_id!))
      .filter((id) => id !== me.id)

    setChatPartnerIds([...new Set(pIds)])
    setLoading(false)
  }

  useEffect(() => {
    refreshChatData()
  }, [])

  const filteredGroupRooms = rooms.filter((r) => r.is_group)
  const filteredOneToOneRooms = rooms.filter((r) => !r.is_group)
  const newUsersToChatWith = allUsers.filter((u) => !chatPartnerIds.includes(u.id))

  return (
    <ChatContext.Provider
      value={{
        rooms,
        setRooms,
        filteredGroupRooms,
        filteredOneToOneRooms,
        newUsersToChatWith,
        chatPartnerIds,
        loading,
        refreshChatData,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChatContext must be inside ChatContextProvider")
  return ctx
}
