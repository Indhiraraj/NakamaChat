import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function OnePieceLoader({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-12 text-center", className)}>
      <Loader2 className="h-10 w-10 animate-spin text-green-500" />
      <div>
        <h2 className="text-lg font-bold">Setting sail…</h2>
        <p className="text-sm text-muted-foreground">
          Preparing the Thousand Sunny. Nakama, hold tight!
        </p>
      </div>
    </div>
  )
}
