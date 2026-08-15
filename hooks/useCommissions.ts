import { useQuery } from "@tanstack/react-query"
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
