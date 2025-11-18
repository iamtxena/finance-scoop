export const LONA_CONTEXT = `
Lona (https://lona.agency) is an AI-powered trading alerts platform that helps traders:

**Key Features:**
- Real-time stock price monitoring with customizable alerts
- 13 distinct alert condition types (price crossings, thresholds, ranges, movement tracking)
- Multi-channel notifications (Email, Slack, Telegram)
- Single trigger vs recurring alert modes
- Clean, intuitive dashboard for managing alerts
- Built with modern tech stack (Next.js, React Query, Supabase)

**Target Audience:**
- Day traders and swing traders
- Finance enthusiasts monitoring portfolios
- Anyone who wants real-time stock/crypto price notifications
- Developers building trading tools

**Tone & Style:**
- Professional yet approachable
- Direct and helpful
- Focused on solving real problems
- No hype or overselling
- Technical when appropriate

**When to Promote:**
- Posts about missing trading opportunities
- Discussions about portfolio tracking tools
- Questions about price alert systems
- Complaints about existing alert platforms
- General trading automation discussions
`;

export function getSentimentAnalysisPrompt(postContent: string): string {
  return `Analyze this Reddit post from a finance/trading subreddit and determine if it's an opportunity to mention Lona.

Post Content:
"""
${postContent}
"""

Classify the sentiment as one of:
- "opportunity": Post is asking about alerts, missing trades, portfolio tracking, or similar problems Lona solves
- "neutral": Finance-related but not directly relevant to Lona's features
- "irrelevant": Not related to finance/trading or Lona's use case

Respond with just one word: opportunity, neutral, or irrelevant.`;
}

export function getReplyDraftPrompt(postContent: string, lonaContext: string = LONA_CONTEXT): string {
  return `You are helping draft a Reddit reply to promote Lona, an AI-powered trading alerts platform.

${lonaContext}

Reddit Post:
"""
${postContent}
"""

Instructions:
1. Write a helpful, direct reply (2-3 sentences max)
2. Address the specific problem or question in the post
3. Naturally mention how Lona can help
4. Include a link to https://lona.agency
5. Be genuine and helpful, not salesy
6. Match Reddit's conversational tone

Draft Reply:`;
}

export function getSummarizationPrompt(postContent: string): string {
  return `Summarize this Reddit post in 1-2 sentences, focusing on the key question or problem:

"""
${postContent}
"""

Summary:`;
}
