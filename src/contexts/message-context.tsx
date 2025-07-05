import { createContext, useContext, useState } from "react"
import type { Message } from "./chat-context"

type MessageContextType = {
    message: Message | null,
    setMessage: React.Dispatch<React.SetStateAction<Message | null>>,
    clearMessage: () => void
}

const DefaultMessageContext = {
    message: null,
    setMessage: () => { },
    clearMessage: () => {}
}

type Props = { children: React.ReactNode }

const MessageContext = createContext<MessageContextType>(DefaultMessageContext)

export const MessageContextProvider = ({ children }: Props) => {
    const [message, setMessage] = useState<Message | null>(null);

    const clearMessage = () => {
        setMessage(null)
    }

    return (
        <MessageContext.Provider value={{
            message,
            setMessage,
            clearMessage
        }}
        >
            {children}
        </MessageContext.Provider>
    )
}


export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessageContext must be inside MessageContextProvider")
    }

    return context;
}
