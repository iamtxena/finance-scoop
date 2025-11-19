'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSubredditHotPosts, useSearchSubreddit, type RedditPost } from '@/hooks/use-reddit';
import { useAnalyzeSentiment } from '@/hooks/use-ai';
import { PostDetailModal } from '@/components/features/post-detail-modal';

export default function SubredditsPage() {
  const [selectedSubreddit, setSelectedSubreddit] = useState('algotrading');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState(''); // Committed search query
  const [modalPost, setModalPost] = useState<RedditPost | null>(null);

  const { data: hotPosts, isLoading: hotLoading } = useSubredditHotPosts(selectedSubreddit, 25);
  const {
    data: searchResults,
    isLoading: searchLoading,
  } = useSearchSubreddit(selectedSubreddit, activeQuery, 25);
  const analyzeMutation = useAnalyzeSentiment();

  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<string | null>(null);

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery);
    }
  };

  const handleAnalyze = async (postContent: string, postId: string) => {
    setSelectedPost(postId);
    const result = await analyzeMutation.mutateAsync(postContent);
    setSentiment(result);
  };

  const posts = (activeQuery ? searchResults : hotPosts) || [];
  const isLoading = activeQuery ? searchLoading : hotLoading;

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
            <Button onClick={handleSearch} disabled={searchLoading}>
              {searchLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {isLoading ? (
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
                      <button
                        onClick={() => setModalPost(post)}
                        className="hover:underline text-left"
                      >
                        {post.title}
                      </button>
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
                      onClick={() => setModalPost(post)}
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

      {modalPost && (
        <PostDetailModal
          post={modalPost}
          open={!!modalPost}
          onOpenChange={(open) => !open && setModalPost(null)}
        />
      )}
    </div>
  );
}
