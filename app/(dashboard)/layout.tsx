"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  DollarSign,
  Calendar,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { isAuthenticated, removeToken } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { MobileBottomNav } from "@/components/layout/MobileBottomNav"
import { MobileDashboardButton } from "@/components/layout/MobileDashboardButton"

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/clients", label: "Clients", icon: UserCheck },
  { href: "/properties", label: "Propriétés", icon: Building2 },
  { href: "/commissions", label: "Commissions", icon: DollarSign },
  { href: "/calendar", label: "Calendrier", icon: Calendar },
  { href: "/assistant", label: "Assistant IA", icon: Bot, beta: true },
  { href: "/settings", label: "Paramètres", icon: Settings },
]

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  function handleLogout() {
    // Vide le cache local pour qu'aucune donnee du compte qui se deconnecte
    // (leads/clients/objectifs) ne reste visible pour le prochain compte connecte.
    queryClient.clear()
    removeToken()
    router.push("/login")
  }

  return (
    <div className="flex h-full flex-col bg-[#1A3A5C] text-white">
      <div className="px-6 py-6">
        <span className="text-xl font-bold tracking-wide text-white">CENTRAI</span>
      </div>
      <nav className="flex-1 px-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-[#C8952A] text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.beta && (
                    <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
                      Bêta
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login")
      return
    }
    if (
      pathname !== "/onboarding" &&
      typeof window !== "undefined" &&
      localStorage.getItem("centrai_onboarding_done") !== "true"
    ) {
      router.replace("/onboarding")
      return
    }
    setChecked(true)
  }, [router, pathname])

  if (!checked) return null

  if (pathname === "/onboarding") {
    return <div className="flex min-h-screen bg-[#F8F9FA]">{children}</div>
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <MobileDashboardButton />

      <aside className="hidden w-[240px] shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-[240px]">
          <SidebarContent pathname={pathname} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[240px]">
            <div className="relative h-full">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-6 text-white/80 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
          <span className="text-lg font-bold text-[#1A3A5C]">CENTRAI</span>
          <button onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
            <Menu className="h-6 w-6 text-[#1A3A5C]" />
          </button>
        </header>
        <main className="min-w-0 flex-1 p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
