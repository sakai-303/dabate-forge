import { StreamingTextResponse } from "ai"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages, topicId } = await req.json()

  // In a real application, you would:
  // 1. Fetch the topic details and prepared responses from your database
  // 2. Check if the user's question matches any anticipated questions
  // 3. If yes, use the prepared response
  // 4. If no, use AI to generate a response based on your stance
  // 5. Store the new question for your review later

  // For this example, we'll simulate the AI response
  const lastMessage = messages[messages.length - 1].content

  // Create a system prompt that would include your stance and prepared responses
  const systemPrompt = `You are an AI representing a person's views on a specific topic.
  
Topic: Climate Change
Stance: We need immediate action to reduce carbon emissions and transition to renewable energy sources.

Prepared responses:
Q: What about nuclear energy?
A: I believe nuclear energy should be part of our transition strategy as it's low-carbon, but we need to address safety and waste concerns.

Q: Is individual action enough?
A: While individual actions matter, systemic change through policy is essential for meaningful impact.

If asked a question that doesn't have a prepared response, politely indicate that you don't have a specific stance on that particular aspect yet.`

  const stream = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: lastMessage,
  })

  return new StreamingTextResponse(stream.textStream)
}
