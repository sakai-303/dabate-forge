import { getPublicTopicById } from "@/lib/actions"
import { PublicChatInterface } from "@/components/public-chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DiscussPageProps {
  params: {
    id: string
  }
}

export default async function DiscussPage({ params }: DiscussPageProps) {
  // In a real application, you would fetch this data from your database
  const topic = await getPublicTopicById(params.id)

  if (!topic) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Discussion not found</h1>
        <p className="text-muted-foreground">The discussion you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={topic.ownerAvatar} alt={topic.ownerName} />
                <AvatarFallback>{topic.ownerName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{topic.title}</CardTitle>
                <CardDescription>Discussion with {topic.ownerName}'s AI representative</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <PublicChatInterface topicId={params.id} topicTitle={topic.title} ownerName={topic.ownerName} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
