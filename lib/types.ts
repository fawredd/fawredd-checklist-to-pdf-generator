export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

export interface Checklist {
  id: string
  title: string
  description: string
  items: ChecklistItem[]
}
