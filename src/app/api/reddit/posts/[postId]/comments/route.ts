import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getPostComments } from '@/lib/reddit/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await params;
    const { searchParams } = new URL(request.url);
    const subreddit = searchParams.get('subreddit');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!subreddit) {
      return NextResponse.json(
        { error: 'Subreddit parameter is required' },
        { status: 400 }
      );
    }

    const comments = await getPostComments(postId, subreddit, limit);

    console.log(
      `[Comments API] Fetched ${comments.length} comments for post ${postId} in r/${subreddit}`
    );

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching post comments:', error);

    // Return 429 for rate limit errors
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
