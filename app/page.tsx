"use client"

import { ChecklistApp } from "@/components/checklist-app"
import { useEffect } from "react"
import { registerServiceWorker } from "./register-sw"

export default function Home() {
  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker()
  }, [])

  return (
    <main className="container mx-auto px-4 py-6 max-w-3xl">
      <ChecklistApp />
    </main>
  )
}
