import {  useEffect } from "react"
import { fetchUserChatRooms } from "@/supabase-functions/chat"
import {  useChatContext } from "@/contexts/chat-context"

export function useUserChatRooms() {
  const { setRooms } = useChatContext()

  useEffect(() => {
    const fetchRooms = async () => {

      const rooms = await fetchUserChatRooms()
      setRooms(rooms)

      // setLoading(false)
    }

    fetchRooms()
  }, [])

}
