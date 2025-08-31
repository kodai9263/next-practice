"use client"

import { Category } from "@/app/_types/Category"
import { Post } from "@/app/_types/Post"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PostForm } from "../_components/PostForm"

export default function Page() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()
  const router = useRouter()

  const handleSubmit = async (e:React.FormEvent) => {
    // 勝手にリロードされないようにする
    e.preventDefault()
    setIsSubmitting(true)
  
    // PUTリクエストで記事を更新
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // ← JSONデータであることを明示
        },
        body: JSON.stringify({ title, content, thumbnailUrl, categories }),
      })

      if (!res.ok) {
        throw new Error("更新に失敗しました。")
      }
      alert("記事を更新しました。")
    } catch (e: any) {
      console.log(e)
      alert("更新中にエラーが発生しました。")
    } finally {
      setIsSubmitting(false)
    }
  }

  // DELETEリクエストで記事を削除
  const handleDeletePost = async  () => {
    if (!confirm("記事を削除しますか？")) return
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("削除に失敗しました。")
      }
      alert("記事を削除しました。")

      // 記事一覧ページに遷移
    router.replace("/admin/posts")
    } catch (e: any) {
      console.log(e)
      alert("削除中にエラーが発生しました。")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 更新の際に既存のデータを表示する
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`)
      // TODO { post }: { post: Post } なぜこのような書き方になっているのか？
      const { post }: { post: Post } = await res.json()
      setTitle(post.title)
      setContent(post.content)
      setThumbnailUrl(post.thumbnailUrl)
      setCategories(post.postCategories.map((pc) => pc.category))
    }

    fetcher()
  }, [id])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm 
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        isSubmitting={isSubmitting}
      />
    </div>    
  )
}