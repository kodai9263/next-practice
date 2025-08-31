"use client"

import Link from "next/link";
import classes from '../../_styles/PostItem.module.css';
import { FormatDate } from "./FormatDate";
import { Categories } from "./Categories";
import { Post } from "@/app/_types/Post";


export const PostsItem: React.FC<{post: Post}> = ({ post }) => {

  return (
    <>
      <Link href={`/post/${post.id}`} className={classes.link}>
        <div className={classes.container}>
        <header className={classes.postHeader}>
          <FormatDate date={post.createdAt} />
          <Categories categories={post.postCategories.map(pc => pc.category.name)} />
        </header>
        <h1 className={classes.postTitle}>APIで取得した{post.title}</h1>
        <div className={classes.postContent} dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
      </Link>
    </>
  );
}