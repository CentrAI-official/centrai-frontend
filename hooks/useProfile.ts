import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

export interface Profile {
  displayName: string
  email: string | null
  phone: string
  agencyName: string
}

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/settings/profile")
      return data
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { displayName: string; phone: string; agencyName: string }) => {
      const { data } = await apiClient.put<Profile>("/api/settings/profile", input)
      return data
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile"], profile)
    },
  })
}
