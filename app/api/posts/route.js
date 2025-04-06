// app/api/posts/route.js
// This file handles API requests for posts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET handler to fetch all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST handler to create a new post
export async function POST(request) {
  try {
    const { title, content, published } = await request.json();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
