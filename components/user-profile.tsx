"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserProfile() {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent px-4 py-3">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
          U
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">User</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">user@planet.app</p>
        </div>
      </div>
    )
  }

  const initials =
    session.user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent px-4 py-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
        <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{session.user.name || "User"}</p>
        <p className="text-xs text-sidebar-foreground/60 truncate">{session.user.email || "user@planet.app"}</p>
      </div>
    </div>
  )
}
