import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getConversations } from "@/lib/actions"

export default async function ConversationsPage() {
  // In a real application, you would fetch this data from your database
  const conversations = await getConversations()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Conversation History</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No conversations have taken place yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {conversations.map((conversation) => (
            <Card key={conversation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2">{conversation.topicTitle}</Badge>
                    <CardTitle>Conversation with {conversation.participant}</CardTitle>
                  </div>
                  <Badge variant="outline">{new Date(conversation.date).toLocaleDateString()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{conversation.messageCount} messages</p>
                <p className="line-clamp-2">{conversation.summary}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/conversations/${conversation.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Conversation
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
