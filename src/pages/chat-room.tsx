import { AppSidebar } from "@/components/app-sidebar"
import { MessageInput } from "@/components/message-input"
import { MessageList } from "@/components/message-list"
import { RoomHeader } from "@/components/room-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useChatContext } from "@/contexts/chat-context"
import { useRoomMessages } from "@/hooks/useRoomMessages"
import { useParams } from "react-router-dom"
import type { ChatRoom } from "@/supabase-functions/chat"
import { useCallback, useEffect, useRef, useState } from "react"
import { MessageLoader } from "@/components/message-loader"
import { MessageContextProvider } from "@/contexts/message-context"

const ChatRoomPage = () => {
    const { id: roomId } = useParams<{ id: string }>()
    const { rooms } = useChatContext()
    const [loading, setLoading] = useState(true)

    // subscribe and fetch messages for this room
    const messages = useRoomMessages(roomId!)
    

    // find the current room object
    const room: ChatRoom | undefined = rooms.find((r) => r.id === roomId)

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => null, 100))

    const scrollToBottom = useCallback(() => {

        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        // setUnreadCount(0);
        // setShowScrollButton(false);
        // setIsUserScrolling(false);
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => scrollToBottom(), 900);
            // setLastMessageCount(messages.length);
        }
    }, [roomId, scrollToBottom]); // Only trigger when roomId changes

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false);
        }, 800)
    }, [roomId])



    return (
        <MessageContextProvider>
            <SidebarProvider>
                <div className="flex h-[100dvh] w-full">
                    <AppSidebar />

                    <div className="flex flex-col flex-1 gap-4 py-4 md:p-4 w-full md:w-[75%] h-[100dvh]">
                        {(room && messages) && <>
                            <RoomHeader room={room} />
                            {loading ?
                                <MessageLoader className="flex-1"></MessageLoader>
                                :
                                <MessageList messages={messages} scrollAreaRef={scrollAreaRef} messageEndRef={messageEndRef} scrollTimeoutRef={scrollTimeoutRef} />

                            }

                            <MessageInput onSent={scrollToBottom} />
                        </>}

                    </div>
                </div>
            </SidebarProvider>
        </MessageContextProvider>
    )
}

export default ChatRoomPage
