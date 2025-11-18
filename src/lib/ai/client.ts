import * as ai from 'ai';
import { wrapAISDK } from 'langsmith/experimental/vercel';
import { Client } from 'langsmith';

// Create LangSmith client
export const langsmithClient = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY,
});

// Wrap AI SDK methods with LangSmith monitoring
export const { generateText, streamText, generateObject, streamObject } = wrapAISDK(ai, {
  client: langsmithClient,
  metadata: {
    project: 'finance-scoop',
    environment: process.env.NODE_ENV || 'development',
  },
});
