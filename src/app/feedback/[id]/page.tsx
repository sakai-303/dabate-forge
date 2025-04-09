"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface FeedbackDetailPageProps {
  params: {
    id: string
  }
}

export default function FeedbackDetailPage({ params }: FeedbackDetailPageProps) {
  const router = useRouter()
  const [response, setResponse] = useState("")

  // In a real application, you would fetch this data from your database
  // This is mock data for demonstration
  const feedback = {
    id: params.id,
    topicTitle: "Climate Change",
    question: "What about the economic impact of rapid decarbonization?",
    context: "The conversation was about carbon tax policies when this question came up.",
    aiResponse: "I don't have a specific stance on the economic impacts of rapid decarbonization.",
    date: "2023-06-15T10:30:00Z",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would save this response to your database
    console.log("Submitting response:", response)

    // Redirect back to the feedback page
    router.push("/feedback")
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Provide Response</h1>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge className="mb-2">{feedback.topicTitle}</Badge>
              <CardTitle>{feedback.question}</CardTitle>
            </div>
            <Badge variant="outline">{new Date(feedback.date).toLocaleDateString()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Context:</h3>
              <p>{feedback.context}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">AI's Response:</h3>
              <p className="p-3 bg-muted rounded-md">{feedback.aiResponse}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Your Response</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Provide your response to this question..."
              className="min-h-[200px]"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Save Response</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
