"use client"

import { ChecklistApp } from "@/components/checklist-app"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we need to create a new checklist (from shortcut)
    const newParam = searchParams.get("new")
    if (newParam === "true") {
      // We'll handle this in the ChecklistApp component
      window.dispatchEvent(new CustomEvent("create-new-checklist"))
    }

    // Register service worker manually if needed
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("ServiceWorker registration successful with scope:", registration.scope)
          },
          (err) => {
            console.error("ServiceWorker registration failed:", err)
          },
        )
      })
    }
  }, [searchParams])

  return (
    <main className="container mx-auto px-4 py-6 max-w-3xl">
      <ChecklistApp />
    </main>
  )
}
