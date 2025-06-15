import * as React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar"

import { useChatContext } from "@/contexts/chat-context"
import { useUserContext } from "@/contexts/user-context"
import { useChatPartnerName } from "@/hooks/useChatPartnerName"
import { getOrCreateOneToOneRoom, type Profile } from "@/supabase-functions/chat"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const params = useParams()
  const currentRoomId = params.id as string

  // ── pull everything out of context ────────────────────────
  const {
    filteredGroupRooms: groups,
    filteredOneToOneRooms: chats,
    newUsersToChatWith,
  } = useChatContext()

  const { currentUser, allUsers } = useUserContext()
  const getPartnerName = useChatPartnerName(currentUser!, allUsers)

  // ── handlers ─────────────────────────────────────────────
  const handleHomeClick = () => navigate("/")
  const handleUserClick = async (userId: string) => {
    const roomId = await getOrCreateOneToOneRoom(userId)
    navigate(`/chat/${roomId}`)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div
          className="relative text-[24px] font-bold cursor-pointer mt-6 inline-block"
          onClick={handleHomeClick}
        >
          <img
            src="/nakama-chat.png"
            alt="Nakama Hat"
            className="absolute -top-4 left-2 w-9 h-9"
          />
          NakamaChat
        </div>


      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sunny Decks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((room) => (
                <SidebarMenuItem key={room.id}>
                  <SidebarMenuButton asChild isActive={room.id === currentRoomId}>
                    <Link to={`/chat/${room.id}`}>{room.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Den Den Whispers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((room) => (
                <SidebarMenuItem key={room.id}>
                  <SidebarMenuButton asChild isActive={room.id === currentRoomId}>
                    <Link to={`/chat/${room.id}`}>
                      {getPartnerName(room)}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {newUsersToChatWith.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Not Yet Nakamas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {newUsersToChatWith.map((user: Profile) => (
                  <SidebarMenuItem key={user.id}>
                    <SidebarMenuButton asChild>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleUserClick(user.id)}
                      >
                        {user.username}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
