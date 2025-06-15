import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea"
import React, {  useState } from "react";
import { Button } from "./ui/button";
import { addMessageToRoom } from "@/supabase-functions/messages";
import { useParams } from "react-router-dom";
import { Send } from "lucide-react";

type MessageInputProps = React.ComponentProps<"div"> & {
    onSent: () => void
}

export function MessageInput({
    className, onSent
}: MessageInputProps) {
    const [message, setMessage] = useState("");
    const roomId = useParams().id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addMessageToRoom(roomId!, message, null);
        setMessage("");
        setTimeout(() => onSent(), 1000)
        // onSent()
    };



   

    return (
        <form onSubmit={handleSubmit} className={cn(className, "w-full")}>
            <div className="flex gap-4 border-t border-primary-200 p-4 pb-0 items-center">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        const isMobile = window.innerWidth <= 768; // or adjust breakpoint as needed
                        if (!isMobile && e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 resize-none border-primary-300 focus:ring-primary-500 h-16 md:h-20"
                />
                <Button
                    type="submit"
                    className="cursor-pointer"
                >
                    <Send />
                </Button>
            </div>
        </form>
    )
}