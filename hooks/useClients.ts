import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockClients, Client } from "@/lib/mocks"

interface ClientApiResponse {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  status: string | null
  notes?: string | null
}

function mapApiClient(client: ClientApiResponse): Client {
  return {
    id: client.id,
    name: client.full_name ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    property: "",
    status: client.status === "active" ? "actif" : "ancien",
    notes: client.notes ?? "",
  }
}

export function useClients() {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<ClientApiResponse[]>("/api/clients")
        return data.map(mapApiClient)
      } catch {
        return mockClients
      }
    },
  })
}
