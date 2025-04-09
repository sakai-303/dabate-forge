import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">AI代理システム</h1>
      <p className="text-lg text-center mb-10 max-w-2xl mx-auto">
        トピックに対する立場を提供し、新しい視点に基づいて回答を段階的に改善することで、議論であなたの見解を代弁するAIを訓練します。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>トピックを作成</CardTitle>
            <CardDescription>新しいトピックとあなたの立場を定義</CardDescription>
          </CardHeader>
          <CardContent className="h-32">
            <p>新しい議論トピックを作成し、最初の立場と予想される質問への回答を提供します。</p>
          </CardContent>
          <CardFooter>
            <Link href="/topics/create" className="w-full">
              <Button className="w-full">新規トピックを作成</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>マイトピック</CardTitle>
            <CardDescription>既存のトピックを管理</CardDescription>
          </CardHeader>
          <CardContent className="h-32">
            <p>
              既存のトピックを表示・管理し、フィードバックを確認し、新しい視点に基づいて回答を更新します。
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/topics" className="w-full">
              <Button className="w-full" variant="outline">
                トピックを表示
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>保留中のフィードバック</CardTitle>
            <CardDescription>新しい視点を確認</CardDescription>
          </CardHeader>
          <CardContent className="h-32">
            <p>
              AIの代理が遭遇した新しい質問や視点を確認し、回答を準備します。
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/feedback" className="w-full">
              <Button className="w-full" variant="outline">
                フィードバックを確認
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>会話履歴</CardTitle>
            <CardDescription>過去の議論を確認</CardDescription>
          </CardHeader>
          <CardContent className="h-32">
            <p>あなたの代わりにAI代理が他者と行った会話の履歴を表示します。</p>
          </CardContent>
          <CardFooter>
            <Link href="/conversations" className="w-full">
              <Button className="w-full" variant="outline">
                履歴を表示
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
