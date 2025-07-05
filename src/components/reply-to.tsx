import { useMessageContext } from "@/contexts/message-context"
import { X } from "lucide-react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

const ReplyTo = () => {
    const { message: replyToMessage, clearMessage } = useMessageContext()

    const params = useParams()

    const roomId = params.id as string

    useEffect(() => {
        if(replyToMessage) {
            clearMessage()
        }
    }, [roomId])

    if (replyToMessage) {
        return (
            <div className="flex items-start justify-between bg-muted px-3 py-2 mb-2 rounded-lg border border-muted-foreground/20 relative">
                <div className="flex flex-col max-w-[90%] overflow-hidden">
                    <span className="text-xs text-muted-foreground font-medium">
                        Replying to {replyToMessage.sender?.username || "a message"}
                    </span>
                    <span className="text-sm text-foreground truncate">
                        {replyToMessage.content || "Message content"}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => clearMessage()} // assumes context has a clearMessage method
                    className="text-muted-foreground hover:text-destructive transition cursor-pointer"
                >
                    <X size={16} />
                </button>
            </div>
        )
    }
    else return <></>


}

export default ReplyTo