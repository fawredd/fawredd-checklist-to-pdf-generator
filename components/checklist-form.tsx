"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Checklist, ChecklistItem } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Grip, Plus, Save, Trash2 } from "lucide-react"
import { sanitizeInput } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface ChecklistFormProps {
  checklist: Checklist
  onSave: (checklist: Checklist) => void
  onChange: (checklist: Checklist) => void
}

export function ChecklistForm({ checklist, onSave, onChange }: ChecklistFormProps) {
  const [title, setTitle] = useState(checklist.title)
  const [description, setDescription] = useState(checklist.description)
  const [items, setItems] = useState<ChecklistItem[]>(checklist.items)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  // Ref to track the input that should be focused
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    setTitle(checklist.title)
    setDescription(checklist.description)
    setItems(checklist.items)
  }, [checklist])

  // Focus the last added item
  useEffect(() => {
    if (lastAddedId && inputRefs.current[lastAddedId]) {
      inputRefs.current[lastAddedId]?.focus()
      setLastAddedId(null)
    }
  }, [lastAddedId, items])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = sanitizeInput(e.target.value)
    setTitle(newTitle)
    onChange({
      ...checklist,
      title: newTitle,
    })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = sanitizeInput(e.target.value)
    setDescription(newDescription)
    onChange({
      ...checklist,
      description: newDescription,
    })
  }

  const handleItemChange = (id: string, value: string) => {
    const newItems = items.map((item) => (item.id === id ? { ...item, text: sanitizeInput(value) } : item))
    setItems(newItems)
    onChange({
      ...checklist,
      items: newItems,
    })
  }

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: "",
      checked: false,
    }
    const newItems = [...items, newItem]
    setItems(newItems)
    onChange({
      ...checklist,
      items: newItems,
    })
    setLastAddedId(newItem.id)
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      const newItems = items.filter((item) => item.id !== id)
      setItems(newItems)
      onChange({
        ...checklist,
        items: newItems,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const reorderedItems = Array.from(items)
    const [removed] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, removed)

    setItems(reorderedItems)
    onChange({
      ...checklist,
      items: reorderedItems,
    })
  }

  const isFormValid = () => {
    return title.trim() !== "" && items.some((item) => item.text.trim() !== "")
  }

  const handleSave = () => {
    const updatedChecklist: Checklist = {
      ...checklist,
      title: title || "Untitled Checklist",
      description,
      items: items.map((item) => ({
        ...item,
        text: item.text || "Untitled Item",
      })),
    }
    onSave(updatedChecklist)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <Input value={title} onChange={handleTitleChange} placeholder="Checklist Title" className="text-lg font-bold" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Items</h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="checklist-items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center gap-2">
                          <div {...provided.dragHandleProps}>
                            <Grip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <Input
                            ref={(el) => (inputRefs.current[item.id] = el)}
                            value={item.text}
                            onChange={(e) => handleItemChange(item.id, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, item.id)}
                            placeholder={item.text ? "" : "Item text"}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button variant="outline" size="sm" onClick={addItem} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Description (Optional)</h3>
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Add a description for your checklist"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="ml-auto" disabled={!isFormValid()}>
          <Save className="h-4 w-4 mr-2" />
          Save Checklist
        </Button>
      </CardFooter>
    </Card>
  )
}
