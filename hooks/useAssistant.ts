import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"

export interface HistoryMessage {
  role: "user" | "assistant"
  content: string
}

const mockReplies = [
  "D'après tes données, Jean-François Tremblay est ton lead le plus prometteur cette semaine — il a confirmé une visite jeudi.",
  "Tu as 5 leads sans réponse depuis plus de 24h. Je te suggère de commencer par Isabelle Pelletier, qui attend des photos.",
  "Ta commission moyenne ce trimestre est de 22 400 $. Tu es en bonne voie pour dépasser ton objectif annuel!",
  "Je peux préparer un courriel de relance pour tes leads tièdes si tu veux. Dis-moi simplement lesquels.",
  "Tes trois prochains rendez-vous sont aujourd'hui: une visite à 10h, une évaluation à 13h30 et une signature à 16h.",
]

export function useAssistant() {
  return useMutation({
    mutationFn: async (message: string) => {
      try {
        const { data } = await apiClient.post("/api/assistant/chat", { message })
        return data.reply as string
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return mockReplies[Math.floor(Math.random() * mockReplies.length)]
      }
    },
  })
}
