"use client"

import { useMemo } from "react"
import { format, getYear, getMonth } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DollarSign, TrendingUp, Target } from "lucide-react"
import { PageHeader } from "@/components/ui/PageHeader"
import { KPICard } from "@/components/ui/KPICard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/ui/StatusBadge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCommissions, useMarkCommissionPaid } from "@/hooks/useCommissions"
import { formatCurrency, parseLocalDate } from "@/lib/utils"

const ANNUAL_GOAL = 220000
const monthLabels = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
]

export default function CommissionsPage() {
  const { data: commissions, isLoading } = useCommissions()
  const markPaid = useMarkCommissionPaid()
  const now = new Date()

  // Seules les commissions "payees" (vente conclue et confirmee) comptent dans les totaux
  // et le graphique -- une commission "en attente" n'est pas encore acquise.
  const { thisMonthTotal, thisYearTotal, chartData, paidCommissions, pendingCommissions } = useMemo(() => {
    const list = commissions ?? []
    let monthTotal = 0
    let yearTotal = 0
    const monthly = Array.from({ length: 12 }, (_, i) => ({ month: monthLabels[i], total: 0 }))

    list.forEach((c) => {
      if (c.status !== "paid") return
      const date = parseLocalDate(c.date)
      if (getYear(date) === getYear(now)) {
        yearTotal += c.commissionAmount
        monthly[getMonth(date)].total += c.commissionAmount
        if (getMonth(date) === getMonth(now)) {
          monthTotal += c.commissionAmount
        }
      }
    })

    return {
      thisMonthTotal: monthTotal,
      thisYearTotal: yearTotal,
      chartData: monthly,
      paidCommissions: list.filter((c) => c.status === "paid"),
      pendingCommissions: list.filter((c) => c.status !== "paid"),
    }
  }, [commissions, now])

  const annualProgress = Math.min(100, Math.round((thisYearTotal / ANNUAL_GOAL) * 100))

  return (
    <div>
      <PageHeader title="Commissions" subtitle="Suivi de tes revenus de courtage" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)
        ) : (
          <>
            <KPICard title="Ce mois" value={formatCurrency(thisMonthTotal)} icon={DollarSign} color="#C8952A" />
            <KPICard title="Cette année" value={formatCurrency(thisYearTotal)} icon={TrendingUp} color="#1A3A5C" />
            <Card>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Objectif annuel</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1A3A5C]/10">
                    <Target className="h-4 w-4 text-[#1A3A5C]" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-[#1A3A5C]">{formatCurrency(ANNUAL_GOAL)}</span>
                <Progress value={annualProgress} className="mt-1 h-2 [&>div]:bg-[#C8952A]" />
                <span className="text-xs text-muted-foreground">{annualProgress}% atteint</span>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base text-[#1A3A5C]">Commissions par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E6EA" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#64748B" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748B" tickFormatter={(v) => `${v / 1000}k$`} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Commission"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E6EA" }}
                />
                <Bar dataKey="total" fill="#C8952A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base text-[#1A3A5C]">
            Transactions — En attente ({pendingCommissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex flex-col gap-2 px-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : pendingCommissions.length === 0 ? (
            <p className="px-4 text-sm text-muted-foreground">Aucune commission en attente.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Propriété</TableHead>
                  <TableHead>Prix de vente</TableHead>
                  <TableHead>Commission %</TableHead>
                  <TableHead>Commission $</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="pr-4">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCommissions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-4 font-medium text-[#1A3A5C]">{c.property}</TableCell>
                    <TableCell>{formatCurrency(c.salePrice)}</TableCell>
                    <TableCell>{c.commissionPercent}%</TableCell>
                    <TableCell className="font-medium">{formatCurrency(c.commissionAmount)}</TableCell>
                    <TableCell>{format(parseLocalDate(c.date), "d MMM yyyy", { locale: fr })}</TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={c.status} />
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={markPaid.isPending}
                          onClick={() => markPaid.mutate(c.id)}
                        >
                          Marquer comme payée
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base text-[#1A3A5C]">
            Transactions — Vendues ({paidCommissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex flex-col gap-2 px-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paidCommissions.length === 0 ? (
            <p className="px-4 text-sm text-muted-foreground">Aucune commission confirmée pour l&apos;instant.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Propriété</TableHead>
                  <TableHead>Prix de vente</TableHead>
                  <TableHead>Commission %</TableHead>
                  <TableHead>Commission $</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="pr-4">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidCommissions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-4 font-medium text-[#1A3A5C]">{c.property}</TableCell>
                    <TableCell>{formatCurrency(c.salePrice)}</TableCell>
                    <TableCell>{c.commissionPercent}%</TableCell>
                    <TableCell className="font-medium">{formatCurrency(c.commissionAmount)}</TableCell>
                    <TableCell>{format(parseLocalDate(c.date), "d MMM yyyy", { locale: fr })}</TableCell>
                    <TableCell className="pr-4">
                      <StatusBadge status={c.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
