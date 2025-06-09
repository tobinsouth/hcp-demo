import * as React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { withAuth, getSignInUrl } from "@workos-inc/authkit-nextjs"
import { redirect } from "next/navigation"
import { Breadcrumbs } from "@/components/ui/breadcrumb"
import { SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default async function Layout({ children }: { children: React.ReactNode }) {
  // const { user } = await withAuth();
  
  // if (!user) {
  //   redirect(await getSignInUrl());
  // }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="ml-2 h-4" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}