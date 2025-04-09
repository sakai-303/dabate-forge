import { StreamingTextResponse } from "ai"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getTopicForDiscussion, logNewPerspective } from "@/lib/actions"

export async function POST(req: Request) {
  const { messages, topicId } = await req.json()

  // In a real application, you would:
  // 1. Fetch the topic details and prepared responses from your database
  const topic = await getTopicForDiscussion(topicId)

  if (!topic) {
    return new Response("Topic not found", { status: 404 })
  }

  const lastMessage = messages[messages.length - 1].content
  const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content)

  // Check if this question matches any anticipated questions
  const matchedQuestion = topic.anticipatedQuestions.find((q) =>
    lastMessage.toLowerCase().includes(q.question.toLowerCase()),
  )

  if (matchedQuestion) {
    // If we have a prepared response, use it
    return new Response(matchedQuestion.response)
  }

  // Create a system prompt that includes the owner's stance and prepared responses
  const systemPrompt = `You are an AI representing ${topic.ownerName}'s views on ${topic.title}.
  
Stance: ${topic.stance}

You should respond as if you are representing ${topic.ownerName}'s views based on their stance.
Be conversational but stay focused on the topic.
If asked about something that goes beyond the provided stance, politely indicate that you don't have specific information on that aspect.

Remember that you are representing a real person's views, so maintain a respectful and thoughtful tone.`

  // Stream the AI response
  const stream = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: lastMessage,
  })

  // Log this as a new perspective for the owner to review later
  // Only do this if it's not a simple greeting or clarification
  if (lastMessage.length > 20 && !isSimpleGreeting(lastMessage)) {
    const conversationContext = userMessages.slice(-3).join("\n")

    logNewPerspective({
      topicId,
      question: lastMessage,
      context: conversationContext,
      aiResponse: "AI-generated response", // In a real app, you'd capture the actual response
    })
  }

  return new StreamingTextResponse(stream.textStream)
}

// Helper function to detect simple greetings
function isSimpleGreeting(message: string) {
  const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"]
  return greetings.some((greeting) => message.toLowerCase().includes(greeting))
}
