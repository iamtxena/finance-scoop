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
  });
}

export function useSearchSubreddit() {
  return useMutation({
    mutationFn: async ({
      subreddit,
      query,
      limit = 25,
    }: {
      subreddit: string;
      query: string;
      limit?: number;
    }) => {
      const { data } = await axios.post('/api/reddit/search', {
        subreddit,
        query,
        limit,
      });
      return data.posts as RedditPost[];
    },
  });
}
