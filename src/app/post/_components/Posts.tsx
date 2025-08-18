"use client"

import { useEffect, useState } from "react";
import { PostsItem } from "./PostItem";
import { MicroCmsPost, Post } from "@/app/_types/Post";

export const  Posts: React.FC = () => {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(
          'https://kbg0qm7d0c.microcms.io/api/v1/posts', 
          {
            headers: {
              'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
            },
          },
        )
        if (!res.ok) {
          throw new Error("データが見つかりません。");
        }
        const { contents } = await res.json();
        setPosts(contents);
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
      {posts.map((elem: MicroCmsPost) => 
        <PostsItem post={elem} key={elem.id} />
      )}
    </dl>
  );
}