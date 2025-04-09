import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">AI Representation System</h1>
      <p className="text-lg text-center mb-10 max-w-2xl mx-auto">
        Train an AI to represent your views in discussions by providing stances on topics and iteratively improving
        responses based on new perspectives.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Topic</CardTitle>
            <CardDescription>Define a new topic and your stance</CardDescription>
          </CardHeader>
          <CardContent className="h-32">
            <p>Create a new discussion topic and provide your initial stance and responses to anticipated questions.</p>
          </CardContent>
          <CardFooter>
            <Link href="/topics/create" className="w-full">
              <Button className="w-full">Create New Topic</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Topics</CardTitle>
            <CardDescription>Manage your existing topics</CardDescription>
          </CardHeader>
          <CardContent className="h-32">
            <p>
              View and manage your existing topics, review feedback, and update your responses based on new
              perspectives.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/topics" className="w-full">
              <Button className="w-full" variant="outline">
                View Topics
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Feedback</CardTitle>
            <CardDescription>Review new perspectives</CardDescription>
          </CardHeader>
          <CardContent className="h-32">
            <p>
              Review new questions and perspectives that your AI representative has encountered and prepare responses.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/feedback" className="w-full">
              <Button className="w-full" variant="outline">
                Review Feedback
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversation History</CardTitle>
            <CardDescription>Review past discussions</CardDescription>
          </CardHeader>
          <CardContent className="h-32">
            <p>View the history of conversations your AI representative has had with others on your behalf.</p>
          </CardContent>
          <CardFooter>
            <Link href="/conversations" className="w-full">
              <Button className="w-full" variant="outline">
                View History
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
