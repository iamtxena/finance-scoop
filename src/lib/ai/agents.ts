import { xai } from '@ai-sdk/xai';
import { traceable } from 'langsmith/traceable';
import { generateText } from './client';
import {
  getSentimentAnalysisPrompt,
  getReplyDraftPrompt,
  getSummarizationPrompt,
} from './prompts';

export type Sentiment = 'opportunity' | 'neutral' | 'irrelevant';

/**
 * Analyze sentiment of a Reddit post to determine if it's an opportunity for Lona promotion
 */
export const analyzeSentiment = traceable(
  async (postContent: string): Promise<Sentiment> => {
    const { text } = await generateText({
      model: xai('grok-4-fast-reasoning'), // Use reasoning model for classification
      prompt: getSentimentAnalysisPrompt(postContent),
      temperature: 0.1, // Low temperature for consistent classification
    });

    const sentiment = text.trim().toLowerCase();

    if (sentiment.includes('opportunity')) {
      return 'opportunity';
    } else if (sentiment.includes('neutral')) {
      return 'neutral';
    } else {
      return 'irrelevant';
    }
  },
  {
    name: 'analyze-reddit-sentiment',
    run_type: 'llm',
    metadata: {
      model: 'grok-4-fast-reasoning',
      task: 'sentiment-classification',
    },
  }
);

/**
 * Generate a draft reply for promoting Lona on a Reddit post
 */
export const draftReply = traceable(
  async (postContent: string, customContext?: string): Promise<string> => {
    const { text } = await generateText({
      model: xai('grok-4-fast-reasoning'), // Use reasoning model for better quality
      prompt: getReplyDraftPrompt(postContent, customContext),
      temperature: 0.7, // Moderate temperature for creative but controlled responses
    });

    return text.trim();
  },
  {
    name: 'draft-lona-reply',
    run_type: 'llm',
    metadata: {
      model: 'grok-4-fast-reasoning',
      task: 'reply-generation',
    },
  }
);

/**
 * Summarize a Reddit post
 */
export const summarizePost = traceable(
  async (postContent: string): Promise<string> => {
    const { text } = await generateText({
      model: xai('grok-4-fast-reasoning'),
      prompt: getSummarizationPrompt(postContent),
      temperature: 0.3,
    });

    return text.trim();
  },
  {
    name: 'summarize-reddit-post',
    run_type: 'llm',
    metadata: {
      model: 'grok-4-fast-reasoning',
      task: 'summarization',
    },
  }
);
