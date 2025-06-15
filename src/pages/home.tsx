import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { useNavigate } from "react-router-dom"

import { createChatRoom, getOrCreateOneToOneRoom } from "@/supabase-functions/chat"
import { useChatContext } from "@/contexts/chat-context"
import { useUserContext } from "@/contexts/user-context"
import { useChatPartnerName } from "@/hooks/useChatPartnerName"
import { OnePieceLoader } from "@/components/loader"
import { RefreshCw } from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()
  const { currentUser, allUsers, refetchUsers } = useUserContext()
  const {
    filteredGroupRooms,
    filteredOneToOneRooms,
    newUsersToChatWith,
    loading,
    refreshChatData,
  } = useChatContext()

  const getPartnerName = useChatPartnerName(currentUser!, allUsers)

  const [roomName, setRoomName] = useState("")

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return
    await createChatRoom(roomName)
    setRoomName("")
    await refreshChatData()
  }

  const handleUserClick = async (userId: string) => {
    const roomId = await getOrCreateOneToOneRoom(userId)
    navigate(`/chat/${roomId}`)
  }

  useEffect(() => {
    if (loading === true) {
      refreshChatData()
      refetchUsers()
    }

  }, [])

  if (loading) {
    return <OnePieceLoader />
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 pt-4 md:p-4 overflow-y-auto">
          <div className="flex w-full justify-between px-4 items-center">
            <SidebarTrigger/>
            <h1 className="text-[26px] font-bold"><span className="hidden md:inline">Welcome to</span> NakamaChat</h1>
            <div className="flex gap-2">
              <Avatar avatarUrl={currentUser?.avatar_url} username={currentUser?.username!} />
              <ModeToggle />
            </div>
          </div>

          {/* Group Creation Section */}
          <div className="flex gap-2 my-4 px-4 w-full md:w-[75%]">
            <Input
              placeholder="New chat room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Button onClick={handleCreateRoom}>Create Room</Button>
            <Button onClick={() => refreshChatData()}><RefreshCw/></Button>
          </div>

          {/* Group Rooms */}
          <div className="px-4 w-full md:w-[75%]">
            <h2 className="text-lg font-semibold mb-2">Your Sunny Decks</h2>
            <ul className="space-y-2">
              {filteredGroupRooms.map((room) => (
                <li
                  key={room.id}
                  className="p-3 bg-muted rounded-lg hover:bg-muted/60 cursor-pointer"
                  onClick={() => navigate(`/chat/${room.id}`)}
                >
                  {room.name || "Unnamed Room"}
                </li>
              ))}
            </ul>
          </div>

          {/* One-on-One Chats */}
          <div className="px-4 w-full md:w-[75%] mt-6">
            <h2 className="text-lg font-semibold mb-2">Your Den Den Whispers</h2>
            <ul className="space-y-2">
              {filteredOneToOneRooms.map((room) => (
                <li
                  key={room.id}
                  className="p-3 bg-muted rounded-lg hover:bg-muted/60 cursor-pointer"
                  onClick={() => navigate(`/chat/${room.id}`)}
                >
                  {getPartnerName(room) || "Unnamed Nakama"}
                </li>
              ))}
            </ul>
          </div>

          {/* New Chats (Users not yet chatted with) */}
          {newUsersToChatWith.length > 0 && (
            <div className="px-4 w-full md:w-[75%] mt-6">
              <h2 className="text-lg font-semibold mb-2">Not Yet Nakamas</h2>
              <ul className="space-y-2">
                {newUsersToChatWith.map((user) => (
                  <li
                    key={user.id}
                    className="p-3 bg-muted rounded-lg hover:bg-muted/60 cursor-pointer"
                    onClick={() => handleUserClick(user.id)}
                  >
                    {user.username}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}
