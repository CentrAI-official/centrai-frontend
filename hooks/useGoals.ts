import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

export interface Goals {
  monthlyGoal: number
  annualGoal: number
}

const mockGoals: Goals = {
  monthlyGoal: 25000,
  annualGoal: 220000,
}

export function useGoals() {
  const queryClient = useQueryClient()

  const query = useQuery<Goals>({
    queryKey: ["goals"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get("/api/settings/goals")
        return data
      } catch {
        return mockGoals
      }
    },
  })

  const mutation = useMutation({
    mutationFn: async (goals: Goals) => {
      try {
        const { data } = await apiClient.put("/api/settings/goals", goals)
        return data
      } catch {
        return goals
      }
    },
    onSuccess: (goals) => {
      queryClient.setQueryData(["goals"], goals)
    },
  })

  return { ...query, updateGoals: mutation.mutate, isSaving: mutation.isPending }
}
