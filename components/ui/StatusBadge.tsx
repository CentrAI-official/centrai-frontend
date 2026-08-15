import { cn } from "@/lib/utils"

export type Status =
  | "hot"
  | "warm"
  | "cold"
  | "new"
  | "converted"
  | "lost"
  | "pending"
  | "paid"
  | "active"
  | "sold"

const statusConfig: Record<Status, { label: string; className: string }> = {
  hot: { label: "Chaud", className: "bg-red-100 text-red-700" },
  warm: { label: "Tiède", className: "bg-orange-100 text-orange-700" },
  cold: { label: "Froid", className: "bg-blue-100 text-blue-700" },
  new: { label: "Nouveau", className: "bg-gray-100 text-gray-700" },
  converted: { label: "Converti", className: "bg-green-100 text-green-800" },
  lost: { label: "Perdu", className: "bg-gray-200 text-gray-800" },
  pending: { label: "En attente", className: "bg-orange-50 text-orange-600" },
  paid: { label: "Payé", className: "bg-green-50 text-green-600" },
  active: { label: "Actif", className: "bg-green-100 text-green-700" },
  sold: { label: "Vendu", className: "bg-gray-200 text-gray-600" },
}

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
