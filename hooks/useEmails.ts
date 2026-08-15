import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockEmails, Email } from "@/lib/mocks"

export function useEmails() {
  return useQuery<Email[]>({
    queryKey: ["emails"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get("/api/emails")
        return data
      } catch {
        return mockEmails
      }
    },
  })
}
