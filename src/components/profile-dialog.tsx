import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useUserContext } from "@/contexts/user-context"
import { updateProfileName, updateProfilePic } from "@/supabase-functions/profile"
import { toast } from "sonner"
import { Label } from "./ui/label"

export function UpdateProfileDialog({
  trigger,defaultOpen
}: {
  trigger: React.ReactNode, defaultOpen: boolean
}) {
    const {currentUser, refetchUsers} = useUserContext();
  const [name, setName] = useState(currentUser?.username || "")
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || "")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(defaultOpen)
  const [error, setError] = useState("")

  const handleNameUpdate = async () => {
    if (!name) return setError("Name is required")
    setLoading(true)
    try {
      await updateProfileName(name)
      refetchUsers()
      setOpen(false)
    } catch (err) {
        toast((err as Error).message)
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUrlUpdate = async () => {
    if (!avatarUrl) return setError("Avatar url is required")
    setLoading(true)
    try {
      await updateProfilePic(avatarUrl)
      setOpen(false)
    } catch (err) {
        toast((err as Error).message)
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>🏴‍☠️ Edit Pirate Profile</DialogTitle>
          <DialogDescription>
            Edit your profile here, Nakama.
          </DialogDescription>
        </DialogHeader>


        <div className="grid gap-4 py-4">
            <Label>Orewa</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-500 -mt-2">{error}</p>
          )}
          <Button
            onClick={handleNameUpdate}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Name"}
          </Button>
        </div>
        <div className="grid gap-4 py-4">
            <Label>Select Your Jolly Roger</Label>
          <Input
            type="text"
            placeholder="profile pic"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-500 -mt-2">{error}</p>
          )}
          <Button
            onClick={handleAvatarUrlUpdate}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update profile pic"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
