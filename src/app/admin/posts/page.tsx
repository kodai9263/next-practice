"use client"

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { Post } from "@/app/_types/Post"
import { fetcher } from "@/utils/fetcher"
import Link from "next/link"

import { useEffect, useState } from "react"
import useSWR from "swr"

export default function Page() {
  const { token } = useSupabaseSession()

  // SWRを使用
  const { data, error, isLoading } = useSWR(
    token ? ["/api/admin/posts", token] : null,
    ([url, token]) => fetcher(url, token)
  )

  const posts = data?.posts || []

  if (isLoading) return <div>loading...</div>
  if (error) return <div>エラーが発生しました。</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><Link href="/admin/posts/new">新規作成</Link></button>
      </div>
      
      <div>
        {posts.map((post: Post) => {
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