"use client"

import { Category } from "@/app/_types/Category"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PostForm } from "../_components/PostForm"

export default function Page() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.jp/800x400.png")
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // 勝手にリロードされないようにする
    e.preventDefault()

    // POSTリクエストで記事を作成
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ← JSONデータであることを明示
      },
      body: JSON.stringify({ title, content, thumbnailUrl, categories }),
    })

    // レスポンスから作成した記事のIDを取得
    const { id } = await res.json()

    // 作成した記事の詳細ページに遷移
    router.push(`/admin/posts/${id}`)

    alert("記事を作成しました。")
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1>
      </div>
    
      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
      />
    </div> 
  )
}