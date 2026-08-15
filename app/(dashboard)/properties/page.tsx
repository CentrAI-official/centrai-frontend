"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { BedDouble, Bath, CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Skeleton } from "@/components/ui/skeleton"
import { useProperties } from "@/hooks/useProperties"
import { formatCurrency, parseLocalDate } from "@/lib/utils"

export default function PropertiesPage() {
  const { data: properties, isLoading } = useProperties()

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
  const soldProperties = propertyList.filter((p) => p.status === "sold")

  return (
    <div>
      <PageHeader title="Propriétés" subtitle={`${propertyList.length} propriété(s)`} />

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Actives ({activeProperties.length})</TabsTrigger>
          <TabsTrigger value="sold">Vendues ({soldProperties.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeProperties.map((property) => (
              <Card key={property.id}>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-[#1A3A5C]">{property.address}</p>
                    <StatusBadge status="active" />
                  </div>
                  <p className="text-sm text-muted-foreground">{property.type}</p>
                  <p className="text-xl font-bold text-[#1A3A5C]">{formatCurrency(property.price)}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {format(parseLocalDate(property.listedDate), "d MMM yyyy", { locale: fr })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sold" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {soldProperties.map((property) => (
              <Card key={property.id}>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-[#1A3A5C]">{property.address}</p>
                    <StatusBadge status="sold" />
                  </div>
                  <p className="text-sm text-muted-foreground">{property.type}</p>
                  <p className="text-xl font-bold text-[#1A3A5C]">
                    {formatCurrency(property.soldPrice ?? property.price)}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    Commission générée: {formatCurrency(property.commission ?? 0)}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
