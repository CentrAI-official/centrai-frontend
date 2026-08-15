import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockAppointments, Appointment } from "@/lib/mocks"

interface AppointmentApiResponse {
  id: string
  start_time_utc: string
  full_name: string | null
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function mapApiAppointment(apt: AppointmentApiResponse): Appointment {
  const start = new Date(apt.start_time_utc)

  return {
    id: apt.id,
    date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
    time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
    title: "Rendez-vous",
    clientName: apt.full_name ?? "",
    address: "",
    type: "rencontre",
  }
}

export function useAppointments() {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<AppointmentApiResponse[]>("/api/appointments")
        return data.map(mapApiAppointment)
      } catch {
        return mockAppointments
      }
    },
  })
}
