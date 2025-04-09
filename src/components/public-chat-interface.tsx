"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

interface PublicChatInterfaceProps {
  topicId: string
  topicTitle: string
  ownerName: string
}

export function PublicChatInterface({ topicId, topicTitle, ownerName }: PublicChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/public-chat",
    body: { topicId },
  })

  const [userName, setUserName] = useState<string>(() => {
    // Try to get the name from localStorage if available
    if (typeof window !== "undefined") {
      return localStorage.getItem("userName") || ""
    }
    return ""
  })

  const [isNameSet, setIsNameSet] = useState(!!userName)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Save name to localStorage when it's set
  useEffect(() => {
    if (userName && typeof window !== "undefined") {
      localStorage.setItem("userName", userName)
    }
  }, [userName])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userName.trim()) {
      setIsNameSet(true)
    }
  }

  if (!isNameSet) {
    return (
      <div className="p-6">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Join the Discussion</h2>
          <p className="text-muted-foreground">
            Enter your name to start discussing <strong>{topicTitle}</strong> with {ownerName}'s AI representative.
          </p>
        </div>
        <form onSubmit={handleNameSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="flex-1"
              required
            />
            <Button type="submit">Join</Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm">
            You're discussing <strong>{topicTitle}</strong> with {ownerName}'s AI representative. Ask questions to learn
            about their stance on this topic.
          </p>
        </div>

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">Start the conversation by asking a question about {topicTitle}.</p>
              <p className="text-sm">
                For example: "What's your stance on {topicTitle}?" or "What do you think about...?"
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role !== "user" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={`${ownerName}'s AI`} />
                <AvatarFallback>{ownerName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {message.role === "user" ? (
                <p className="text-xs font-medium mb-1">You</p>
              ) : (
                <p className="text-xs font-medium mb-1">{ownerName}'s AI</p>
              )}
              <p>{message.content}</p>
            </div>

            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about this topic..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
