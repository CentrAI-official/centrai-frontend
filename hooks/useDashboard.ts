import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockDashboardSummary, DashboardSummary } from "@/lib/mocks"

interface DashboardApiResponse {
  totalLeads: number
  hotLeadsCount: number
  commissionsThisMonth: number
  todayAppointments: unknown[]
  monthlyGoal: number
  monthlyProgress: number
}

function mapApiSummary(summary: DashboardApiResponse): DashboardSummary {
  return {
    commissionsThisMonth: summary.commissionsThisMonth,
    activeLeads: summary.totalLeads,
    hotLeadsCount: summary.hotLeadsCount,
    appointmentsToday: summary.todayAppointments.length,
    monthlyGoal: summary.monthlyGoal,
    monthlyProgress: summary.monthlyProgress,
    // Pas encore de source de données pour ces 2 champs (relances, résumé IA).
    pendingFollowUps: 0,
    aiSummary: "",
  }
}

export function useDashboard() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<DashboardApiResponse>("/api/dashboard/summary")
        return mapApiSummary(data)
      } catch {
        return mockDashboardSummary
      }
    },
  })
}
