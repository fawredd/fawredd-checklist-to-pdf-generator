import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "dompurify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeInput(input: string): string {
  if (typeof window === "undefined") {
    return input
  }

  // First, use DOMPurify to sanitize HTML
  const sanitized = DOMPurify.sanitize(input)

  // Then, remove any remaining HTML tags as an extra precaution
  return sanitized.replace(/<[^>]*>?/gm, "")
}
