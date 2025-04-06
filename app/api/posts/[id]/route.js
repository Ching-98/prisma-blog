// app/api/posts/[id]/route.js
// This file handles API requests for a specific post by ID

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET handler to fetch a single post by ID
export async function GET(request, { params }) {
  try {
    // Properly access the id from params - must await params in Next.js 13+
    const { id } = params;

    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PATCH handler to update a post
export async function PATCH(request, { params }) {
  try {
    // Properly access the id from params - must await params in Next.js 13+
    const { id } = params;
    const { title, content, published } = await request.json();

    const updatedPost = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        published,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a post
export async function DELETE(request, { params }) {
  try {
    // Properly access the id from params - must await params in Next.js 13+
    const { id } = params;

    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
