"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import { setToken } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { data } = await apiClient.post("/api/auth/login", { email, password })
      setToken(data.token)
      router.push("/dashboard")
    } catch {
      setError("Identifiants invalides. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  function handleDemoMode() {
    setToken("demo-token")
    localStorage.setItem("centrai_onboarding_done", "true")
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-4">
      <h1 className="mb-8 text-3xl font-bold tracking-wide text-[#1A3A5C]">CENTRAI</h1>
      <Card className="w-full max-w-sm">
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#C8952A] text-white hover:bg-[#b3821f]"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoMode}
            className="mt-4 w-full"
          >
            Mode démo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
