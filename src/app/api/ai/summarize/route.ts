import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { summarizePost } from '@/lib/ai/agents';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postContent } = body;

    if (!postContent) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      );
    }

    const summary = await summarizePost(postContent);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to summarize post' },
      { status: 500 }
    );
  }
}
