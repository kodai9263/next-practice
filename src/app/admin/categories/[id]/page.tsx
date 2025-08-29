"use client"

import { Category } from "@/app/_types/Category"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CategoryForm } from "../_components/CategoryForm"

export default function Page() {
  const [name, setName] = useState("")
  const { id } = useParams()
  const router = useRouter()

  const handleSubmit = async (e:React.FormEvent) => {
    // 勝手にリロードされないようにする
    e.preventDefault()

    // PUTリクエストでカテゴリーを更新
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
    
    alert("カテゴリーを更新しました。")
  }

  // DELETEリクエストでカテゴリーを削除
  const handleDeleteCategory = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return

    await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    })

    alert("カテゴリーを削除しました。")

    // カテゴリー一覧ページに遷移
    router.push("/admin/categories")
  }

  // 更新の際に既存のデータを表示する
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`)
      const { category }: { category: Category} = await res.json()
      setName(category.name)
    }

    fetcher()
  }, [id])

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
      />
    </div>
  )

}