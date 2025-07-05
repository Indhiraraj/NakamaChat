import { Card, CardContent } from "./ui/card"
import { useEffect, useState } from "react"
import { type Message } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"
import { useUserContext } from "@/contexts/user-context"
import ChatContextMenu from "./chat-context-menu"

type ChatBubbleType = {
  message: Message,
  allMessages: Message[],
  onJumpToMessage: (id: string) => void,
  shouldGlow: boolean
}

const ChatBubble = ({ message, allMessages, onJumpToMessage, shouldGlow }: ChatBubbleType) => {
  const [bubbleAlign, setBubbleAlign] = useState<"start" | "end">("start")
  const { currentUser } = useUserContext()
  const repliedTo = allMessages.find((m) => m.id === message.reply_to)

  useEffect(() => {
    setBubbleAlign(currentUser?.id === message.sender_id ? "end" : "start")

  }, [message.sender_id, message.room_id])

  const isOwnMessage = bubbleAlign === "end"

  const handleMessageJump = (id: string) => {
    onJumpToMessage(id)
  }


  return (

    <div
      className={cn("flex w-full md:px-4", {
        "justify-end": isOwnMessage,
        "justify-start": !isOwnMessage,
      })}
    >

      <ChatContextMenu
        message={message}
        trigger={

          <Card
            className={cn(
              "w-fit relative max-w-md shadow-none py-4",
              isOwnMessage
                ? "bg-primary text-white rounded-br-none"
                : "bg-muted text-foreground rounded-bl-none",
              // assume `shouldGlow` is true when you want this one to light up
              shouldGlow && "animate-bg-glow"
            )}
          >

            <CardContent className="md:px-3">



              {!isOwnMessage && (
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {message.sender?.username}
                </p>
              )}
              {repliedTo && (
                <div onClick={() => handleMessageJump(repliedTo.id)} className="mb-2 px-2 py-2 rounded bg-black/40 text-white text-sm">
                  <span className="font-semibold">
                    {repliedTo.sender?.username || "Unknown"}:
                  </span>{" "}
                  <span className="truncate block max-w-[220px]">
                    {repliedTo.content || "[Deleted message]"}
                  </span>
                </div>
              )}
              <p className="text-base whitespace-pre-line">{message.content}</p>
            </CardContent>
          </Card>
        } />
    </div>


  )
}

export default ChatBubble
