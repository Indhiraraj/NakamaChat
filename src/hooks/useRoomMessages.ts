import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { type Message } from "@/contexts/chat-context"

export function useRoomMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!roomId) return

    let isMounted = true

    const setup = async () => {
      // Cleanup previous channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session || !isMounted) return

      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:sender_id(username, avatar_url)")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })

      if (!error && data && isMounted) {
        setMessages(data as Message[])
      }

      const channel = supabase
        .channel(`room-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            const rawMessage = payload.new as Message
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", rawMessage.sender_id)
              .single()

            const newMessage: Message = {
              ...rawMessage,
              sender: senderProfile ?? undefined,
            }

            setMessages((prev) => [...prev, newMessage])
          }
        )
        .subscribe()

      channelRef.current = channel
    }

    setup()

    return () => {
      isMounted = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [roomId])

  return messages
}

