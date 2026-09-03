"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { BedDouble, Bath, CalendarDays, Percent, Plus, Link as LinkIcon, User } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useProperties, useCreateProperty, useUpdateProperty } from "@/hooks/useProperties"
import { formatCurrency, parseLocalDate } from "@/lib/utils"
import type { Property } from "@/lib/mocks"

const emptyForm = {
  address: "",
  type: "Maison",
  price: "",
  bedrooms: "",
  bathrooms: "",
  status: "active" as "active" | "pending" | "sold",
  commissionPercent: "",
  url: "",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
}

export default function PropertiesPage() {
  const { data: properties, isLoading } = useProperties()
  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const searchParams = useSearchParams()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(property: Property) {
    setEditingId(property.id)
    setForm({
      address: property.address,
      type: property.type,
      price: String(property.price),
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      status: property.status,
      commissionPercent: property.commissionPercent != null ? String(property.commissionPercent) : "",
      url: property.url ?? "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
    })
    setDialogOpen(true)
  }

  const [autoOpenedId, setAutoOpenedId] = useState<string | null>(null)
  useEffect(() => {
    const openId = searchParams.get("open")
    if (!openId || openId === autoOpenedId || !properties) return
    const match = properties.find((p) => p.id === openId)
    if (match) {
      openEdit(match)
      setAutoOpenedId(openId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, properties, autoOpenedId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const input = {
      address: form.address,
      type: form.type,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms || 0),
      bathrooms: Number(form.bathrooms || 0),
      status: form.status,
      commissionPercent: form.commissionPercent === "" ? undefined : Number(form.commissionPercent),
      url: form.url.trim() === "" ? undefined : form.url.trim(),
    }
    if (editingId) {
      updateProperty.mutate({ id: editingId, ...input }, { onSuccess: () => setDialogOpen(false) })
    } else {
      createProperty.mutate(
        {
          ...input,
          clientName: form.clientName.trim() === "" ? undefined : form.clientName.trim(),
          clientEmail: form.clientEmail.trim() === "" ? undefined : form.clientEmail.trim(),
          clientPhone: form.clientPhone.trim() === "" ? undefined : form.clientPhone.trim(),
        },
        { onSuccess: () => setDialogOpen(false) }
      )
    }
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Propriétés" subtitle="Chargement..." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const propertyList = properties ?? []
  const activeProperties = propertyList.filter((p) => p.status === "active")
  const pendingProperties = propertyList.filter((p) => p.status === "pending")
  const soldProperties = propertyList.filter((p) => p.status === "sold")

  function renderPropertyCard(property: Property) {
    return (
      <Card
        key={property.id}
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => openEdit(property)}
      >
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-[#1A3A5C]">{property.address}</p>
            <StatusBadge status={property.status} />
          </div>
          <p className="text-sm text-muted-foreground">{property.type}</p>
          <p className="text-xl font-bold text-[#1A3A5C]">
            {formatCurrency(property.status === "sold" ? property.soldPrice ?? property.price : property.price)}
          </p>
          {property.status === "sold" && (
            <p className="text-sm font-medium text-green-600">
              Commission générée: {formatCurrency(property.commission ?? 0)}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
            </span>
            {property.status === "active" && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {format(parseLocalDate(property.listedDate), "d MMM yyyy", { locale: fr })}
              </span>
            )}
          </div>
          {property.commissionPercent != null && (
            <span className="flex items-center gap-1 text-xs font-medium text-[#C8952A]">
              <Percent className="h-3.5 w-3.5" /> {property.commissionPercent}% de commission
            </span>
          )}
          {property.url && (
            <a
              href={property.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-medium text-[#1A3A5C] hover:underline"
            >
              <LinkIcon className="h-3.5 w-3.5" /> Voir l&apos;annonce
            </a>
          )}
          {property.clientId && (
            <Link
              href={`/clients?open=${property.clientId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-medium text-[#1A3A5C] hover:underline"
            >
              <User className="h-3.5 w-3.5" /> Voir le client : {property.clientName}
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <PageHeader title="Propriétés" subtitle={`${propertyList.length} propriété(s)`} />
        <Button onClick={openCreate} className="bg-[#1A3A5C] hover:bg-[#142d47]">
          <Plus className="mr-1 h-4 w-4" /> Nouvelle propriété
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Actives ({activeProperties.length})</TabsTrigger>
          <TabsTrigger value="pending">En attente ({pendingProperties.length})</TabsTrigger>
          <TabsTrigger value="sold">Vendues ({soldProperties.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeProperties.map(renderPropertyCard)}
            {activeProperties.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune propriété active.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendingProperties.map(renderPropertyCard)}
            {pendingProperties.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune propriété en attente.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sold" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {soldProperties.map(renderPropertyCard)}
            {soldProperties.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune propriété vendue.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1A3A5C]">
              {editingId ? "Modifier la propriété" : "Nouvelle propriété"}
            </DialogTitle>
          </DialogHeader>
          {editingId && (() => {
            const editingProperty = propertyList.find((p) => p.id === editingId)
            if (!editingProperty?.clientId) return null
            return (
              <Link
                href={`/clients?open=${editingProperty.clientId}`}
                className="-mt-2 flex w-fit items-center gap-1 text-xs font-medium text-[#1A3A5C] hover:underline"
              >
                <User className="h-3.5 w-3.5" /> Client vendeur : {editingProperty.clientName}
              </Link>
            )
          })()}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="url">Lien de la propriété</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.centris.ca/..."
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Prix ($)</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="bedrooms">Chambres</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bathrooms">S. de bain</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="commissionPercent">Commission (%)</Label>
                <Input
                  id="commissionPercent"
                  type="number"
                  step="0.1"
                  value={form.commissionPercent}
                  onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Statut</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as "active" | "pending" | "sold" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="sold">Vendue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!editingId && (
              <div className="flex flex-col gap-3 rounded-md border border-border p-3">
                <p className="text-sm font-medium text-[#1A3A5C]">Client vendeur (optionnel)</p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientName">Nom</Label>
                  <Input
                    id="clientName"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="clientEmail">Courriel</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="clientPhone">Téléphone</Label>
                    <Input
                      id="clientPhone"
                      value={form.clientPhone}
                      onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={createProperty.isPending || updateProperty.isPending}
                className="bg-[#1A3A5C] hover:bg-[#142d47]"
              >
                {editingId ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
