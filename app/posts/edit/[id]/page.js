// app/posts/edit/[id]/page.js
// Page for editing an existing post

"use client";

import { useParams } from "next/navigation";
import PostForm from "@/app/components/PostForm";

export default function EditPost() {
  const params = useParams();
  const postId = params.id;

  return (
    <div className="container">
      <PostForm postId={postId} />
    </div>
  );
}
