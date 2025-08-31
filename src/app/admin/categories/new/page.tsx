"use client"

import { useState } from "react"
import { CategoryForm } from "../_components/CategoryForm"
import { useRouter } from "next/navigation"

export default function Page() {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // POSTリクエストでカテゴリーを作成
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        throw new Error("作成に失敗しました。")
      }
      // レスポンスから作成したカテゴリーのIDを取得
      const { id } = await res.json()

      // 作成したカテゴリーの詳細ページに遷移
      router.push(`/admin/categories/${id}`)

      alert("カテゴリーを作成しました。")
    } catch (e: any) {
      console.log(e)
      alert("作成中にエラーが発生しました。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      </div>

      <CategoryForm 
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}