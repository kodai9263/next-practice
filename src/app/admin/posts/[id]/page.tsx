"use client"

import { Category } from "@/app/_types/Category"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PostForm } from "../_components/PostForm"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { PostCategory } from "@prisma/client"
import { useFetch } from "@/app/_hooks/useFetch"

type FormValues = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: Category[];
}

export default function Page() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [thumbnailImageKey, setThumbnailImageKey] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()

  // useFetchを使用
  const { data, error, isLoading } = useFetch(`/api/admin/posts/${id}`)

  // データが取得できたら既存内容を設定
  useEffect(() => {
    if (!id || !token) return
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const json = await res.json()
        if (json?.post?.title)
        setTitle(json.post.title)
        setContent(json.post.content)
        setThumbnailImageKey(json.post.thumbnailImageKey)
        setCategories(json.postCategories.map((pc: PostCategory) => pc.categoryId))
      } catch {}
      })()
  }, [id, token, data?.post?.title, data?.post?.content, data?.post?.thumbnailImageKey, data?.postCategories])

  const handleSubmit = async (e:React.FormEvent) => {
    // 勝手にリロードされないようにする
    e.preventDefault()
    setIsSubmitting(true)
    if (!token) return
  
    // PUTリクエストで記事を更新
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // ← JSONデータであることを明示
          Authorization: token,
        },
        body: JSON.stringify({ title, content, thumbnailImageKey, categories }),
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

  if (isLoading) return <div>loading...</div>
  if (error) return <div>エラーが発生しました。</div>

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
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        isSubmitting={isSubmitting}
      />
    </div>    
  )
}