import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> & {
  avatarUrl?: string | null
  username?: string
}

export function Avatar({
  avatarUrl,
  username,
  className,
  ...props
}: AvatarProps) {
  // Compute initials from username, or “?” if none
  const initials = React.useMemo(() => {
    if (!username) return "?"
    return username
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2)
  }, [username])

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground",
        "w-8 h-8",
        className
      )}
      {...props}
    >
      {avatarUrl && (
        <AvatarPrimitive.Image
          data-slot="avatar-image"
          src={avatarUrl}
          alt={username}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            // remove broken image so fallback shows
            (e.target as HTMLImageElement).remove()
          }}
        />
      )}
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className="flex w-full h-full items-center justify-center text-sm font-medium"
        delayMs={500}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
