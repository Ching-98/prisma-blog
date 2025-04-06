// app/posts/[id]/page.js
// Page for viewing a single post

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const deletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        // Redirect to the home page after deletion
        router.push("/");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!post) return <div className="not-found">Post not found</div>;

  return (
    <div className="post-detail">
      <div className="post-header">
        <h1>{post.title}</h1>
        <span className="post-status">
          {post.published ? "Published" : "Draft"}
        </span>
      </div>

      <div className="post-meta">
        <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
        <p>Last updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
      </div>

      <div className="post-content">
        {post.content ? (
          <p>{post.content}</p>
        ) : (
          <p className="no-content">No content available</p>
        )}
      </div>

      <div className="post-actions">
        <Link href="/" className="back-button">
          Back to Posts
        </Link>
        <Link href={`/posts/edit/${postId}`} className="edit-button">
          Edit Post
        </Link>
        <button onClick={deletePost} className="delete-button">
          Delete Post
        </button>
      </div>
    </div>
  );
}
