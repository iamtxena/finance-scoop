import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { draftReply } from '@/lib/ai/agents';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { postContent, postId, customContext } = body;

    if (!postContent) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      );
    }

    const draft = await draftReply(postContent, customContext);

    // Save draft to database if postId provided
    if (postId) {
      const supabase = await createClient();
      await supabase.from('ai_drafts').insert({
        user_id: userId,
        post_id: postId,
        draft_content: draft,
      });
    }

    return NextResponse.json({ draft });
  } catch (error) {
    console.error('Error generating draft:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate draft' },
      { status: 500 }
    );
  }
}
