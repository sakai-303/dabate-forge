"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"
import { createTopic } from "@/lib/actions"

export default function CreateTopic() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [stance, setStance] = useState("")
  const [anticipatedQuestions, setAnticipatedQuestions] = useState([{ question: "", response: "" }])

  const addQuestion = () => {
    setAnticipatedQuestions([...anticipatedQuestions, { question: "", response: "" }])
  }

  const removeQuestion = (index: number) => {
    const newQuestions = [...anticipatedQuestions]
    newQuestions.splice(index, 1)
    setAnticipatedQuestions(newQuestions)
  }

  const updateQuestion = (index: number, field: "question" | "response", value: string) => {
    const newQuestions = [...anticipatedQuestions]
    newQuestions[index][field] = value
    setAnticipatedQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would save this data to your database
    await createTopic({
      title,
      stance,
      anticipatedQuestions,
    })

    router.push("/topics")
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">新規トピックの作成</h1>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>トピック情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">トピックタイトル</Label>
              <Input
                id="title"
                placeholder="例：気候変動、AI倫理など"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stance">あなたの立場</Label>
              <Textarea
                id="stance"
                placeholder="このトピックに対するあなたの立場を詳細に説明してください..."
                className="min-h-[150px]"
                value={stance}
                onChange={(e) => setStance(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>予想される質問と回答</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {anticipatedQuestions.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">質問 {index + 1}</h3>
                  {anticipatedQuestions.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`question-${index}`}>質問</Label>
                  <Input
                    id={`question-${index}`}
                    placeholder="このトピックについて誰かが尋ねそうなことは？"
                    value={item.question}
                    onChange={(e) => updateQuestion(index, "question", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`response-${index}`}>あなたの回答</Label>
                  <Textarea
                    id={`response-${index}`}
                    placeholder="この質問にどのように回答しますか？"
                    className="min-h-[100px]"
                    value={item.response}
                    onChange={(e) => updateQuestion(index, "response", e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" className="w-full" onClick={addQuestion}>
              <PlusCircle className="h-4 w-4 mr-2" />
              別の質問を追加
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              トピックを保存
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
