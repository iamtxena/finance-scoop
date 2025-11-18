import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchSubreddit } from '@/lib/reddit/client';
import { analyzeSentiment } from '@/lib/ai/agents';
import { sendNotification } from '@/lib/notifications/notifier';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('keyword_alerts')
      .select('*')
      .eq('active', true);

    if (alertsError) throw alertsError;

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({ message: 'No active alerts found' });
    }

    let totalProcessed = 0;
    let totalNotifications = 0;

    // Process each alert
    for (const alert of alerts) {
      try {
        // Get user profile for notification preferences
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', alert.user_id)
          .single();

        // Search each subreddit for each keyword
        for (const keyword of alert.keywords) {
          for (const subreddit of alert.subreddits) {
            try {
              const posts = await searchSubreddit(subreddit, keyword, 10);

              // Filter posts from last 15 minutes (since last cron run)
              const fifteenMinutesAgo = Date.now() / 1000 - 900;
              const newPosts = posts.filter(
                (post) => post.created_utc > fifteenMinutesAgo
              );

              for (const post of newPosts) {
                // Check if post already exists
                const { data: existingPost } = await supabase
                  .from('reddit_posts')
                  .select('id')
                  .eq('post_id', post.id)
                  .single();

                if (existingPost) continue;

                // Analyze sentiment
                const content = `${post.title}\n\n${post.selftext}`;
                const sentiment = await analyzeSentiment(content);

                // Save post to database
                await supabase.from('reddit_posts').insert({
                  user_id: alert.user_id,
                  post_id: post.id,
                  subreddit: post.subreddit,
                  title: post.title,
                  content: post.selftext,
                  author: post.author,
                  url: post.permalink,
                  score: post.score,
                  num_comments: post.num_comments,
                  sentiment,
                  created_at: new Date(post.created_utc * 1000).toISOString(),
                });

                // Send notification if opportunity detected
                if (sentiment === 'opportunity' && profile) {
                  await sendNotification(
                    profile.reddit_username || null,
                    {
                      userId: alert.user_id,
                      postTitle: post.title,
                      postUrl: post.permalink,
                      subreddit: post.subreddit,
                      sentiment,
                      keywords: [keyword],
                    },
                    {
                      email: profile.notification_email,
                      slack: profile.notification_slack,
                    }
                  );

                  totalNotifications++;

                  // Log notification
                  await supabase.from('notifications').insert({
                    user_id: alert.user_id,
                    type: profile.notification_email ? 'email' : 'slack',
                    content: `New opportunity: ${post.title}`,
                    sent: true,
                  });
                }

                totalProcessed++;
              }
            } catch (error) {
              console.error(
                `Error processing keyword "${keyword}" in r/${subreddit}:`,
                error
              );
            }
          }
        }
      } catch (error) {
        console.error(`Error processing alert ${alert.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      processed: totalProcessed,
      notifications: totalNotifications,
      alerts: alerts.length,
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron job failed' },
      { status: 500 }
    );
  }
}
