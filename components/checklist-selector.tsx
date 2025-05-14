"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChecklistSelectorProps {
  id?: string
  checklists: Array<{ id: string; title: string }>
  currentId: string | undefined
  onSelect: (id: string) => void
}

export function ChecklistSelector({ id, checklists, currentId, onSelect }: ChecklistSelectorProps) {
  return (
    <Select value={currentId} onValueChange={onSelect}>
      <SelectTrigger id={id} className="w-full sm:w-[250px]">
        <SelectValue placeholder="Select a checklist" />
      </SelectTrigger>
      <SelectContent>
        {checklists.map((checklist) => (
          <SelectItem key={checklist.id} value={checklist.id}>
            {checklist.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
