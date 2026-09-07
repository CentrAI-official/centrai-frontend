import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

export interface Goals {
  monthlyGoal: number
  annualGoal: number
}

// L'objectif mensuel n'est jamais saisi par le courtier : il est toujours
// derive de l'objectif annuel (annuel / 12), calcule cote serveur.
const mockGoals: Goals = {
  monthlyGoal: 220000 / 12,
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
    mutationFn: async (input: { annualGoal: number }) => {
      try {
        const { data } = await apiClient.put<Goals>("/api/settings/goals", input)
        return data
      } catch {
        return { annualGoal: input.annualGoal, monthlyGoal: input.annualGoal / 12 }
      }
    },
    onSuccess: (goals) => {
      queryClient.setQueryData(["goals"], goals)
    },
  })

  return { ...query, updateGoals: mutation.mutate, isSaving: mutation.isPending }
}
