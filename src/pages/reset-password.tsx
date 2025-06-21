import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { updateUserPassword } from "@/supabase-functions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match.")
      return
    }

    setLoading(true)
    setError("")
    try {
      await updateUserPassword(password)
      setSuccess("🗝️ Password updated successfully. Redirecting...")
      setTimeout(() => navigate("/auth/sign-in"), 2000)
    } catch (err) {
      setError("☠️ Failed to update password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border border-primary rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-extrabold text-primary flex items-center justify-center gap-2">
            ☠️ Reset Your Password, Nakama!
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Uh oh!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="default">
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Changing sails..." : "Set New Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
