import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"
import { useNavigate } from "react-router-dom"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

import { addUserToRoom, fetchRoomMembers, removeUserFromRoom } from "@/supabase-functions/room"
import { useUserContext } from "@/contexts/user-context"
import { useChatPartnerName } from "@/hooks/useChatPartnerName"

import type { ChatRoom, RoomMember } from "@/supabase-functions/chat"
import { ArrowLeft, Settings, UserCog, UserMinus, UserPlus } from "lucide-react"
import { DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
 } from "./ui/dropdown-menu"

export function RoomHeader({ className, room }: { className?: string, room: ChatRoom }) {
    const navigate = useNavigate()

    const { currentUser, allUsers } = useUserContext()
    const getPartnerName = useChatPartnerName(currentUser!, allUsers)

    const [roomMembers, setRoomMembers] = useState<RoomMember[]>([])
    const [selectedAdd, setSelectedAdd] = useState<string[]>([])
    const [selectedRemove, setSelectedRemove] = useState<string[]>([])
    const [addOpen, setAddOpen] = useState(false)
    const [removeOpen, setRemoveOpen] = useState(false)

    const fetchRoomData = async () => {
        if (!room?.id) return
        const members = await fetchRoomMembers(room.id)
        setRoomMembers(members)
    }

    useEffect(() => {
        fetchRoomData()
    }, [])

    useEffect(() => {
        if (addOpen || removeOpen) fetchRoomData()
    }, [addOpen, removeOpen])

    const toggleSelection = (id: string, setFn: Function, list: string[]) => {
        setFn(list.includes(id) ? list.filter((uid) => uid !== id) : [...list, id])
    }

    const handleAddUsers = async () => {
        if (!room?.id) return
        await Promise.all(selectedAdd.map((uid) => addUserToRoom(room.id, uid)))
        setSelectedAdd([])
        setAddOpen(false)
        await fetchRoomData()
    }

    const handleRemoveUsers = async () => {
        if (!room?.id) return
        await Promise.all(
            selectedRemove.map((uid) => removeUserFromRoom(room.id, uid))
        )
        setSelectedRemove([])
        setRemoveOpen(false)
        await fetchRoomData()
    }

    const isOwner = currentUser?.id === room?.created_by
    const isChat = !room?.is_group

    const memberIds = roomMembers.map((m) => m.user_id)
    const usersToAdd = allUsers?.filter((u) => u.id !== room?.created_by && !memberIds.includes(u.id)) || []
    const usersToRemove = roomMembers.filter((m) => m.user_id !== room?.created_by)

    const title = isChat ? getPartnerName(room) : room?.name || "Group Chat"

    return (
        <div className={cn("flex gap-6 justify-center items-center", className)}>
            <Button onClick={() => navigate("/")}><ArrowLeft></ArrowLeft></Button>
            <h3 className="text-lg font-semibold">{title}</h3>

            {(isOwner && !isChat) && (
                <>
                    {/* Add User Dialog */}
                    <div className="hidden md:block">
                    <Dialog open={addOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><UserPlus></UserPlus></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select users to add</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-64 pr-2">
                                {usersToAdd.map((user) => (
                                    <div key={user.id} className="flex items-center gap-2 py-1">
                                        <Checkbox
                                            id={`add-${user.id}`}
                                            checked={selectedAdd.includes(user.id)}
                                            onCheckedChange={() =>
                                                toggleSelection(user.id, setSelectedAdd, selectedAdd)
                                            }
                                        />
                                        <label htmlFor={`add-${user.id}`} className="text-sm">
                                            {user.username}
                                        </label>
                                    </div>
                                ))}
                            </ScrollArea>
                            <Button onClick={handleAddUsers} className="mt-4 w-full">
                                Add Selected Users
                            </Button>
                        </DialogContent>
                    </Dialog>

                    {/* Remove User Dialog */}
                    <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive"><UserMinus></UserMinus></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select users to remove</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-64 pr-2">
                                {usersToRemove.map((m) => (
                                    <div key={m.user_id} className="flex items-center gap-2 py-1">
                                        <Checkbox
                                            id={`remove-${m.user_id}`}
                                            checked={selectedRemove.includes(m.user_id)}
                                            onCheckedChange={() =>
                                                toggleSelection(m.user_id, setSelectedRemove, selectedRemove)
                                            }
                                        />
                                        <label htmlFor={`remove-${m.user_id}`} className="text-sm">
                                            {m.profile?.username || "Unknown"}
                                        </label>
                                    </div>
                                ))}
                            </ScrollArea>
                            <Button onClick={handleRemoveUsers} className="mt-4 w-full">
                                Remove Selected Users
                            </Button>
                        </DialogContent>
                    </Dialog>
                    </div>

                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <UserCog/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => setAddOpen(true)}>Add Users</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setRemoveOpen(true)}>Remove Users</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </>
            )}

            <div className="ml-auto">
                <ModeToggle />
            </div>
        </div>
    )
}
