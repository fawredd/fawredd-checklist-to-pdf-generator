"use client"

import { useEffect, useState, useRef } from "react"
import { ChecklistForm } from "@/components/checklist-form"
import { ChecklistPreview } from "@/components/checklist-preview"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Checklist } from "@/lib/types"
import { loadChecklists, saveChecklist } from "@/lib/storage"
import { ChecklistSelector } from "@/components/checklist-selector"
import { Plus, Printer, Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ChecklistApp() {
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(null)
  const [activeTab, setActiveTab] = useState("edit")
  const [formState, setFormState] = useState<Checklist | null>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isPWA, setIsPWA] = useState(false)
  const deferredPromptRef = useRef<any>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedChecklists = loadChecklists()
    setChecklists(savedChecklists)

    if (savedChecklists.length > 0) {
      setCurrentChecklist(savedChecklists[0])
      setFormState(savedChecklists[0])
    } else {
      createNewChecklist()
    }

    // Check if running as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsPWA(true)
    }

    // Listen for beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault()
      deferredPromptRef.current = e
      setCanInstall(true)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {})
    }
  }, [])

  const createNewChecklist = () => {
    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: "New Checklist",
      description: "",
      items: [{ id: "1", text: "", checked: false }],
    }

    setCurrentChecklist(newChecklist)
    setFormState(newChecklist)
    setActiveTab("edit")
  }

  const handleSave = (checklist: Checklist) => {
    const updatedChecklists = saveChecklist(checklist, checklists)
    setChecklists(updatedChecklists)
    setCurrentChecklist(checklist)
    setFormState(checklist)

    toast({
      title: "Checklist saved",
      description: "Your checklist has been saved successfully.",
    })
  }

  const handleSelectChecklist = (id: string) => {
    const selected = checklists.find((c) => c.id === id) || null
    setCurrentChecklist(selected)
    setFormState(selected)
    setActiveTab("edit")
  }

  const handlePrint = () => {
    setActiveTab("preview")
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleInstall = async () => {
    if (!deferredPromptRef.current) return

    deferredPromptRef.current.prompt()
    const { outcome } = await deferredPromptRef.current.userChoice

    if (outcome === "accepted") {
      setCanInstall(false)
    }
    deferredPromptRef.current = null
  }

  const handleShare = async () => {
    if (!formState) return

    // Switch to preview tab first
    setActiveTab("preview")

    // Wait for the tab to render
    setTimeout(async () => {
      try {
        if (!navigator.share) {
          toast({
            title: "Sharing not supported",
            description: "Your browser doesn't support sharing.",
            variant: "destructive",
          })
          return
        }

        // Create a title for the share
        const shareTitle = formState.title || "Checklist"

        // Share the checklist
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle} - Checklist`,
          url: window.location.href,
        })

        toast({
          title: "Shared successfully",
          description: "Your checklist has been shared.",
        })
      } catch (error) {
        console.error("Error sharing:", error)
        toast({
          title: "Sharing failed",
          description: "There was an error sharing your checklist.",
          variant: "destructive",
        })
      }
    }, 100)
  }

  const handleFormChange = (updatedChecklist: Checklist) => {
    setFormState(updatedChecklist)
  }

  const canShare = typeof navigator !== "undefined" && !!navigator.share

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="space-y-2">
          <label htmlFor="checklist-selector" className="text-sm font-medium">
            Saved checklists
          </label>
          <ChecklistSelector
            id="checklist-selector"
            checklists={checklists}
            currentId={currentChecklist?.id}
            onSelect={handleSelectChecklist}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={createNewChecklist} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
          {canInstall && !isPWA && (
            <Button onClick={handleInstall} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Install
            </Button>
          )}
          <Button onClick={handlePrint} variant="default" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {canShare && (
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>

      {currentChecklist && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 tabs-content">
          <TabsList className="tabs-list">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-4">
            <ChecklistForm checklist={formState || currentChecklist} onSave={handleSave} onChange={handleFormChange} />
          </TabsContent>
          <TabsContent value="preview">
            <div ref={previewRef}>
              <ChecklistPreview checklist={formState || currentChecklist} />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
