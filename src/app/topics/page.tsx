import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTopics } from "@/lib/actions"

export default async function TopicsPage() {
  // In a real application, you would fetch this data from your database
  const topics = await getTopics()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Topics</h1>
        <Link href="/topics/create">
          <Button>Create New Topic</Button>
        </Link>
      </div>

      {topics.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground mb-4">You haven't created any topics yet.</p>
          <Link href="/topics/create">
            <Button>Create Your First Topic</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <Card key={topic.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{topic.title}</CardTitle>
                  {topic.pendingFeedback > 0 && <Badge variant="destructive">{topic.pendingFeedback} new</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">{topic.stance}</p>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <span className="mr-4">{topic.questionCount} questions</span>
                  <span>{topic.conversationCount} conversations</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/topics/${topic.id}`} className="w-full mr-2">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Link href={`/topics/${topic.id}/edit`} className="w-full ml-2">
                  <Button className="w-full">Edit Topic</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
