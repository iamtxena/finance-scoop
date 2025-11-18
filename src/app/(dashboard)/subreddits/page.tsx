'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSubredditHotPosts, useSearchSubreddit } from '@/hooks/use-reddit';
import { useDraftReply, useAnalyzeSentiment } from '@/hooks/use-ai';

export default function SubredditsPage() {
  const [selectedSubreddit, setSelectedSubreddit] = useState('algotrading');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: hotPosts, isLoading } = useSubredditHotPosts(selectedSubreddit, 25);
  const searchMutation = useSearchSubreddit();
  const analyzeMutation = useAnalyzeSentiment();
  const draftMutation = useDraftReply();

  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);

  const popularSubreddits = [
    'algotrading',
    'investing',
    'stocks',
    'wallstreetbets',
    'options',
    'daytrading',
    'personalfinance',
    'cryptocurrency',
  ];

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchMutation.mutateAsync({
        subreddit: selectedSubreddit,
        query: searchQuery,
      });
    }
  };

  const handleAnalyze = async (postContent: string, postId: string) => {
    setSelectedPost(postId);
    const result = await analyzeMutation.mutateAsync(postContent);
    setSentiment(result);
  };

  const handleGenerateDraft = async (postContent: string, postId: string) => {
    setSelectedPost(postId);
    const result = await draftMutation.mutateAsync({ postContent, postId });
    setDraft(result);
  };

  const posts = searchMutation.data || hotPosts || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subreddit Monitor</h1>
        <p className="text-muted-foreground">Browse and search finance subreddits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Finance Subreddits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularSubreddits.map((sub) => (
              <Button
                key={sub}
                variant={selectedSubreddit === sub ? 'default' : 'outline'}
                onClick={() => setSelectedSubreddit(sub)}
              >
                r/{sub}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search r/{selectedSubreddit}</CardTitle>
          <CardDescription>Find posts matching specific keywords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={searchMutation.isPending}>
              {searchMutation.isPending ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {isLoading || searchMutation.isPending ? (
          <Card>
            <CardContent className="p-6">Loading posts...</CardContent>
          </Card>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {post.title}
                      </a>
                    </CardTitle>
                    <CardDescription>
                      by u/{post.author} in r/{post.subreddit} • {post.score} upvotes •{' '}
                      {post.num_comments} comments
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAnalyze(`${post.title}\n\n${post.selftext}`, post.id)}
                      disabled={analyzeMutation.isPending}
                    >
                      Analyze
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        handleGenerateDraft(`${post.title}\n\n${post.selftext}`, post.id)
                      }
                      disabled={draftMutation.isPending}
                    >
                      Draft Reply
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {post.selftext && (
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{post.selftext}</p>
                </CardContent>
              )}
              {selectedPost === post.id && sentiment && (
                <CardContent>
                  <div className="space-y-2 rounded-lg bg-muted p-4">
                    <h4 className="text-sm font-semibold">AI Analysis</h4>
                    <Badge
                      variant={
                        sentiment === 'opportunity'
                          ? 'default'
                          : sentiment === 'neutral'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {sentiment}
                    </Badge>
                  </div>
                </CardContent>
              )}
              {selectedPost === post.id && draft && (
                <CardContent>
                  <div className="space-y-2 rounded-lg bg-muted p-4">
                    <h4 className="text-sm font-semibold">Generated Reply</h4>
                    <p className="whitespace-pre-wrap text-sm">{draft}</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(draft);
                        alert('Copied to clipboard!');
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No posts found. Try a different search or subreddit.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
