import { useCallback } from "react"
import { type ChatRoom, type Profile } from "@/supabase-functions/chat"

export function useChatPartnerName(currentUser: Profile | undefined, allUsers: Profile[] | null) {
  return useCallback((room: ChatRoom) => {
    if (!currentUser || !allUsers) return "Unknown"

    if (room.created_by === currentUser.id) {
      return currentUser.username || "self chat"
    }

    const partner = room.members?.find((m) => m.user_id !== currentUser.id)
    const profile = allUsers.find((u) => u.id === partner?.user_id)
    return profile?.username || "Unknown"
  }, [currentUser, allUsers])
}
