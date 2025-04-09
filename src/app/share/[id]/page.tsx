import { getPublicTopicById } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface SharePageProps {
  params: {
    id: string
  }
}

export default async function SharePage({ params }: SharePageProps) {
  // In a real application, you would fetch this data from your database
  const topic = await getPublicTopicById(params.id)

  if (!topic) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Topic not found</h1>
        <p className="text-muted-foreground">The topic you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={topic.ownerAvatar} alt={topic.ownerName} />
                <AvatarFallback>{topic.ownerName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{topic.ownerName} invites you to discuss</CardTitle>
            <CardDescription className="text-xl font-semibold mt-2">{topic.title}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              Join a conversation with {topic.ownerName}'s AI representative to discuss their views on {topic.title}.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              This is an AI-powered discussion that represents {topic.ownerName}'s views based on their prepared
              responses.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Link href={`/discuss/${params.id}`}>
              <Button size="lg" className="px-8">
                Join Discussion <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
