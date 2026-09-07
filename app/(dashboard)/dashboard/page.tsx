"use client"

import Link from "next/link"
import { format, differenceInHours } from "date-fns"
import { fr } from "date-fns/locale"
import { DollarSign, Users, CalendarClock, Clock3, MapPin } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { KPICard } from "@/components/ui/KPICard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboard } from "@/hooks/useDashboard"
import { useLeads } from "@/hooks/useLeads"
import { useAppointments } from "@/hooks/useAppointments"
import { formatCurrency, parseLocalDate } from "@/lib/utils"

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboard()
  const { data: leads, isLoading: leadsLoading } = useLeads()
  const { data: appointments, isLoading: appointmentsLoading } = useAppointments()

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr })

  const hotLeads = (leads ?? []).filter((lead) => lead.status === "hot").slice(0, 5)
  const staleLeads = (leads ?? []).filter(
    (lead) => differenceInHours(new Date(), new Date(lead.lastContact)) >= 24
  )

  function toDateTime(apt: { date: string; time: string }) {
    const dt = parseLocalDate(apt.date)
    const [hours, minutes] = apt.time.split(":").map(Number)
    dt.setHours(hours || 0, minutes || 0, 0, 0)
    return dt
  }

  const now = new Date()
  const upcomingAppointments = (appointments ?? [])
    .filter((apt) => toDateTime(apt) >= now)
    .sort((a, b) => toDateTime(a).getTime() - toDateTime(b).getTime())
    .slice(0, 3)

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle={today.charAt(0).toUpperCase() + today.slice(1)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)
        ) : (
          <>
            <KPICard
              title="Commissions ce mois"
              value={formatCurrency(summary?.commissionsThisMonth ?? 0)}
              icon={DollarSign}
              color="#C8952A"
            />
            <KPICard
              title="Leads actifs"
              value={summary?.activeLeads ?? 0}
              subtitle={`${summary?.hotLeadsCount ?? 0} chauds`}
              icon={Users}
              color="#1A3A5C"
            />
            <KPICard
              title="RDV aujourd'hui"
              value={summary?.appointmentsToday ?? 0}
              icon={CalendarClock}
              color="#1A3A5C"
            />
            <KPICard
              title="Relances dues"
              value={summary?.pendingFollowUps ?? 0}
              icon={Clock3}
              color="#C8952A"
            />
          </>
        )}
      </div>

      <Card size="sm" className="mt-4">
        <CardHeader>
          <CardTitle className="text-base text-[#1A3A5C]">Objectif mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-semibold text-[#1A3A5C]">{summary?.monthlyProgress ?? 0}%</span>
          </div>
          <Progress value={summary?.monthlyProgress ?? 0} className="h-2 [&>div]:bg-[#C8952A]" />
          <p className="mt-2 text-xs text-muted-foreground">
            {formatCurrency(summary?.commissionsThisMonth ?? 0)} sur {formatCurrency(summary?.monthlyGoal ?? 0)}
          </p>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch">
        <Card size="sm" className="flex flex-col lg:h-[260px]">
          <CardHeader>
            <CardTitle className="text-base text-[#1A3A5C]">Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {appointmentsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
            ) : upcomingAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun rendez-vous à venir.</p>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-start gap-2 rounded-md border border-border p-2">
                  <span className="flex shrink-0 flex-col items-center rounded-md bg-[#1A3A5C]/10 px-2 py-1 text-xs font-semibold text-[#1A3A5C]">
                    <span>{format(parseLocalDate(apt.date), "d MMM", { locale: fr })}</span>
                    <span>{apt.time}</span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#1A3A5C]">{apt.title}</span>
                    <span className="text-xs text-muted-foreground">{apt.clientName}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {apt.address}
                    </span>
                  </div>
                </div>
              ))
            )}
            <Button asChild variant="outline" size="sm" className="mt-auto w-fit">
              <Link href="/calendar">Voir le calendrier</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:h-[260px]">
          <Card size="sm" className="flex flex-1 flex-col">
            <CardHeader>
              <CardTitle className="text-base text-[#1A3A5C]">Leads chauds</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
              {leadsLoading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              ) : (
                hotLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between rounded-md border border-border p-2 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1A3A5C]">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.interest}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card size="sm" className="flex flex-1 flex-col border-red-200 bg-red-50/60">
            <CardHeader>
              <CardTitle className="text-base text-[#1A3A5C]">Sans réponse depuis 24h</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
              {leadsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              ) : staleLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune relance en retard. Bravo!</p>
              ) : (
                staleLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between rounded-md border border-red-200 bg-white p-2 transition-colors hover:bg-red-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1A3A5C]">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.interest}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
