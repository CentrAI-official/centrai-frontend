import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { mockLeads, Lead, LeadStatus, LeadSource } from "@/lib/mocks"

const VALID_STATUSES: LeadStatus[] = ["hot", "warm", "cold", "new"]
const VALID_SOURCES: LeadSource[] = ["facebook", "messenger", "email", "sms"]

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
}

function mapContactToLead(contact: ContactApiResponse): Lead {
  const status = VALID_STATUSES.includes(contact.status as LeadStatus)
    ? (contact.status as LeadStatus)
    : "new"
  const source = VALID_SOURCES.includes(contact.source as LeadSource)
    ? (contact.source as LeadSource)
    : "email"

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
    conversations: [],
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
