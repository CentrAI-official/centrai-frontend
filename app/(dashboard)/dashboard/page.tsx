"use client"

import Link from "next/link"
import { format, differenceInHours, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"
import { DollarSign, Users, CalendarClock, Clock3, Sparkles, MapPin } from "lucide-react"
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
  const todayAppointments = (appointments ?? []).filter((apt) =>
    isSameDay(parseLocalDate(apt.date), new Date())
  )

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

      <Card className="mt-6">
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

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-[#1A3A5C]">
              <Sparkles className="h-4 w-4 text-[#C8952A]" />
              Résumé IA de ta journée
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <p className="text-sm leading-relaxed text-foreground/80">{summary?.aiSummary}</p>
            )}
            <Button asChild className="mt-4 bg-[#1A3A5C] hover:bg-[#142d47]">
              <Link href="/assistant">Discuter avec l&apos;assistant</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#1A3A5C]">RDV du jour</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {appointmentsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : todayAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun rendez-vous à venir.</p>
            ) : (
              todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                  <span className="shrink-0 rounded-md bg-[#1A3A5C]/10 px-2 py-1 text-xs font-semibold text-[#1A3A5C]">
                    {apt.time}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#1A3A5C]">{apt.title}</span>
                    <span className="text-xs text-muted-foreground">{apt.clientName}</span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {apt.address}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[#1A3A5C]">Leads chauds</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {leadsLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : (
              hotLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-md border border-border p-3 transition-colors hover:bg-muted"
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

        <Card className="border-red-200 bg-red-50/60">
          <CardHeader>
            <CardTitle className="text-base text-[#1A3A5C]">Sans réponse depuis 24h</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {leadsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : staleLeads.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune relance en retard. Bravo!</p>
            ) : (
              staleLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-md border border-red-200 bg-white p-3 transition-colors hover:bg-red-50"
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
  )
}
