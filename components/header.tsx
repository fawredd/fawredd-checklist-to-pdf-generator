"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { List } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <List className="h-6 w-6" />
          <h1 className="text-xl font-bold">Checklist Creator</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
