"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Building2, Bot, Calendar, Settings, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavGroup {
  key: string
  label: string
  icon: LucideIcon
  href: string
  matches: string[]
}

const groups: NavGroup[] = [
  { key: "contacts", label: "Contacts", icon: Users, href: "/leads", matches: ["/leads", "/clients"] },
  { key: "properties", label: "Propriétés", icon: Building2, href: "/properties", matches: ["/properties", "/commissions"] },
  { key: "assistant", label: "Assistant", icon: Bot, href: "/assistant", matches: ["/assistant"] },
  { key: "agenda", label: "Agenda", icon: Calendar, href: "/calendar", matches: ["/calendar"] },
  { key: "settings", label: "Réglages", icon: Settings, href: "/settings", matches: ["/settings"] },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-16 max-w-md items-stretch justify-between px-1">
          {groups.map((group) => {
            const active = group.matches.some((match) => pathname.startsWith(match))
            const Icon = group.icon

            if (group.key === "assistant") {
              return (
                <Link
                  key={group.key}
                  href={group.href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex flex-1 flex-col items-center justify-end gap-1 pb-2"
                >
                  <span
                    className={cn(
                      "absolute -top-5 flex h-12 w-12 items-center justify-center rounded-full shadow-md ring-4 ring-white transition-colors",
                      active ? "bg-[#142d47]" : "bg-[#1A3A5C]"
                    )}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <span
                    className={cn(
                      "mt-7 text-[11px] font-medium",
                      active ? "text-[#1A3A5C]" : "text-muted-foreground"
                    )}
                  >
                    {group.label}
                  </span>
                </Link>
              )
            }

            return (
              <Link
                key={group.key}
                href={group.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center justify-center gap-1"
              >
                <span
                  className={cn(
                    "flex h-7 w-11 items-center justify-center rounded-full transition-colors",
                    active && "bg-[#C8952A]/15"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", active ? "text-[#C8952A]" : "text-muted-foreground")}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    active ? "text-[#1A3A5C]" : "text-muted-foreground"
                  )}
                >
                  {group.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
