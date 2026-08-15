"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Search, ChevronRight } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge, type Status } from "@/components/ui/StatusBadge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useLeads } from "@/hooks/useLeads"
import { cn } from "@/lib/utils"
import type { LeadSource, LeadStatus } from "@/lib/mocks"

const statusFilters: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "hot", label: "Chaud" },
  { value: "warm", label: "Tiède" },
  { value: "cold", label: "Froid" },
  { value: "new", label: "Nouveau" },
]

const sourceLabels: Record<LeadSource, string> = {
  facebook: "Facebook",
  messenger: "Messenger",
  email: "Courriel",
  sms: "SMS",
}

export default function LeadsPage() {
  const { data: leads, isLoading } = useLeads()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all")
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all")

  const filteredLeads = useMemo(() => {
    return (leads ?? []).filter((lead) => {
      const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter
      return matchesSearch && matchesStatus && matchesSource
    })
  }, [leads, search, statusFilter, sourceFilter])

  return (
    <div>
      <PageHeader title="Leads" subtitle={`${filteredLeads.length} lead(s)`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                size="sm"
                variant={statusFilter === filter.value ? "default" : "outline"}
                className={cn(
                  statusFilter === filter.value && "bg-[#1A3A5C] hover:bg-[#142d47]"
                )}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as LeadSource | "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les sources</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="messenger">Messenger</SelectItem>
              <SelectItem value="email">Courriel</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-lg border border-border bg-white sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Dernier contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-[#1A3A5C]">{lead.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status as Status} />
                    </TableCell>
                    <TableCell>{sourceLabels[lead.source]}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>
                      {format(new Date(lead.lastContact), "d MMM yyyy, HH:mm", { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/leads/${lead.id}`}>
                          Voir <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filteredLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="rounded-lg border border-border bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1A3A5C]">{lead.name}</span>
                  <StatusBadge status={lead.status as Status} />
                </div>
                <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>{sourceLabels[lead.source]} · {lead.phone}</span>
                  <span>Dernier contact: {format(new Date(lead.lastContact), "d MMM yyyy, HH:mm", { locale: fr })}</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Aucun lead ne correspond à ces critères.
            </p>
          )}
        </>
      )}
    </div>
  )
}
