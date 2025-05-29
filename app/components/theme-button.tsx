"use client"

import { Paintbrush } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

export function ThemeButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" asChild>
            <Link href="/themes">
              <Paintbrush className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Theme settings</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Theme Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
