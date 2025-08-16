"use client"

import Link from "next/link";
import classes from '../../../styles/PostItem.module.css';
import { Post } from "@/types/Post";
import { FormatDate } from "./FormDate";
import { Categories } from "./Categories";


export const PostsItem: React.FC<{post: Post}> = ({ post }) => {

  return (
    <>
      <Link href={`/post/${post.id}`} className={classes.link}>
        <div className={classes.container}>
        <header className={classes.postHeader}>
          <FormatDate date={post.createdAt} />
          <Categories categories={post.categories} />
        </header>
        <h1 className={classes.postTitle}>APIで取得した{post.title}</h1>
        <div className={classes.postContent} dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
      </Link>
    </>
  );
}