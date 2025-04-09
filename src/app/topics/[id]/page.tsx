import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/chat-interface"
import { ShareTopicButton } from "@/components/share-topic-button"
import Link from "next/link"
import { getTopicById } from "@/lib/actions"

interface TopicPageProps {
  params: {
    id: string
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  // In a real application, you would fetch this data from your database
  const topic = await getTopicById(params.id)

  if (!topic) {
    return <div>Topic not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{topic.title}</h1>
        <div className="flex gap-2">
          <ShareTopicButton topicId={params.id} topicTitle={topic.title} />
          <Link href={`/topics/${params.id}/edit`}>
            <Button>Edit Topic</Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Stance</h2>
        <div className="p-4 bg-muted rounded-lg">
          <p>{topic.stance}</p>
        </div>
      </div>

      <Tabs defaultValue="questions" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions">Prepared Responses</TabsTrigger>
          <TabsTrigger value="simulation">Chat Simulation</TabsTrigger>
          <TabsTrigger value="history">Conversation History</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          <div className="space-y-4">
            {topic.anticipatedQuestions.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Q: {item.question}</h3>
                <p className="pl-4 border-l-2 border-primary">A: {item.response}</p>
              </div>
            ))}

            <Link href={`/topics/${params.id}/edit`}>
              <Button variant="outline" className="mt-4">
                Add More Questions
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="mt-6">
          <Card>
            <ChatInterface topicId={params.id} topicTitle={topic.title} />
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {topic.conversations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No conversations have taken place yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topic.conversations.map((conversation) => (
                <div key={conversation.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Conversation with {conversation.participant}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(conversation.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{conversation.messageCount} messages</p>
                  <p>{conversation.summary}</p>
                  <Link href={`/conversations/${conversation.id}`}>
                    <Button variant="link" className="p-0 h-auto">
                      View Details
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
