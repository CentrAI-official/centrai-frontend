import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockAppointments, Appointment } from "@/lib/mocks"

interface AppointmentApiResponse {
  id: string
  start_time_utc: string
  full_name: string | null
}

interface CalendlyEventResponse {
  uri: string
  name: string | null
  startTime: string
  endTime: string
  status: string
  location: unknown
  invitees: Array<{ name?: string; email?: string }>
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function dateTimeParts(iso: string) {
  const d = new Date(iso)
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  }
}

function mapApiAppointment(apt: AppointmentApiResponse): Appointment {
  const { date, time } = dateTimeParts(apt.start_time_utc)
  return {
    id: apt.id,
    date,
    time,
    title: "Rendez-vous",
    clientName: apt.full_name ?? "",
    address: "",
    type: "rencontre",
  }
}

function locationLabel(location: unknown): string {
  if (typeof location === "string") return location
  if (location && typeof location === "object" && "location" in location) {
    const value = (location as { location?: unknown }).location
    if (typeof value === "string") return value
  }
  return ""
}

function mapCalendlyEvent(event: CalendlyEventResponse): Appointment {
  const { date, time } = dateTimeParts(event.startTime)
  return {
    id: `calendly-${event.uri.split("/").pop()}`,
    date,
    time,
    title: event.name ?? "Rendez-vous",
    clientName: event.invitees[0]?.name ?? "",
    address: locationLabel(event.location),
    type: "rencontre",
  }
}

export function useAppointments() {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const [dbResult, calendlyResult] = await Promise.allSettled([
        apiClient.get<AppointmentApiResponse[]>("/api/appointments"),
        apiClient.get<CalendlyEventResponse[]>("/api/appointments/calendly"),
      ])

      if (dbResult.status === "rejected" && calendlyResult.status === "rejected") {
        return mockAppointments
      }

      const dbAppointments = dbResult.status === "fulfilled" ? dbResult.value.data.map(mapApiAppointment) : []
      const calendlyAppointments =
        calendlyResult.status === "fulfilled" ? calendlyResult.value.data.map(mapCalendlyEvent) : []

      return [...dbAppointments, ...calendlyAppointments].sort((a, b) =>
        (a.date + a.time).localeCompare(b.date + b.time)
      )
    },
  })
}
