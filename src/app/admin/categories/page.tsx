"use client"

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { Category } from "@/app/_types/Category"
import Link from "next/link"
import { useFetch } from "@/app/_hooks/useFetch"

export default function Page() {
  const { token } = useSupabaseSession()

  // useFetchを使用
  const { data, error, isLoading } = useFetch("/api/admin/categories")
  
  const categories = data?.categories || []

  if (isLoading) return <div>loading...</div>
  if (error) return <div>エラーが発生しました。</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">カテゴリー一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/admin/categories/new">新規作成</Link></button>
      </div>

      <div>
        {categories.map((category: Category) => {
          return (
            <Link href={`/admin/categories/${category.id}`} key={category.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{category.name}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}