import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockClients, Client } from "@/lib/mocks"

interface ClientApiResponse {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  status: string | null
  notes?: string | null
  type?: string | null
  property_id: string | null
  property_address: string | null
  summary: string | null
}

export interface ClientFormInput {
  name: string
  email?: string
  phone?: string
  type: "buyer" | "seller"
  notes?: string
  propertyAddress?: string
  propertyPrice?: number
  propertyType?: string
  propertyBedrooms?: number
  propertyBathrooms?: number
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
    type: client.type === "seller" ? "seller" : "buyer",
    propertyId: client.property_id ?? undefined,
    propertyAddress: client.property_address ?? undefined,
    summary: client.summary ?? undefined,
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

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ClientFormInput) => {
      const { data } = await apiClient.post<ClientApiResponse>("/api/clients", input)
      return mapApiClient(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["properties"] })
    },
  })
}
