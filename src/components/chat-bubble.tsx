import { Card, CardContent } from "./ui/card"
import { useEffect, useState } from "react"
import { type Message } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"
import { useUserContext } from "@/contexts/user-context"

type ChatBubbleType = {
  message: Message
}

const ChatBubble = ({ message }: ChatBubbleType) => {
  const [bubbleAlign, setBubbleAlign] = useState<"start" | "end">("start")
  const {currentUser} = useUserContext()

  useEffect(() => {
      setBubbleAlign(currentUser?.id === message.sender_id ? "end" : "start")
    
  }, [message.sender_id, message.room_id])

  const isOwnMessage = bubbleAlign === "end"

  return (
    <div
      className={cn("flex w-full md:px-4", {
        "justify-end": isOwnMessage,
        "justify-start": !isOwnMessage,
      })}
    >
      <Card
        className={cn(
          "w-fit max-w-md shadow-none",
          isOwnMessage
            ? "bg-primary text-white rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        )}
      >
        <CardContent className="md:p-3">
          {!isOwnMessage && (
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {message.sender?.username}
            </p>
          )}
          <p className="text-base whitespace-pre-line">{message.content}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChatBubble
