import * as React from "react"
import * as Avatar from "@radix-ui/react-avatar"
import { withAuth } from "@workos-inc/authkit-nextjs"
import { cn } from "@/lib/utils"

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  showProfileLink?: boolean
}

export async function UserAvatar({ 
  className,
  showProfileLink = true,
  ...props 
}: UserAvatarProps) {
  const { user } = await withAuth()
  const name = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "User"
  const initials = user?.firstName?.[0] || user?.email?.[0] || "U"
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <Avatar.Root className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-300 shadow">
        <Avatar.Image
          src={user?.profileImageUrl || "/man.jpg"}
          alt={name}
          className="aspect-square h-full w-full object-cover"
        />
        <Avatar.Fallback 
          className="flex h-full w-full items-center justify-center rounded-full bg-muted text-lg font-semibold"
        >
          {initials}
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="flex flex-col">
        <span className="font-medium text-sm text-sidebar-foreground">
          {name}
        </span>
        {showProfileLink && (
          <span className="text-xs text-sidebar-foreground/60">View profile</span>
        )}
      </div>
    </div>
  )
} 