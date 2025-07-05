import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { Message } from "@/contexts/chat-context"
import { useMessageContext } from "@/contexts/message-context"
import { toast } from "sonner"

const ChatContextMenu = ({message, trigger} : {message: Message,trigger: React.ReactNode}) => {

    const {setMessage} = useMessageContext();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content)
            toast("copied")
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    const handleReply = () => {
        setMessage(message)
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={handleCopy}>Copy</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={handleReply}>Reply</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default ChatContextMenu