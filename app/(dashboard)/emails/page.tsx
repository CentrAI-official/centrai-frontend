"use client"

import { useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { fr } from "date-fns/locale"
import { CheckCircle2, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/ui/StatusBadge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEmails } from "@/hooks/useEmails"
import { cn } from "@/lib/utils"
import type { Email, EmailClassification } from "@/lib/mocks"

const tabs: { value: EmailClassification | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "hot", label: "Leads chauds" },
  { value: "warm", label: "Leads tièdes" },
  { value: "cold", label: "Leads froids" },
  { value: "admin", label: "Admin" },
  { value: "spam", label: "Spam" },
]

function ClassificationBadge({ classification }: { classification: EmailClassification }) {
  if (classification === "admin" || classification === "spam") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          classification === "admin" ? "bg-gray-100 text-gray-700" : "bg-gray-300 text-gray-700"
        )}
      >
        {classification === "admin" ? "Admin" : "Spam"}
      </span>
    )
  }
  return <StatusBadge status={classification} />
}

export default function EmailsPage() {
  const { data: emails, isLoading } = useEmails()
  const [tab, setTab] = useState<EmailClassification | "all">("all")
  const [selected, setSelected] = useState<Email | null>(null)

  const filtered = (emails ?? []).filter((e) => tab === "all" || e.classification === tab)

  return (
    <div>
      <PageHeader title="Courriels" subtitle={`${filtered.length} courriel(s)`} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as EmailClassification | "all")}>
        <TabsList className="flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun courriel dans cette catégorie.</p>
        ) : (
          filtered.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelected(email)}
              className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4 text-left transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1A3A5C]">{email.from}</span>
                  {email.repliedByAI && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                </div>
                <span className="text-sm text-foreground/80">{email.subject}</span>
                <span className="text-xs text-muted-foreground">{email.preview}</span>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                <ClassificationBadge classification={email.classification} />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(email.date), { addSuffix: true, locale: fr })}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-2">
                  <DialogTitle className="text-lg text-[#1A3A5C]">{selected.subject}</DialogTitle>
                  <ClassificationBadge classification={selected.classification} />
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    De: <span className="font-medium text-foreground/80">{selected.from}</span> ({selected.fromEmail})
                  </span>
                  <span>{format(new Date(selected.date), "d MMM yyyy, HH:mm", { locale: fr })}</span>
                </div>
                <p className="rounded-md bg-muted p-3 text-foreground/80">{selected.body}</p>

                {selected.repliedByAI && (
                  <div className="rounded-md border border-[#C8952A]/30 bg-[#C8952A]/5 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-[#C8952A]">
                      <Sparkles className="h-3.5 w-3.5" /> Réponse envoyée par l&apos;IA
                    </div>
                    <p className="text-foreground/80">{selected.aiReply}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
