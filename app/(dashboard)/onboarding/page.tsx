"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useGoals } from "@/hooks/useGoals"

export default function OnboardingPage() {
  const router = useRouter()
  const { updateGoals, isSaving } = useGoals()
  const [step, setStep] = useState(1)
  const [annualGoal, setAnnualGoal] = useState("220000")

  function finish() {
    updateGoals(
      { annualGoal: Number(annualGoal) },
      {
        onSettled: () => {
          localStorage.setItem("centrai_onboarding_done", "true")
          router.push("/dashboard")
        },
      }
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col gap-6">
          <Progress value={(step / 3) * 100} className="h-2 [&>div]:bg-[#C8952A]" />
          <p className="text-center text-xs font-medium text-muted-foreground">Étape {step}/3</p>

          {step === 1 && (
            <div className="flex flex-col items-center gap-4 text-center">
              <Sparkles className="h-12 w-12 animate-pulse text-[#C8952A]" />
              <h2 className="text-xl font-bold text-[#1A3A5C]">Bienvenue sur CentrAI!</h2>
              <p className="text-sm text-muted-foreground">
                Ton assistant personnel pour gérer tes leads, tes rendez-vous et tes commissions, tout en un seul endroit.
              </p>
              <Button onClick={() => setStep(2)} className="bg-[#1A3A5C] hover:bg-[#142d47]">
                Commencer
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-[#1A3A5C]">Définis ton objectif</h2>
              <div className="flex flex-col gap-2">
                <Label htmlFor="annualGoal">Objectif annuel ($)</Label>
                <Input
                  id="annualGoal"
                  type="number"
                  value={annualGoal}
                  onChange={(e) => setAnnualGoal(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  L&apos;objectif mensuel sera calculé automatiquement (annuel ÷ 12).
                </p>
              </div>
              <Button onClick={() => setStep(3)} className="mt-2 bg-[#1A3A5C] hover:bg-[#142d47]">
                Continuer
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <h2 className="text-xl font-bold text-[#1A3A5C]">Tout est prêt!</h2>
              <p className="text-sm text-muted-foreground">
                Ton tableau de bord est configuré. Tu peux maintenant commencer à gérer tes leads et tes transactions.
              </p>
              <Button onClick={finish} disabled={isSaving} className="bg-[#C8952A] text-white hover:bg-[#b3821f]">
                {isSaving ? "Enregistrement..." : "Accéder au tableau de bord"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
