import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function MessageLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-12 text-center", className)}>
      <Loader2 className="h-10 w-10 animate-spin text-green-500" />
      <div>
        <h2 className="text-lg font-bold">Receiving Den Den transmission</h2>
        <p className="text-sm text-muted-foreground">
          Your Nakama’s words are crossing the sea.
        </p>
      </div>
    </div>
  )
}
