import type * as React from "react"
import { Home, Inbox, Calendar, Search, Settings, User, Server, Link, CircleUser, HelpCircle } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserProfile } from "@/components/user-profile"
import Image from "next/image"

// Navigation items
const navItems = [
  {
    title: "Home",
    url: "/hcp",
    icon: Home,
  },
  {
    title: "My Context",
    url: "/hcp/context",
    icon: CircleUser,
  },
  {
    title: "Preferences",
    url: "/hcp/preferences",
    icon: Settings,
  },
  {
    title: "Memories",
    url: "/hcp/memories",
    icon: Inbox,
  },
  {
    title: "Connect MCP",
    url: "/hcp/mcp",
    icon: Link,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: Server,
    disabled: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/logo.png" alt="My Human Context" width={32} height={32} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">My Human Context</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>  
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={item.disabled}>
                    {item.disabled ? (
                      <span className="flex items-center gap-2 cursor-not-allowed opacity-50">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </span>
                    ) : (
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild disabled>
              <span className="flex items-center gap-2 cursor-not-allowed opacity-50">
                <HelpCircle className="size-4" />
                <span>Get Help</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/hcp/settings">
                <Settings className="size-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
