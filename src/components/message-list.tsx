import { cn } from "@/lib/utils";
import { CardContent } from "./ui/card";
import ChatBubble from "./chat-bubble";
import type { Message } from "@/contexts/chat-context";
import { ScrollArea } from "./ui/scroll-area";
import React, { useEffect, useRef } from "react";

type MessageListProps = React.ComponentProps<"div"> & {
    messages: Message[],
    scrollAreaRef: React.RefObject<HTMLDivElement | null> | null,
    messageEndRef: React.RefObject<HTMLDivElement | null> | null,
    scrollTimeoutRef: React.RefObject<NodeJS.Timeout>

}

export function MessageList({
    className, messages, scrollAreaRef, messageEndRef, scrollTimeoutRef
}: MessageListProps) {
    useEffect(() => {
        const scrollDown = () => {
            if (messageEndRef?.current) {
                messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }


        }

        setTimeout(() => {
            scrollDown()
        }, 100);
    }, [messages])
    return (
        <div className={cn("flex flex-col gap-6 min-h-2/3 max-h-[90dvh] w-full", className)}>
            <ScrollArea ref={scrollAreaRef} className="h-full overflow-y-auto">
                <CardContent className="flex flex-col gap-6">
                    {messages && messages.map((message) => <ChatBubble key={message.id} message={message} />)}
                    <div ref={messageEndRef}></div>
                </CardContent>
            </ScrollArea>
        </div>
    )
}