"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Mail, CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useGoals } from "@/hooks/useGoals"

export default function SettingsPage() {
  const { data: goals, isLoading, updateGoals, isSaving } = useGoals()
  const [monthlyGoal, setMonthlyGoal] = useState("")
  const [annualGoal, setAnnualGoal] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (goals) {
      setMonthlyGoal(String(goals.monthlyGoal))
      setAnnualGoal(String(goals.annualGoal))
    }
  }, [goals])

  function handleSaveGoals() {
    updateGoals(
      { monthlyGoal: Number(monthlyGoal), annualGoal: Number(annualGoal) },
      {
        onSuccess: () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        },
      }
    )
  }

  return (
    <div>
      <PageHeader title="Paramètres" subtitle="Gère ton profil et tes préférences" />

      <Tabs defaultValue="profil">
        <TabsList>
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
          <TabsTrigger value="connexions">Connexions</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="mt-4">
          <Card className="max-w-lg">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" defaultValue="Maxim Pigeon" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Courriel</Label>
                <Input id="email" defaultValue="maxim.pigeon21@gmail.com" disabled />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="514-555-0100" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="agency">Agence</Label>
                <Input id="agency" defaultValue="Courtage Immobilier du Saint-Laurent" />
              </div>
              <Button className="mt-2 w-fit bg-[#1A3A5C] hover:bg-[#142d47]">Enregistrer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectifs" className="mt-4">
          <Card className="max-w-lg">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="monthlyGoal">Objectif mensuel ($)</Label>
                <Input
                  id="monthlyGoal"
                  type="number"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="annualGoal">Objectif annuel ($)</Label>
                <Input
                  id="annualGoal"
                  type="number"
                  value={annualGoal}
                  onChange={(e) => setAnnualGoal(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveGoals}
                  disabled={isSaving}
                  className="w-fit bg-[#C8952A] text-white hover:bg-[#b3821f]"
                >
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                {saved && (
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4" /> Objectifs sauvegardés!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connexions" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base text-[#1A3A5C]">
                    <CalendarDays className="h-4 w-4" /> Google Calendar
                  </CardTitle>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    Non connecté
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="w-fit">
                      Connecter
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sera disponible bientôt</TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base text-[#1A3A5C]">
                    <Mail className="h-4 w-4" /> Gmail
                  </CardTitle>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    Non connecté
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="w-fit">
                      Connecter
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sera disponible bientôt</TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
