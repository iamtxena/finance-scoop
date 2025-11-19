'use client';

import { useState } from 'react';
import { ExternalLink, MessageCircle, ThumbsUp, User, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { usePostComments, type RedditPost, type RedditComment } from '@/hooks/use-reddit';
import { useDraftReply } from '@/hooks/use-ai';

interface PostDetailModalProps {
  post: RedditPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Comment({ comment }: { comment: RedditComment }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm font-medium">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(comment.created_utc)}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ThumbsUp className="w-3 h-3" />
              <span>{comment.score}</span>
            </div>
          </div>
          <p className="text-sm whitespace-pre-wrap">{comment.body}</p>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 space-y-2 border-l-2 border-muted pl-4">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}

export function PostDetailModal({ post, open, onOpenChange }: PostDetailModalProps) {
  const [customContext, setCustomContext] = useState('');
  const [draft, setDraft] = useState<string | null>(null);

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = usePostComments(post.id, post.subreddit);

  const draftReply = useDraftReply();

  const handleGenerateDraft = async () => {
    setDraft(null);
    try {
      const postContent = `${post.title}\n\n${post.selftext}`;
      const result = await draftReply.mutateAsync({
        postContent,
        postId: post.id,
        customContext: customContext || undefined,
      });
      setDraft(result);
    } catch (error) {
      console.error('Failed to generate draft:', error);
    }
  };

  const handleCopyToClipboard = () => {
    if (draft) {
      navigator.clipboard.writeText(draft);
      alert('Draft copied to clipboard!');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-start gap-2">
            <span className="flex-1">{post.title}</span>
            <a
              href={`https://reddit.com${post.permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              u/{post.author}
            </span>
            <span>r/{post.subreddit}</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {post.score}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.num_comments}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatTimeAgo(post.created_utc)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Content */}
          {post.selftext && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Post Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{post.selftext}</p>
              </CardContent>
            </Card>
          )}

          {/* Custom Context Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate Reply Draft</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Custom Instructions (Optional)
                </label>
                <Textarea
                  placeholder="E.g., Focus on the technical aspects, mention our pricing, be more casual..."
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={handleGenerateDraft}
                disabled={draftReply.isPending}
                className="w-full"
              >
                {draftReply.isPending ? 'Generating...' : 'Generate Draft Reply'}
              </Button>

              {draft && (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>Generated Draft</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyToClipboard}
                      >
                        Copy to Clipboard
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{draft}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({post.num_comments})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commentsLoading ? (
                <p className="text-sm text-muted-foreground">Loading comments...</p>
              ) : commentsError ? (
                <p className="text-sm text-destructive">
                  Failed to load comments: {commentsError.message}
                </p>
              ) : !comments || !Array.isArray(comments) || comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
