import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { searchSubreddit } from '@/lib/reddit/client';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subreddit, query, limit = 25 } = body;

    if (!subreddit || !query) {
      return NextResponse.json(
        { error: 'Subreddit and query are required' },
        { status: 400 }
      );
    }

    const posts = await searchSubreddit(subreddit, query, limit);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error searching subreddit:', error);

    // Return 429 for rate limit errors
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search subreddit' },
      { status: 500 }
    );
  }
}
