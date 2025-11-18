'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DraftsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Drafts</h1>
        <p className="text-muted-foreground">
          View and manage AI-generated reply drafts for Reddit posts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Generated Drafts</CardTitle>
          <CardDescription>
            All drafts generated from the Subreddits page will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              No drafts yet. Go to the Subreddits page to generate replies for posts.
            </p>
            <div className="flex justify-center">
              <Button asChild>
                <a href="/subreddits">Browse Subreddits</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How it Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">1. Find Relevant Posts</h3>
            <p className="text-sm text-muted-foreground">
              Browse or search finance subreddits for posts about alerts, trading tools, or
              portfolio tracking
            </p>
          </div>
          <div>
            <h3 className="font-semibold">2. Analyze Sentiment</h3>
            <p className="text-sm text-muted-foreground">
              Use AI to classify posts as opportunity, neutral, or irrelevant
            </p>
          </div>
          <div>
            <h3 className="font-semibold">3. Generate Reply</h3>
            <p className="text-sm text-muted-foreground">
              Create elegant, helpful replies mentioning Lona with Grok-powered AI
            </p>
          </div>
          <div>
            <h3 className="font-semibold">4. Copy & Post</h3>
            <p className="text-sm text-muted-foreground">
              Copy the draft to your clipboard and post it on Reddit
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
