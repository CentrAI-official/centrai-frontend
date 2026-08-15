"use client"

import { useMemo, useState } from "react"
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Clock, MapPin, UserRound } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppointments } from "@/hooks/useAppointments"
import { cn, parseLocalDate } from "@/lib/utils"

const weekdayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

export default function CalendarPage() {
  const { data: appointments, isLoading } = useAppointments()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
    const result: Date[] = []
    let day = start
    while (day <= end) {
      result.push(day)
      day = addDays(day, 1)
    }
    return result
  }, [currentMonth])

  function hasAppointment(date: Date) {
    return (appointments ?? []).some((apt) => isSameDay(parseLocalDate(apt.date), date))
  }

  const selectedAppointments = (appointments ?? []).filter((apt) =>
    isSameDay(parseLocalDate(apt.date), selectedDate)
  )

  return (
    <div>
      <PageHeader title="Calendrier" subtitle="Tes rendez-vous et visites" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base capitalize text-[#1A3A5C]">
                {format(currentMonth, "MMMM yyyy", { locale: fr })}
              </CardTitle>
              <div className="flex gap-1">
                <Button size="icon-sm" variant="outline" onClick={() => setCurrentMonth((m) => subMonths(m, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon-sm" variant="outline" onClick={() => setCurrentMonth((m) => addMonths(m, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <div className="grid grid-cols-7 gap-1 text-center">
                {weekdayLabels.map((label) => (
                  <span key={label} className="py-2 text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                ))}
                {days.map((day) => {
                  const inMonth = isSameMonth(day, currentMonth)
                  const selected = isSameDay(day, selectedDate)
                  const todayFlag = isToday(day)
                  const hasApt = hasAppointment(day)
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "relative flex h-11 flex-col items-center justify-center rounded-md text-sm transition-colors",
                        !inMonth && "text-muted-foreground/40",
                        inMonth && !selected && "text-foreground hover:bg-muted",
                        selected && "bg-[#1A3A5C]/10",
                        todayFlag && "font-semibold"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full",
                          todayFlag && "bg-[#1A3A5C] text-white"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      {hasApt && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-[#C8952A]" />}
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base capitalize text-[#1A3A5C]">
              {format(selectedDate, "EEEE d MMMM", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            ) : selectedAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun rendez-vous ce jour-là.</p>
            ) : (
              selectedAppointments.map((apt) => (
                <div key={apt.id} className="rounded-md border border-border p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#1A3A5C]">
                    <Clock className="h-3.5 w-3.5" /> {apt.time} — {apt.title}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <UserRound className="h-3.5 w-3.5" /> {apt.clientName}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {apt.address}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
