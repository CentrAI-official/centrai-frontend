"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard } from "lucide-react"

export function MobileDashboardButton() {
  const pathname = usePathname()

  if (pathname === "/dashboard") return null

  return (
    <Link
      href="/dashboard"
      aria-label="Retour au tableau de bord"
      className="fixed top-2 left-1/2 z-50 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#1A3A5C] shadow-md ring-1 ring-border transition-colors hover:bg-muted lg:hidden"
    >
      <LayoutDashboard className="h-3.5 w-3.5" />
      Tableau de bord
    </Link>
  )
}
