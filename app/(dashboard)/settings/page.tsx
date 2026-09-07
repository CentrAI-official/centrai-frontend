"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useGoals } from "@/hooks/useGoals"
import { useProfile, useUpdateProfile } from "@/hooks/useProfile"
import { formatCurrency } from "@/lib/utils"

export default function SettingsPage() {
  const { data: goals, isLoading, updateGoals, isSaving } = useGoals()
  const [annualGoal, setAnnualGoal] = useState("")
  const [saved, setSaved] = useState(false)

  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [agencyName, setAgencyName] = useState("")
  const [profileSaved, setProfileSaved] = useState(false)

  useEffect(() => {
    if (goals) {
      setAnnualGoal(String(goals.annualGoal))
    }
  }, [goals])

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName)
      setPhone(profile.phone)
      setAgencyName(profile.agencyName)
    }
  }, [profile])

  function handleSaveGoals() {
    updateGoals(
      { annualGoal: Number(annualGoal) },
      {
        onSuccess: () => {
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        },
      }
    )
  }

  function handleSaveProfile() {
    updateProfile.mutate(
      { displayName, phone, agencyName },
      {
        onSuccess: () => {
          setProfileSaved(true)
          setTimeout(() => setProfileSaved(false), 3000)
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
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isProfileLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Courriel</Label>
                <Input id="email" value={profile?.email ?? ""} disabled />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isProfileLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="agency">Agence</Label>
                <Input
                  id="agency"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  disabled={isProfileLoading}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveProfile}
                  disabled={updateProfile.isPending}
                  className="mt-2 w-fit bg-[#1A3A5C] hover:bg-[#142d47]"
                >
                  {updateProfile.isPending ? "Sauvegarde..." : "Enregistrer"}
                </Button>
                {profileSaved && (
                  <span className="mt-2 flex items-center gap-1 text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4" /> Profil sauvegardé!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectifs" className="mt-4">
          <Card className="max-w-lg">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="annualGoal">Objectif annuel ($)</Label>
                <Input
                  id="annualGoal"
                  type="number"
                  value={annualGoal}
                  onChange={(e) => setAnnualGoal(e.target.value)}
                  disabled={isLoading}
                />
                {goals && Number(annualGoal) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Objectif mensuel calculé automatiquement : {formatCurrency(Number(annualGoal) / 12)}
                  </p>
                )}
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
                  <span className="rounded-full bg-[#C8952A]/15 px-2.5 py-0.5 text-xs font-medium text-[#C8952A]">
                    Bientôt disponible
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cette intégration n&apos;est pas encore disponible.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
