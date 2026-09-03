"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mail, Phone, Building2, StickyNote, Plus, Home, Sparkles, ChevronDown } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Client } from "@/lib/mocks"
import { useClients, useCreateClient } from "@/hooks/useClients"
import { getInitials } from "@/lib/utils"

const typeLabels: Record<NonNullable<Client["type"]>, string> = {
  buyer: "Acheteur",
  seller: "Vendeur",
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  type: "buyer" as "buyer" | "seller",
  notes: "",
  propertyAddress: "",
  propertyPrice: "",
  propertyType: "Maison",
  propertyBedrooms: "",
  propertyBathrooms: "",
}

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients()
  const createClient = useCreateClient()
  const searchParams = useSearchParams()

  const [selected, setSelected] = useState<Client | null>(null)
  const [showFullNotes, setShowFullNotes] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [autoOpenedId, setAutoOpenedId] = useState<string | null>(null)

  function openClient(client: Client) {
    setSelected(client)
    setShowFullNotes(false)
  }

  useEffect(() => {
    const openId = searchParams.get("open")
    if (!openId || openId === autoOpenedId || !clients) return
    const match = clients.find((c) => c.id === openId)
    if (match) {
      openClient(match)
      setAutoOpenedId(openId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, clients, autoOpenedId])

  function openCreate() {
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createClient.mutate(
      {
        name: form.name,
        email: form.email.trim() === "" ? undefined : form.email.trim(),
        phone: form.phone.trim() === "" ? undefined : form.phone.trim(),
        type: form.type,
        notes: form.notes.trim() === "" ? undefined : form.notes.trim(),
        propertyAddress: form.type === "seller" && form.propertyAddress.trim() !== ""
          ? form.propertyAddress.trim()
          : undefined,
        propertyPrice: form.propertyPrice === "" ? undefined : Number(form.propertyPrice),
        propertyType: form.propertyType,
        propertyBedrooms: form.propertyBedrooms === "" ? undefined : Number(form.propertyBedrooms),
        propertyBathrooms: form.propertyBathrooms === "" ? undefined : Number(form.propertyBathrooms),
      },
      { onSuccess: () => setDialogOpen(false) }
    )
  }

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
      <div className="mb-4 flex items-center justify-between">
        <PageHeader title="Clients" subtitle={`${clientList.length} client(s)`} />
        <Button onClick={openCreate} className="bg-[#1A3A5C] hover:bg-[#142d47]">
          <Plus className="mr-1 h-4 w-4" /> Nouveau client
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clientList.map((client) => (
          <Card
            key={client.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => openClient(client)}
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
              {client.summary && (
                <div className="flex items-start gap-2 text-sm text-foreground/80">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C8952A]" />
                  <span className="line-clamp-2">{client.summary}</span>
                </div>
              )}
              {client.property && (
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{client.property}</span>
                </div>
              )}
              {client.propertyId && (
                <Link
                  href={`/properties?open=${client.propertyId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs font-medium text-[#1A3A5C] hover:underline"
                >
                  <Home className="h-3.5 w-3.5" /> Voir la propriété : {client.propertyAddress}
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
        {clientList.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun client.</p>
        )}
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
                {selected.propertyId && (
                  <Link
                    href={`/properties?open=${selected.propertyId}`}
                    className="flex items-center gap-1 font-medium text-[#1A3A5C] hover:underline"
                  >
                    <Home className="h-4 w-4" /> Voir la propriété : {selected.propertyAddress}
                  </Link>
                )}
                {selected.summary && (
                  <div className="flex items-start gap-2 rounded-md bg-[#C8952A]/10 p-3 text-foreground/80">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C8952A]" />
                    <p className="font-medium">{selected.summary}</p>
                  </div>
                )}
                {selected.notes && (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setShowFullNotes((prev) => !prev)}
                      className="flex w-fit items-center gap-1 text-xs font-medium text-[#1A3A5C] hover:underline"
                    >
                      {showFullNotes ? "Masquer les notes complètes" : "Voir les notes complètes"}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${showFullNotes ? "rotate-180" : ""}`}
                      />
                    </button>
                    {showFullNotes && (
                      <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-foreground/80">
                        <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <p className="whitespace-pre-line">{selected.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1A3A5C]">Nouveau client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Courriel</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as "buyer" | "seller" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Acheteur</SelectItem>
                  <SelectItem value="seller">Vendeur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {form.type === "seller" && (
              <div className="flex flex-col gap-3 rounded-md border border-border p-3">
                <p className="text-sm font-medium text-[#1A3A5C]">Propriété (optionnel)</p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="propertyAddress">Adresse</Label>
                  <Input
                    id="propertyAddress"
                    value={form.propertyAddress}
                    onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="propertyType">Type</Label>
                    <Input
                      id="propertyType"
                      value={form.propertyType}
                      onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="propertyPrice">Prix ($)</Label>
                    <Input
                      id="propertyPrice"
                      type="number"
                      value={form.propertyPrice}
                      onChange={(e) => setForm({ ...form, propertyPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="propertyBedrooms">Chambres</Label>
                    <Input
                      id="propertyBedrooms"
                      type="number"
                      value={form.propertyBedrooms}
                      onChange={(e) => setForm({ ...form, propertyBedrooms: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="propertyBathrooms">S. de bain</Label>
                    <Input
                      id="propertyBathrooms"
                      type="number"
                      value={form.propertyBathrooms}
                      onChange={(e) => setForm({ ...form, propertyBathrooms: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={createClient.isPending}
                className="bg-[#1A3A5C] hover:bg-[#142d47]"
              >
                Créer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
