"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronRight, ChevronDown, Mail, Phone, Wallet, Tag, CalendarClock, Home, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge, type Status } from "@/components/ui/StatusBadge"
import { useLead } from "@/hooks/useLeads"
import type { LeadSource } from "@/lib/mocks"

function formatBoolean(value: boolean | null | undefined) {
  if (value === true) return "Oui"
  if (value === false) return "Non"
  return null
}

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
  const [showFullHistory, setShowFullHistory] = useState(false)

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

        {(lead.buyerQualification || lead.sellerQualification) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1A3A5C]">Détails du projet</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {lead.projectType === "seller" ? (
                <>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Home className="h-4 w-4 text-muted-foreground" /> Vente
                  </div>
                  {lead.sellerQualification?.villeOuAdresse && (
                    <div className="text-foreground/80">
                      <span className="text-muted-foreground">Adresse ou ville : </span>
                      {lead.sellerQualification.villeOuAdresse}
                    </div>
                  )}
                  {lead.sellerQualification?.typeDePropriete && (
                    <div className="text-foreground/80">
                      <span className="text-muted-foreground">Type de propriété : </span>
                      {lead.sellerQualification.typeDePropriete}
                    </div>
                  )}
                  {lead.sellerQualification?.quandVendre && (
                    <div className="text-foreground/80">
                      <span className="text-muted-foreground">Délai de vente : </span>
                      {lead.sellerQualification.quandVendre}
                    </div>
                  )}
                  {formatBoolean(lead.sellerQualification?.dejaUnCourtier) && (
                    <div className="text-foreground/80">
                      <span className="text-muted-foreground">Déjà un courtier : </span>
                      {formatBoolean(lead.sellerQualification?.dejaUnCourtier)}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Home className="h-4 w-4 text-muted-foreground" /> Achat
                  </div>
                  {lead.buyerQualification?.villeOuSecteurRecherche && (
                    <div className="text-foreground/80">
                      <span className="text-muted-foreground">Secteur recherché : </span>
                      {lead.buyerQualification.villeOuSecteurRecherche}
                    </div>
                  )}
                  {lead.buyerQualification?.typeDePropriete && (
                    <div className="text-foreground/80">
                      <span className="text-muted-foreground">Type de propriété : </span>
                      {lead.buyerQualification.typeDePropriete}
                    </div>
                  )}
                  {lead.buyerQualification?.delaiAchat && (
                    <div className="text-foreground/80">
                      <span className="text-muted-foreground">Délai d&apos;achat : </span>
                      {lead.buyerQualification.delaiAchat}
                    </div>
                  )}
                  {formatBoolean(lead.buyerQualification?.proprieteAVendre) && (
                    <div className="text-foreground/80">
                      <span className="text-muted-foreground">Propriété à vendre : </span>
                      {formatBoolean(lead.buyerQualification?.proprieteAVendre)}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {lead.appointments && lead.appointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1A3A5C]">Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              {lead.appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(appointment.startTimeUtc), "d MMM yyyy, HH:mm", { locale: fr })}
                  </div>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-700">
                    {appointment.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[#1A3A5C]">
              {lead.conversationSummary ? (
                <>
                  <Sparkles className="h-4 w-4 text-[#C8952A]" /> Résumé de la conversation
                </>
              ) : (
                "Historique des conversations"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {lead.conversationSummary && (
              <>
                <p className="whitespace-pre-line text-sm text-foreground/80">{lead.conversationSummary}</p>
                <button
                  type="button"
                  onClick={() => setShowFullHistory((prev) => !prev)}
                  className="flex w-fit items-center gap-1 text-xs font-medium text-[#1A3A5C] hover:underline"
                >
                  {showFullHistory ? "Masquer l'historique complet" : "Voir l'historique complet"}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${showFullHistory ? "rotate-180" : ""}`}
                  />
                </button>
              </>
            )}
            {(showFullHistory || !lead.conversationSummary) && (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
