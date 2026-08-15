"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronRight, Mail, Phone, Wallet, Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge, type Status } from "@/components/ui/StatusBadge"
import { useLead } from "@/hooks/useLeads"
import type { LeadSource } from "@/lib/mocks"

const sourceLabels: Record<LeadSource, string> = {
  facebook: "Facebook",
  messenger: "Messenger",
  email: "Courriel",
  sms: "SMS",
}

const senderLabels: Record<string, { label: string; className: string }> = {
  lead: { label: "Lead", className: "bg-[#1A3A5C] text-white" },
  agent: { label: "Toi", className: "bg-[#C8952A] text-white" },
  ia: { label: "IA", className: "bg-gray-200 text-gray-800" },
}

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>()
  const { data: lead, isLoading } = useLead(params.id)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!lead) {
    return <p className="text-sm text-muted-foreground">Lead introuvable.</p>
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/leads" className="hover:text-[#1A3A5C]">
          Leads
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#1A3A5C]">{lead.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#1A3A5C]">{lead.name}</CardTitle>
              <StatusBadge status={lead.status as Status} />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2 text-foreground/80">
              <Phone className="h-4 w-4 text-muted-foreground" /> {lead.phone}
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Mail className="h-4 w-4 text-muted-foreground" /> {lead.email}
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Wallet className="h-4 w-4 text-muted-foreground" /> {lead.budget}
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Tag className="h-4 w-4 text-muted-foreground" /> {lead.interest}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Source: {sourceLabels[lead.source]}</span>
              <span>Créé le {format(new Date(lead.createdAt), "d MMM yyyy", { locale: fr })}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#1A3A5C]">Historique des conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-4 border-l border-border pl-4">
              {lead.conversations.map((entry) => {
                const sender = senderLabels[entry.sender]
                return (
                  <li key={entry.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#C8952A]" />
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sender.className}`}>
                        {sender.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(entry.date), "d MMM yyyy, HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/80">{entry.message}</p>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
