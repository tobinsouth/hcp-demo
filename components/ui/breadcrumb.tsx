'use client'
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export function Breadcrumbs() {
  const pathname = usePathname();
  // Remove trailing slash and split
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  // Find the index of 'hcp' and get the rest
  const hcpIndex = segments.indexOf("hcp");
  const afterHcp = hcpIndex !== -1 ? segments.slice(hcpIndex + 1) : [];

  // Capitalize helper
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <Breadcrumb className="flex items-center text-sm text-muted-foreground font-normal">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/hcp">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {afterHcp.length > 0 && (
          <>
            <BreadcrumbSeparator />
            {afterHcp.map((seg, i) =>
              i === afterHcp.length - 1 ? (
                <BreadcrumbItem key={seg}>
                  <BreadcrumbPage>{capitalize(seg)}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <React.Fragment key={seg}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/hcp/${afterHcp.slice(0, i + 1).join("/")}`}>{capitalize(seg)}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </React.Fragment>
              )
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
