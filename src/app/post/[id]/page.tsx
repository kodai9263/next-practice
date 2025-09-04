'use client'

import { useParams } from "next/navigation";
import classes from "../../_styles/PostDetail.module.css";
import { useEffect, useState } from "react";
import { FormatDate } from "../_components/FormatDate";
import { Categories } from "../_components/Categories";
import Image from "next/image";
import { Post } from "@/app/_types/Post";
import { supabase } from "@/utils/supabase";

export default function Page() {

  // URLからidを取得
  const { id } = useParams<{ id: string }>();

  // APIでpost詳細を取得
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null)

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

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!post?.thumbnailImageKey) return

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(post.thumbnailImageKey)

        setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [post?.thumbnailImageKey])

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
          {thumbnailImageUrl && (
            <Image src={thumbnailImageUrl} alt="" height={1000} width={1000}/>
          )}
        <div className={classes.dateCategoryContainer}>
          <FormatDate date={post.createdAt}/>
          <Categories categories={post.postCategories.map(pc => pc.category.name)}/>
        </div>
          {post && post.title && (
            <h1 className={classes.postTitle}>APIで取得した{post.title}</h1>
          )}
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>
    </>
  );
}