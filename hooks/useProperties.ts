import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockProperties, Property } from "@/lib/mocks"

interface PropertyApiResponse {
  id: string
  address: string | null
  property_type: string | null
  price: string | number | null
  bedrooms: string | number | null
  bathrooms: string | number | null
  status: string | null
  commission_percent: string | number | null
  last_seen_at: string | null
  created_at: string
  url: string | null
  client_id: string | null
  client_name: string | null
  commission_amount: string | number | null
}

export interface PropertyFormInput {
  address: string
  type: string
  price: number
  bedrooms: number
  bathrooms: number
  status: "active" | "sold"
  commissionPercent?: number
  url?: string
  clientName?: string
  clientEmail?: string
  clientPhone?: string
}

function mapApiProperty(property: PropertyApiResponse): Property {
  return {
    id: property.id,
    address: property.address ?? "",
    type: property.property_type ?? "",
    price: Number(property.price ?? 0),
    listedDate: (property.last_seen_at ?? property.created_at).slice(0, 10),
    status: property.status === "sold" ? "sold" : "active",
    bedrooms: Number(property.bedrooms ?? 0),
    bathrooms: Number(property.bathrooms ?? 0),
    commissionPercent: property.commission_percent != null ? Number(property.commission_percent) : undefined,
    url: property.url ?? undefined,
    clientId: property.client_id ?? undefined,
    clientName: property.client_name ?? undefined,
    commission: property.commission_amount != null ? Number(property.commission_amount) : undefined,
  }
}

export function useProperties() {
  return useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<PropertyApiResponse[]>("/api/properties")
        return data.map(mapApiProperty)
      } catch {
        return mockProperties
      }
    },
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PropertyFormInput) => {
      const { data } = await apiClient.post<PropertyApiResponse>("/api/properties", input)
      return mapApiProperty(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["commissions"] })
    },
  })
}

export function useUpdateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: PropertyFormInput & { id: string }) => {
      const { data } = await apiClient.put<PropertyApiResponse>(`/api/properties/${id}`, input)
      return mapApiProperty(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] })
      queryClient.invalidateQueries({ queryKey: ["commissions"] })
    },
  })
}
