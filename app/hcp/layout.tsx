import * as React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { withAuth, getSignInUrl } from "@workos-inc/authkit-nextjs"
import { redirect } from "next/navigation"
import { Breadcrumbs } from "@/components/ui/breadcrumb"
import { SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import { Container, Flex } from "@radix-ui/themes"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await withAuth();
  
  if (!user) {
    redirect(await getSignInUrl());
  }

  return (
    <SidebarProvider>
      <OnboardingProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex flex-col sm:flex-row h-auto sm:h-16 shrink-0 items-center gap-2 px-2 sm:px-4 py-2 sm:py-0 w-full">
            <Flex align="center" className="w-full">
              <SidebarTrigger className="-ml-1" />
              <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4 hidden sm:block"
                />            
            <Breadcrumbs />
            </Flex>
          </header>
          <Container className="flex flex-1 flex-col gap-4 p-2 sm:p-4 w-full max-w-full">{children}</Container>
        </SidebarInset>
      </OnboardingProvider>
    </SidebarProvider>
  )
}