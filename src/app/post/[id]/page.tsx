'use client'

import { useParams } from "next/navigation";
import classes from "../../_styles/PostDetail.module.css";
import { useEffect, useState } from "react";
import { FormatDate } from "../_components/FormatDate";
import { Categories } from "../_components/Categories";
import Image from "next/image";
import { Post } from "@/app/_types/Post";

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
        const res = await fetch(`/api/posts/${id}`)

        if (!res.ok) {
          throw new Error("記事が見つかりませんでした。");
        }
        const { post } = await res.json();
        setPost(post);
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
          <Image src={post.thumbnailUrl} alt="" height={500} width={800} />
        <div className={classes.dateCategoryContainer}>
          <FormatDate date={post.createdAt}/>
          <Categories categories={post.postCategories.map(pc => pc.category.name)}/>
        </div>
        <h1 className={classes.postTitle}>APIで取得した{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
    </>
  );
}