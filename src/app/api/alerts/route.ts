import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: alerts, error } = await supabase
      .from('keyword_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { keywords, subreddits, active = true, trigger_mode = 'recurring' } = body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!subreddits || !Array.isArray(subreddits) || subreddits.length === 0) {
      return NextResponse.json(
        { error: 'Subreddits array is required and must not be empty' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: alert, error } = await supabase
      .from('keyword_alerts')
      .insert({
        user_id: userId,
        keywords,
        subreddits,
        active,
        trigger_mode,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create alert' },
      { status: 500 }
    );
  }
}
