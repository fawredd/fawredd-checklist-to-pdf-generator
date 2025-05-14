import type { Checklist } from "./types"
import { sanitizeInput } from "./utils"

const STORAGE_KEY = "checklists"

export function loadChecklists(): Checklist[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const parsed = JSON.parse(data)

    // Validate the structure of the data
    if (!Array.isArray(parsed)) return []

    return parsed.map((item) => ({
      id: sanitizeInput(item.id) || Date.now().toString(),
      title: sanitizeInput(item.title) || "Untitled Checklist",
      description: sanitizeInput(item.description) || "",
      items: Array.isArray(item.items)
        ? item.items.map((i: any) => ({
            id: sanitizeInput(i.id) || Date.now().toString(),
            text: sanitizeInput(i.text) || "Untitled Item",
            checked: Boolean(i.checked),
          }))
        : [{ id: "1", text: "New item", checked: false }],
    }))
  } catch (error) {
    console.error("Error loading checklists:", error)
    return []
  }
}

export function saveChecklist(checklist: Checklist, existingChecklists: Checklist[]): Checklist[] {
  try {
    const index = existingChecklists.findIndex((c) => c.id === checklist.id)
    let updatedChecklists: Checklist[]

    if (index >= 0) {
      updatedChecklists = [...existingChecklists.slice(0, index), checklist, ...existingChecklists.slice(index + 1)]
    } else {
      updatedChecklists = [...existingChecklists, checklist]
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChecklists))
    return updatedChecklists
  } catch (error) {
    console.error("Error saving checklist:", error)
    return existingChecklists
  }
}

export function deleteChecklist(id: string, existingChecklists: Checklist[]): Checklist[] {
  try {
    const updatedChecklists = existingChecklists.filter((c) => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChecklists))
    return updatedChecklists
  } catch (error) {
    console.error("Error deleting checklist:", error)
    return existingChecklists
  }
}
