// app/components/PostForm.js
// This component provides a form for creating or editing posts

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostForm({ postId }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // If postId is provided, fetch the post data for editing
  useEffect(() => {
    if (postId) {
      setIsEditing(true);
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/posts/${postId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch post");
          }
          const data = await response.json();
          setFormData({
            title: data.title,
            content: data.content || "",
            published: data.published,
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [postId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEditing ? `/api/posts/${postId}` : "/api/posts";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} post`);
      }

      // Redirect to the posts list page after successful submission
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing)
    return <div className="loading">Loading post...</div>;

  return (
    <div className="post-form-container">
      <h1>{isEditing ? "Edit Post" : "Create New Post"}</h1>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            className="form-control"
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            Publish this post
          </label>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
