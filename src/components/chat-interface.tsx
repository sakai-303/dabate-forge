"use client"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInterfaceProps {
  topicId: string
  topicTitle: string
}

export function ChatInterface({ topicId, topicTitle }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: { topicId },
  })

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm">
            これはあなたの準備した立場と回答に基づいて、AIの代理が
            <strong> "{topicTitle}"</strong> というトピックについてどのように議論するかのシミュレーションです。
          </p>
        </div>

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>会話を始めて、あなたのAI代理がどのように応答するか確認しましょう。</p>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="このトピックについて質問してください..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            送信
          </Button>
        </form>
      </div>
    </div>
  )
}
