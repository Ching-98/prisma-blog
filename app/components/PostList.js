// app/components/PostList.js
// This component displays a list of posts

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        // Remove the deleted post from the state
        setPosts(posts.filter((post) => post.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="post-list">
      <h2>Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found. Create your first post!</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <div className="post-header">
                <h3>
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </h3>
                <span className="post-status">
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="post-content">
                {post.content
                  ? post.content.length > 100
                    ? `${post.content.substring(0, 100)}...`
                    : post.content
                  : "No content"}
              </p>
              <div className="post-actions">
                <Link href={`/posts/edit/${post.id}`} className="edit-button">
                  Edit
                </Link>
                <button
                  onClick={() => deletePost(post.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="create-post">
        <Link href="/posts/create" className="create-button">
          Create New Post
        </Link>
      </div>
    </div>
  );
}
