import { cn } from "@/lib/utils";
import { CardContent } from "./ui/card";
import ChatBubble from "./chat-bubble";
import type { Message } from "@/contexts/chat-context";
import { ScrollArea } from "./ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";

type MessageListProps = React.ComponentProps<"div"> & {
    messages: Message[],
    scrollAreaRef: React.RefObject<HTMLDivElement | null> | null,
    messageEndRef: React.RefObject<HTMLDivElement | null> | null,
    scrollTimeoutRef: React.RefObject<NodeJS.Timeout>

}

export function MessageList({
    className, messages, scrollAreaRef, messageEndRef
}: MessageListProps) {

    const messageRefs = useRef<Record<string, HTMLElement | null>>({});
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

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

    const scrollToMessage = (id: string) => {
        const target = messageRefs.current[id];
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        setHighlightedId(id);
        // remove the highlight after 1s
        setTimeout(() => setHighlightedId(prev => prev === id ? null : prev), 1000);
    }


    return (
        <div className={cn("flex flex-1 flex-col gap-6 min-h-[70dvh] md:min-h-2/3 w-full", className)}>
            <ScrollArea ref={scrollAreaRef} className="h-full overflow-y-auto w-full">
                <CardContent className="flex flex-col gap-6 w-full px-4 md:px-0">
                    {messages && messages.map((message) =>
                        <div
                            key={message.id}
                            ref={(el) => {
                                messageRefs.current[message.id] = el
                            }}
                            className={cn(
                                highlightedId === message.id 
                                && "animate-glow rounded-md"
                            )}
                            >
                            <ChatBubble
                                message={message}
                                allMessages={messages}
                                onJumpToMessage={scrollToMessage}
                                shouldGlow={highlightedId === message.id}
                            />
                        </div>
                    )}

                    <div ref={messageEndRef}></div>
                </CardContent>
            </ScrollArea>
        </div>
    )
}