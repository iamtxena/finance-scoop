import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export type Sentiment = 'opportunity' | 'neutral' | 'irrelevant';

export function useAnalyzeSentiment() {
  return useMutation({
    mutationFn: async (postContent: string) => {
      const { data } = await axios.post('/api/ai/analyze', { postContent });
      return data.sentiment as Sentiment;
    },
  });
}

export function useDraftReply() {
  return useMutation({
    mutationFn: async ({
      postContent,
      postId,
      customContext,
    }: {
      postContent: string;
      postId?: string;
      customContext?: string;
    }) => {
      const { data } = await axios.post('/api/ai/draft', {
        postContent,
        postId,
        customContext,
      });
      return data.draft as string;
    },
  });
}

export function useSummarizePost() {
  return useMutation({
    mutationFn: async (postContent: string) => {
      const { data } = await axios.post('/api/ai/summarize', { postContent });
      return data.summary as string;
    },
  });
}
