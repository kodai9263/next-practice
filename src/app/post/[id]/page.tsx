'use client'

import { useParams } from "next/navigation";
import classes from "../../../styles/PostDetail.module.css";
import { useEffect, useState } from "react";
import { API_URL } from "@/constans";
import { Post } from "@/types/Post";
import { FormatDate } from "../_components/FormDate";
import { Categories } from "../_components/Categories";


export default function Page() {

  // URLからidを取得
  const { id } = useParams<{ id: string }>();

  // APIでpost詳細を取得
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`${API_URL}/posts/${id}`);
        if (!res.ok) {
          throw new Error("記事が見つかりませんでした。");
        }
        const data = await res.json();
        setPost(data.post);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
      
    fetcher();
  }, [id]);

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!post) {
    return <div>記事が見つかりませんでした。</div>
  }

  return (
    <>
      <div className={classes.container}>
        <img src={post.thumbnailUrl}/>
        <div className={classes.dateCategoryContainer}>
          <FormatDate date={post.createdAt}/>
          <Categories categories={post.categories}/>
        </div>
        <h1 className={classes.postTitle}>APIで取得した{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
    </>
  );
}