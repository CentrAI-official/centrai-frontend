import { useQuery } from "@tanstack/react-query"
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
  last_seen_at: string | null
  created_at: string
}

function mapApiProperty(property: PropertyApiResponse): Property {
  return {
    id: property.id,
    address: property.address ?? "",
    type: property.property_type ?? "",
    price: Number(property.price ?? 0),
    listedDate: property.last_seen_at ?? property.created_at,
    status: property.status === "sold" ? "sold" : "active",
    bedrooms: Number(property.bedrooms ?? 0),
    bathrooms: Number(property.bathrooms ?? 0),
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
