import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockLeads, Lead, LeadStatus, LeadSource, ConversationEntry } from "@/lib/mocks"

const VALID_STATUSES: LeadStatus[] = ["hot", "warm", "cold", "new"]
const VALID_SOURCES: LeadSource[] = ["facebook", "messenger", "email", "sms"]

interface MessageApiResponse {
  id: string
  provider: string | null
  role: string
  text: string | null
  content: string | null
  created_at: string
}

interface BuyerQualificationApiResponse {
  ville_ou_secteur_recherche: string | null
  type_de_propriete: string | null
  delai_achat: string | null
  propriete_a_vendre: boolean | null
}

interface SellerQualificationApiResponse {
  quand_vendre: string | null
  type_de_propriete: string | null
  ville_ou_adresse: string | null
  deja_un_courtier: boolean | null
}

interface AppointmentApiResponse {
  id: string
  start_time_utc: string
  end_time_utc: string
  status: string
}

interface ContactApiResponse {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  source: string | null
  project_type: string | null
  status?: string
  created_at: string
  updated_at: string
  messages?: MessageApiResponse[]
  buyer_qualification?: BuyerQualificationApiResponse
  seller_qualification?: SellerQualificationApiResponse
  appointments?: AppointmentApiResponse[]
  conversation_notes: string | null
  is_client?: boolean
}

function mapMessageToConversationEntry(message: MessageApiResponse): ConversationEntry {
  const channel = VALID_SOURCES.includes(message.provider as LeadSource)
    ? (message.provider as LeadSource)
    : "facebook"
  const sender = message.role === "assistant" ? "ia" : message.role === "user" ? "lead" : "agent"

  return {
    id: message.id,
    date: message.created_at,
    channel,
    sender,
    message: message.text ?? message.content ?? "",
  }
}

function mapContactToLead(contact: ContactApiResponse): Lead {
  const status = VALID_STATUSES.includes(contact.status as LeadStatus)
    ? (contact.status as LeadStatus)
    : "new"
  const source = VALID_SOURCES.includes(contact.source as LeadSource)
    ? (contact.source as LeadSource)
    : "email"
  const projectType = contact.project_type === "buyer" || contact.project_type === "seller"
    ? contact.project_type
    : null

  return {
    id: contact.id,
    name: contact.full_name ?? "",
    status,
    source,
    phone: contact.phone ?? "",
    email: contact.email ?? "",
    budget: "",
    interest: contact.project_type ?? "",
    lastContact: contact.updated_at,
    createdAt: contact.created_at,
    conversations: (contact.messages ?? []).map(mapMessageToConversationEntry),
    projectType,
    buyerQualification: contact.buyer_qualification
      ? {
          villeOuSecteurRecherche: contact.buyer_qualification.ville_ou_secteur_recherche,
          typeDePropriete: contact.buyer_qualification.type_de_propriete,
          delaiAchat: contact.buyer_qualification.delai_achat,
          proprieteAVendre: contact.buyer_qualification.propriete_a_vendre,
        }
      : undefined,
    sellerQualification: contact.seller_qualification
      ? {
          quandVendre: contact.seller_qualification.quand_vendre,
          typeDePropriete: contact.seller_qualification.type_de_propriete,
          villeOuAdresse: contact.seller_qualification.ville_ou_adresse,
          dejaUnCourtier: contact.seller_qualification.deja_un_courtier,
        }
      : undefined,
    appointments: (contact.appointments ?? []).map((appointment) => ({
      id: appointment.id,
      startTimeUtc: appointment.start_time_utc,
      endTimeUtc: appointment.end_time_utc,
      status: appointment.status,
    })),
    conversationSummary: contact.conversation_notes ?? undefined,
    isClient: contact.is_client ?? false,
  }
}

export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<ContactApiResponse[]>("/api/leads")
        return data.map(mapContactToLead)
      } catch {
        return mockLeads
      }
    },
  })
}

export function useLead(id: string) {
  return useQuery<Lead | undefined>({
    queryKey: ["leads", id],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<ContactApiResponse>(`/api/leads/${id}`)
        return mapContactToLead(data)
      } catch {
        return mockLeads.find((lead) => lead.id === id)
      }
    },
  })
}

export function useConvertLeadToClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (leadId: string) => {
      const { data } = await apiClient.post(`/api/leads/${leadId}/convert-to-client`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}
