import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPendingFeedback } from "@/lib/actions"

export default async function FeedbackPage() {
  // In a real application, you would fetch this data from your database
  const feedback = await getPendingFeedback()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Pending Feedback</h1>

      {feedback.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No new perspectives or questions to review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedback.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2">{item.topicTitle}</Badge>
                    <CardTitle>{item.question}</CardTitle>
                  </div>
                  <Badge variant="outline">{new Date(item.date).toLocaleDateString()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Context:</h3>
                    <p>{item.context}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">AI's Response:</h3>
                    <p className="p-3 bg-muted rounded-md">{item.aiResponse}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/feedback/${item.id}`} className="w-full">
                  <Button className="w-full">Provide Response</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
