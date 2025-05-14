// This file contains helper functions for PWA installation

// Check if the app is running as a PWA
export function isRunningAsPWA(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(display-mode: standalone)").matches
}

// Check if the app can be installed
export function canInstallPWA(): boolean {
  return !!window.BeforeInstallPromptEvent
}
