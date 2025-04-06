// app/posts/create/page.js
// Page for creating a new post

import PostForm from "@/app/components/PostForm";

export default function CreatePost() {
  return (
    <div className="container">
      <PostForm />
    </div>
  );
}
