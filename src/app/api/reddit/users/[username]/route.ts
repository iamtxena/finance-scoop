import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserPosts } from '@/lib/reddit/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25');

    const posts = await getUserPosts(username, limit);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);

    // Return 429 for rate limit errors
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
}
