"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check } from "lucide-react"

interface ShareTopicButtonProps {
  topicId: string
  topicTitle: string
}

export function ShareTopicButton({ topicId, topicTitle }: ShareTopicButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/share/${topicId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this topic</DialogTitle>
            <DialogDescription>
              Share this link with others to let them discuss "{topicTitle}" with your AI representative.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2">
            <Input value={shareUrl} readOnly />
            <Button size="icon" onClick={copyToClipboard} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              When someone clicks this link, they'll be able to have a conversation with your AI representative about
              this topic.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
