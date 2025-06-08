import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import Image from "next/image"
import { withAuth } from "@workos-inc/authkit-nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export async function AppSidebar() {
  const { user } = await withAuth();

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        <div className="border-t border-sidebar-border p-4 flex items-center gap-3 mt-2">
          <div className="relative w-10 h-10">
            <Image
              src="/man.jpg"
              alt="User Avatar"
              fill
              className="rounded-full object-cover border border-gray-300 shadow"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-sidebar-foreground">John Doe</span>
            <span className="text-xs text-sidebar-foreground/60">View profile</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}