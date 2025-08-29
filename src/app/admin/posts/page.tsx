"use client"

import { Post } from "@/app/_types/Post"
import Link from "next/link"

import { useEffect, useState } from "react"

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/posts")

        if (!res.ok) {
          throw new Error("データが見つかりません。")
        }
        const { posts } = await res.json()
        setPosts(posts)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetcher()
  }, [])

  if (isLoading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!posts) {
    return <div>データが見つかりません。</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/admin/posts/new">新規作成</Link></button>
      </div>
      
      <div>
        {posts.map((post) => {
          return (
            <Link href={`/admin/posts/${post.id}`} key={post.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{post.title}</div>
                <div className="text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}