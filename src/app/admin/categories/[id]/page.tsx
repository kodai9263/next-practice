"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { CategoryForm } from "../_components/CategoryForm"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import useSWR from "swr"
import { fetcher } from "@/utils/fetcher"

export default function Page() {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()

  // SWRを使用
  const { data, error, isLoading } = useSWR(
    id && token ? [`/api/admin/categories/${id}`, token] : null,
    ([url, token]) => fetcher(url, token)
  )

  // データが取得できたらnameを設定
  if (data?.category && name === "") {
    setName(data.category.name)
  }

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!token) return

    // PUTリクエストでカテゴリーを更新
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        throw new Error("更新に失敗しました。")
      }
      alert("カテゴリーを更新しました。")
    } catch (e : any) {
      console.log(e)
      alert("更新中にエラーが発生しました。")
    } finally {
      setIsSubmitting(false)
    }
  } 

  // DELETEリクエストでカテゴリーを削除
  const handleDeleteCategory = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/admin/categories/${id}`,{
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("削除に失敗しました。")
      }
      alert("カテゴリーを削除しました。")

      // カテゴリー一覧ページに遷移
      router.push("/admin/categories")
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
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <CategoryForm 
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDeleteCategory}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}