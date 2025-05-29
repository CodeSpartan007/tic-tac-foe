import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Grid3x3, Grid, LayoutGrid } from "lucide-react"

interface GameCardProps {
  title: string
  description: string
  href: string
  icon: string
}

export function GameCard({ title, description, href, icon }: GameCardProps) {
  const IconComponent = getIcon(icon)

  return (
    <Link href={href} className="block">
      <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-card text-card-foreground">
        <div className="flex items-center mb-4">
          <div className="mr-4 p-2 bg-primary/10 rounded-full">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}

function getIcon(iconName: string): LucideIcon {
  switch (iconName) {
    case "Grid3x3":
      return Grid3x3
    case "Grid":
      return Grid
    case "LayoutGrid":
      return LayoutGrid
    default:
      return Grid3x3
  }
}
