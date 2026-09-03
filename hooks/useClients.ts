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

function truncateWords(text: string, maxWords = 10): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text.trim()
  return words.slice(0, maxWords).join(" ") + "…"
}

// Filet de securite pour les clients crees avant l'ajout du champ "summary" dedie :
// on prend les 3 premieres lignes non vides des notes existantes plutot que rien afficher.
function fallbackSummaryFromNotes(notes: string | null | undefined): string | undefined {
  if (!notes) return undefined
  const lines = notes
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, 3)
    .map((line) => truncateWords(line))
  return lines.length > 0 ? lines.map((line) => `• ${line}`).join("\n") : undefined
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
    summary: client.summary ?? fallbackSummaryFromNotes(client.notes),
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
