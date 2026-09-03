import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockCommissions, Commission } from "@/lib/mocks"

export function useCommissions() {
  return useQuery<Commission[]>({
    queryKey: ["commissions"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get("/api/commissions")
        return data
      } catch {
        return mockCommissions
      }
    },
  })
}

export function useMarkCommissionPaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.put<Commission>(`/api/commissions/${id}`, { status: "paid" })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commissions"] })
    },
  })
}
