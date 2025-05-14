"use client"

import type { Checklist } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChecklistPreviewProps {
  checklist: Checklist
}

export function ChecklistPreview({ checklist }: ChecklistPreviewProps) {
  return (
    <Card className="print:shadow-none print:border-none print-container">
      <CardHeader className="print:pb-2">
        <CardTitle className="text-center text-2xl print:text-3xl">{checklist.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 print:space-y-6">
          <ul className="space-y-3 print:space-y-5">
            {checklist.items.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <div className="h-6 w-6 print:h-8 print:w-8 flex-shrink-0 border-2 border-primary rounded-sm print:border-black" />
                <span className="pt-0.5 print:text-lg">{item.text}</span>
              </li>
            ))}
          </ul>

          {checklist.description && (
            <div className="pt-4 border-t mt-6">
              <h3 className="font-medium mb-2 print:text-lg">Notes:</h3>
              <p className="text-muted-foreground print:text-black print:text-base whitespace-pre-line">
                {checklist.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
