"use client"

import { useState } from "react"
import { Mail, Phone, Building2, StickyNote } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Client } from "@/lib/mocks"
import { useClients } from "@/hooks/useClients"
import { getInitials } from "@/lib/utils"

const typeLabels: Record<NonNullable<Client["type"]>, string> = {
  buyer: "Acheteur",
  seller: "Vendeur",
}

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients()
  const [selected, setSelected] = useState<Client | null>(null)

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Clients" subtitle="Chargement..." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const clientList = clients ?? []

  return (
    <div>
      <PageHeader title="Clients" subtitle={`${clientList.length} client(s)`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clientList.map((client) => (
          <Card
            key={client.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => setSelected(client)}
          >
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback className="bg-[#1A3A5C] text-white">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-[#1A3A5C]">{client.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs capitalize text-muted-foreground">{client.status}</p>
                    {client.type && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {typeLabels[client.type]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {client.property && (
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{client.property}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback className="bg-[#1A3A5C] text-white">
                      {getInitials(selected.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-lg text-[#1A3A5C]">{selected.name}</DialogTitle>
                    {selected.type && (
                      <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {typeLabels[selected.type]}
                      </span>
                    )}
                  </div>
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2 text-foreground/80">
                  <Mail className="h-4 w-4 text-muted-foreground" /> {selected.email}
                </div>
                <div className="flex items-center gap-2 text-foreground/80">
                  <Phone className="h-4 w-4 text-muted-foreground" /> {selected.phone}
                </div>
                {selected.property && (
                  <div className="flex items-center gap-2 text-foreground/80">
                    <Building2 className="h-4 w-4 text-muted-foreground" /> {selected.property}
                  </div>
                )}
                <div className="mt-1 flex items-start gap-2 rounded-md bg-muted p-3 text-foreground/80">
                  <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p>{selected.notes}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
