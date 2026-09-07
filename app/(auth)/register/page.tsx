"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import { setToken } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [agencyName, setAgencyName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    setLoading(true)
    try {
      const { data } = await apiClient.post("/api/auth/register", {
        agencyName,
        displayName,
        email,
        password,
      })
      queryClient.clear()
      setToken(data.token)
      router.push("/onboarding")
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Impossible de créer le compte. Veuillez réessayer."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-wide text-[#1A3A5C]">CENTRAI</h1>
      <Card className="w-full max-w-sm">
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">Nom complet</Label>
              <Input
                id="displayName"
                placeholder="Jean Tremblay"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="agencyName">Nom de l&apos;agence</Label>
              <Input
                id="agencyName"
                placeholder="Courtage Immobilier XYZ"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Courriel</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@courtier.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#C8952A] text-white hover:bg-[#b3821f]"
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Déjà un compte?{" "}
            <Link href="/login" className="font-medium text-[#1A3A5C] hover:underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
