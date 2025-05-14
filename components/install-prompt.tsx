"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface InstallPromptProps {
  onClose: () => void
}

export function InstallPrompt({ onClose }: InstallPromptProps) {
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isChrome, setIsChrome] = useState(false)
  const [isSafari, setIsSafari] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detect platform and browser
    const ua = navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(ua))
    setIsAndroid(/android/.test(ua))
    setIsChrome(/chrome|chromium|crios/.test(ua) && !/edge|edg/.test(ua))
    setIsSafari(/safari/.test(ua) && !/chrome|chromium|crios/.test(ua))

    // Check if already installed
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true,
    )
  }, [])

  if (isStandalone) {
    return (
      <Card className="my-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">App Installed</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p>The Checklist Creator app is already installed on your device.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="my-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Install Checklist Creator</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription>
          Install this app on your device for a better experience. You can use it offline and it will look and feel like
          a native app.
        </CardDescription>

        {isIOS && (
          <div className="space-y-2">
            <h3 className="font-medium">iOS Installation Steps:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Tap the <strong>Share</strong> button at the bottom of the screen
              </li>
              <li>
                Scroll down and tap <strong>Add to Home Screen</strong>
              </li>
              <li>
                Tap <strong>Add</strong> in the top right corner
              </li>
            </ol>
          </div>
        )}

        {isAndroid && isChrome && (
          <div className="space-y-2">
            <h3 className="font-medium">Android Installation Steps:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Tap the menu button (three dots) in the top right</li>
              <li>
                Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>
              </li>
              <li>Follow the on-screen instructions</li>
            </ol>
          </div>
        )}

        {!isIOS && !isAndroid && (
          <div className="space-y-2">
            <h3 className="font-medium">Desktop Installation Steps:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Click the install icon in the address bar</li>
              <li>
                Click <strong>Install</strong> in the prompt that appears
              </li>
            </ol>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onClose} className="w-full">
          Got it
        </Button>
      </CardFooter>
    </Card>
  )
}
