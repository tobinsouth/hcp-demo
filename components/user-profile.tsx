"use client"

import * as React from "react"
import { User, LogOut, Settings, ChevronUp } from "lucide-react"
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { signOut } from '@workos-inc/authkit-nextjs';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function UserProfile() {
const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("No user found") // this should never happen
    return <div>No user found</div>;
  }


  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.email.split("@")[0]

  const initials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : user.email[0].toUpperCase()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="size-8">
                <AvatarImage src={user.profilePictureUrl || "/placeholder.svg"} alt={displayName} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium truncate">{displayName}</span>
                <span className="text-xs text-sidebar-foreground/70 truncate">{user.email}</span>
              </div>
              <ChevronUp className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
            <DropdownMenuItem asChild>
              <a href="/profile" className="cursor-pointer">
                <User className="size-4 mr-2" />
                Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/settings" className="cursor-pointer">
                <Settings className="size-4 mr-2" />
                Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
              <LogOut className="size-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
