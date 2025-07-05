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
import { resetPassword } from "@/supabase-functions/auth"
import { toast } from "sonner"

export function ResetPasswordDialog({
  trigger,
}: {
  trigger: React.ReactNode
}) {
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleReset = async () => {
    if (!email) return setError("Email is required")
    setLoading(true)
    try {
      await resetPassword(email)
      setOpen(false)
      toast("Email sent, check your mail Nakama")
    } catch (err) {
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
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email and we’ll send you a link to reset your password, Nakama.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-500 -mt-2">{error}</p>
          )}
          <Button
            onClick={handleReset}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
