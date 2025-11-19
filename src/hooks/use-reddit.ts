import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  url: string;
  created_utc: number;
  permalink: string;
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
  depth: number;
  replies?: RedditComment[];
}

export function useUserPosts(username: string, limit: number = 25) {
  return useQuery({
    queryKey: ['reddit', 'users', username, limit],
    queryFn: async () => {
      const { data } = await axios.get(`/api/reddit/users/${username}?limit=${limit}`);
      return data.posts as RedditPost[];
    },
    enabled: !!username,
  });
}

export function useSubredditHotPosts(subreddit: string, limit: number = 25) {
  return useQuery({
    queryKey: ['reddit', 'subreddits', subreddit, limit],
    queryFn: async () => {
      const { data } = await axios.get(`/api/reddit/subreddits/${subreddit}?limit=${limit}`);
      return data.posts as RedditPost[];
    },
    enabled: !!subreddit,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour (previously cacheTime)
  });
}

export function useSearchSubreddit(subreddit: string, query: string, limit: number = 25) {
  return useQuery({
    queryKey: ['reddit', 'search', subreddit, query, limit],
    queryFn: async () => {
      const { data } = await axios.post('/api/reddit/search', {
        subreddit,
        query,
        limit,
      });
      return data.posts as RedditPost[];
    },
    enabled: !!subreddit && !!query, // Only fetch when query exists
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function usePostComments(postId: string, subreddit: string, limit: number = 50) {
  return useQuery({
    queryKey: ['reddit', 'posts', postId, 'comments', limit],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/reddit/posts/${postId}/comments?subreddit=${subreddit}&limit=${limit}`
      );

      // Check if the response has an error field
      if (data.error) {
        throw new Error(data.error);
      }

      // Ensure comments is an array
      if (!Array.isArray(data.comments)) {
        throw new Error('Invalid response format: comments is not an array');
      }

      return data.comments as RedditComment[];
    },
    enabled: !!postId && !!subreddit,
  });
}
