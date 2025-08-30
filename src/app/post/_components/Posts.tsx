"use client"

import { useEffect, useState } from "react";
import { PostsItem } from "./PostItem";
import { Post } from "@/app/_types/Post";

export const  Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/posts")
        if (!res.ok) {
          throw new Error("データが見つかりません。");
        }
        const { posts } = await res.json();
        setPosts(posts);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetcher();
  }, []);

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!posts) {
    return <div>データが見つかりません。</div>
  }

  return (
    <dl>
      {posts.map((elem: Post) => 
        <PostsItem post={elem} key={elem.id} />
      )}
    </dl>
  );
}