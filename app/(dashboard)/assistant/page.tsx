"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Send, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAssistant } from "@/hooks/useAssistant"
import { useDashboard } from "@/hooks/useDashboard"
import { cn, formatCurrency } from "@/lib/utils"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

const suggestions = [
  "Quels sont mes leads chauds aujourd'hui?",
  "Résume mes rendez-vous de la semaine",
  "Quelles relances sont en retard?",
  "Comment va mon objectif mensuel?",
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour! Je suis ton assistant CentrAI. Je peux t'aider à suivre tes leads, tes rendez-vous et tes commissions. Comment puis-je t'aider aujourd'hui?",
    },
  ])
  const [input, setInput] = useState("")
  const { mutate, isPending } = useAssistant()
  const { data: summary } = useDashboard()
  const scrollRef = useRef<HTMLDivElement>(null)

  const aiSummary = summary
    ? `Bonjour! Tu as ${summary.activeLeads} lead(s) actif(s), dont ${summary.hotLeadsCount} chaud(s), et ${summary.appointmentsToday} rendez-vous aujourd'hui. Tu es à ${summary.monthlyProgress}% de ton objectif mensuel (${formatCurrency(summary.commissionsThisMonth)} sur ${formatCurrency(summary.monthlyGoal)}).`
    : "Chargement de ton résumé..."

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isPending])

  function sendMessage(content: string) {
    if (!content.trim()) return
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    mutate(content, {
      onSuccess: (reply) => {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: reply },
        ])
      },
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div>
      <PageHeader
        title="Assistant IA"
        subtitle="Ton copilote pour la journée"
        action={
          <span className="w-fit rounded-full bg-[#1A3A5C]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#1A3A5C]">
            Bêta
          </span>
        }
      />

      <Card className="mb-6 border-blue-200 bg-blue-50/60">
        <CardContent className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#1A3A5C]" />
          <p className="text-sm text-foreground/80">{aiSummary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div ref={scrollRef} className="flex h-[400px] flex-col gap-4 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C8952A]">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                    message.role === "user"
                      ? "bg-[#1A3A5C] text-white"
                      : "bg-white text-foreground/80 ring-1 ring-border"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C8952A]">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <Skeleton className="h-9 w-40 rounded-2xl" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => sendMessage(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écris ta question..."
            />
            <Button
              onClick={() => sendMessage(input)}
              className="bg-[#C8952A] text-white hover:bg-[#b3821f]"
            >
              <Send className="h-4 w-4" />
              Envoyer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
