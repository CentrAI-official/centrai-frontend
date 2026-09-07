import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon?: LucideIcon
  color?: string
}

export function KPICard({ title, value, subtitle, trend, icon: Icon, color }: KPICardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {Icon && (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{ backgroundColor: `${color ?? "#1A3A5C"}1A` }}
            >
              <Icon className="h-4 w-4" style={{ color: color ?? "#1A3A5C" }} />
            </div>
          )}
        </div>
        <span className="text-2xl font-bold text-[#1A3A5C]">{value}</span>
        {(subtitle || trend !== undefined) && (
          <div className="flex items-center gap-1 text-xs">
            {trend !== undefined && (
              <span
                className={cn(
                  "flex items-center gap-0.5 font-medium",
                  trend >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {trend >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trend)}%
              </span>
            )}
            {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
