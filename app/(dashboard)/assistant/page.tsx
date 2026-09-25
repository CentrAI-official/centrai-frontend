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
import { apiClient } from "@/lib/api"
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

function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

function stripMarkdown(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*/g, "")
}

type VoiceStatus = "idle" | "listening" | "processing" | "speaking"

export default function AssistantPage() {
  const WELCOME: ChatMessage = {
    id: "welcome",
    role: "assistant",
    content: "Bonjour! Je suis ton assistant CentrAI. Double-clique sur le bouton ci-dessous pour me parler.",
  }
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState("")
  const { mutate, isPending } = useAssistant()
  const { data: summary } = useDashboard()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Voice
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle")
  const activeRef = useRef(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const aiSummary = summary
    ? `Tu as ${summary.activeLeads} lead(s) actif(s), dont ${summary.hotLeadsCount} chaud(s), et ${summary.appointmentsToday} rendez-vous aujourd'hui. Tu es à ${summary.monthlyProgress}% de ton objectif mensuel (${formatCurrency(summary.commissionsThisMonth)} sur ${formatCurrency(summary.monthlyGoal)}).`
    : "Chargement de ton résumé..."

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isPending])

  useEffect(() => {
    return () => {
      stopVoice()
    }
  }, [])

  // Un clic = start/stop enregistrement, pas de double-clic
  function handleBotClick() {
    if (voiceStatus === "idle") {
      startVoice()
    } else if (voiceStatus === "listening") {
      // Arrêter l'enregistrement et envoyer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      mediaRecorderRef.current?.requestData()
      mediaRecorderRef.current?.stop()
    } else if (voiceStatus === "speaking") {
      // Interrompre la réponse et ré-écouter
      window.speechSynthesis?.cancel()
    }
  }

  async function startVoice() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      activeRef.current = true
      startRecording(stream)
    } catch {
      alert("Accès au microphone refusé.")
    }
  }

  function stopVoice() {
    activeRef.current = false
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    mediaRecorderRef.current = null
    setVoiceStatus("idle")
    window.speechSynthesis?.cancel()
  }

  function startRecording(stream: MediaStream) {
    chunksRef.current = []

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/ogg;codecs=opus"

    const recorder = new MediaRecorder(stream, { mimeType })
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      if (!activeRef.current) return
      const blob = new Blob(chunksRef.current, { type: mimeType })
      if (blob.size > 0) sendAudio(blob, mimeType)
    }
    recorder.start(100) // collect data every 100ms
    mediaRecorderRef.current = recorder
    setVoiceStatus("listening")
  }

  async function sendAudio(blob: Blob, mimeType: string) {
    if (!activeRef.current) return
    if (blob.size < 1000) {
      if (activeRef.current && streamRef.current) startRecording(streamRef.current)
      return
    }
    setVoiceStatus("processing")

    try {
      // Encode audio as base64 JSON (avoids multipart/FormData issues)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          resolve(result.split(",")[1] ?? result)
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })

      const { data } = await apiClient.post("/api/assistant/voice", { audio: base64, mimeType })

      const reply: string = data.reply
      const transcript: string = data.transcript ?? ""

      if (transcript) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: transcript }])
      }
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: reply }])

      speakReply(reply)
    } catch (err: unknown) {
      const axErr = err as { response?: { status?: number; data?: { error?: string } }; message?: string }
      const status = axErr?.response?.status
      const serverMsg = axErr?.response?.data?.error
      const netMsg = axErr?.message
      const msg = serverMsg ?? (status ? `Erreur ${status}` : netMsg ?? "Erreur inconnue")
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: `⚠️ Vocal: ${msg}` }])
      setVoiceStatus("idle")
    }
  }

  function speakReply(text: string) {
    if (!activeRef.current) return
    setVoiceStatus("speaking")
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(stripMarkdown(text))
    utterance.lang = "fr-CA"
    utterance.rate = 1.05

    utterance.onend = () => {
      if (!activeRef.current) return
      // Restart listening after reply
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        streamRef.current = stream
        startRecording(stream)
      }).catch(() => setVoiceStatus("idle"))
    }
    utterance.onerror = () => {
      if (activeRef.current && streamRef.current) startRecording(streamRef.current)
    }

    window.speechSynthesis.speak(utterance)
  }

  function sendMessage(content: string) {
    if (!content.trim()) return
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    mutate(content, {
      onSuccess: (reply) => {
        setMessages((cur) => [...cur, { id: crypto.randomUUID(), role: "assistant", content: reply }])
      },
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); sendMessage(input) }
  }

  const voiceLabel = {
    idle: "Appuie pour parler",
    listening: "Appuie pour envoyer",
    processing: "Réflexion...",
    speaking: "Appuie pour interrompre",
  }[voiceStatus]

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
          {/* Chat messages */}
          <div ref={scrollRef} className="flex h-[320px] flex-col gap-4 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex items-end gap-2", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C8952A]">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                    message.role === "user" ? "bg-[#1A3A5C] text-white" : "bg-white text-foreground/80 ring-1 ring-border"
                  )}
                >
                  {renderContent(message.content)}
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

          {/* Main voice button */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative flex items-center justify-center">
              {/* Pulse rings when active */}
              {voiceStatus !== "idle" && (
                <>
                  <span className="absolute h-24 w-24 animate-ping rounded-full bg-[#C8952A]/20" />
                  <span className="absolute h-20 w-20 animate-ping rounded-full bg-[#C8952A]/30 animation-delay-150" />
                </>
              )}
              <button
                type="button"
                onClick={handleBotClick}
                className={cn(
                  "relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 select-none",
                  voiceStatus === "idle"
                    ? "bg-[#1A3A5C] hover:bg-[#142d47] active:scale-95"
                    : voiceStatus === "listening"
                      ? "bg-red-500 shadow-red-400/40"
                      : voiceStatus === "speaking"
                        ? "bg-[#C8952A] shadow-amber-400/40"
                        : "bg-[#1A3A5C]/60"
                )}
                aria-label={voiceLabel}
              >
                <Bot className="h-7 w-7 text-white" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{voiceLabel}</p>
            {voiceStatus !== "idle" && (
              <button type="button" onClick={stopVoice} className="text-xs text-red-400 underline">
                Quitter le mode vocal
              </button>
            )}
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button key={suggestion} type="button" variant="outline" size="sm" onClick={() => sendMessage(suggestion)}>
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Text input */}
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Écris ta question..." />
            <Button onClick={() => sendMessage(input)} className="bg-[#C8952A] text-white hover:bg-[#b3821f]">
              <Send className="h-4 w-4" />
              Envoyer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
