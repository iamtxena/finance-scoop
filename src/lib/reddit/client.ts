import { cacheGet, cacheSet, checkRateLimit } from '../redis/client';

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

// Reddit Public JSON API - No authentication needed!
const REDDIT_API_BASE = 'https://www.reddit.com';
const USER_AGENT = 'finance-scoop:v1.0.0 (by /u/your_username)';

/**
 * Fetch data from Reddit's public JSON API
 */
async function fetchReddit(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Parse Reddit API response into RedditPost
 */
function parsePost(post: any): RedditPost {
  return {
    id: post.id,
    title: post.title,
    selftext: post.selftext || '',
    author: post.author,
    subreddit: post.subreddit,
    score: post.score,
    num_comments: post.num_comments,
    url: post.url,
    created_utc: post.created_utc,
    permalink: `https://reddit.com${post.permalink}`,
  };
}

/**
 * Get user's submitted posts
 */
export async function getUserPosts(username: string, limit: number = 25): Promise<RedditPost[]> {
  // Check rate limit
  const { success } = await checkRateLimit(`reddit:user:${username}`, 10, 600);
  if (!success) {
    throw new Error('Rate limit exceeded');
  }

  // Try cache first
  const cacheKey = `reddit:user:${username}:posts`;
  const cached = await cacheGet<RedditPost[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from Reddit public API
  const url = `${REDDIT_API_BASE}/user/${username}/submitted.json?limit=${limit}`;
  const data = await fetchReddit(url);

  const posts: RedditPost[] = data.data.children.map((child: any) => parsePost(child.data));

  // Cache for 5 minutes
  await cacheSet(cacheKey, posts, 300);

  return posts;
}

/**
 * Search subreddit for keywords
 */
export async function searchSubreddit(
  subredditName: string,
  query: string,
  limit: number = 25
): Promise<RedditPost[]> {
  // Check rate limit
  const { success } = await checkRateLimit(`reddit:search:${subredditName}`, 10, 600);
  if (!success) {
    throw new Error('Rate limit exceeded');
  }

  // Try cache first
  const cacheKey = `reddit:search:${subredditName}:${query}`;
  const cached = await cacheGet<RedditPost[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from Reddit public API
  const url = `${REDDIT_API_BASE}/r/${subredditName}/search.json?q=${encodeURIComponent(
    query
  )}&limit=${limit}&t=day&sort=relevance&restrict_sr=true`;
  const data = await fetchReddit(url);

  const posts: RedditPost[] = data.data.children.map((child: any) => parsePost(child.data));

  // Cache for 15 minutes
  await cacheSet(cacheKey, posts, 900);

  return posts;
}

/**
 * Get hot posts from subreddit
 */
export async function getSubredditHotPosts(
  subredditName: string,
  limit: number = 25
): Promise<RedditPost[]> {
  // Check rate limit
  const { success } = await checkRateLimit(`reddit:hot:${subredditName}`, 10, 600);
  if (!success) {
    throw new Error('Rate limit exceeded');
  }

  // Try cache first
  const cacheKey = `reddit:hot:${subredditName}`;
  const cached = await cacheGet<RedditPost[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from Reddit public API
  const url = `${REDDIT_API_BASE}/r/${subredditName}/hot.json?limit=${limit}`;
  const data = await fetchReddit(url);

  const posts: RedditPost[] = data.data.children.map((child: any) => parsePost(child.data));

  // Cache for 10 minutes
  await cacheSet(cacheKey, posts, 600);

  return posts;
}

/**
 * Get post details by ID
 */
export async function getPostDetails(postId: string): Promise<RedditPost> {
  // Try cache first
  const cacheKey = `reddit:post:${postId}`;
  const cached = await cacheGet<RedditPost>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from Reddit public API
  const url = `${REDDIT_API_BASE}/comments/${postId}.json`;
  const data = await fetchReddit(url);

  // Post data is in the first element of the array
  const post = parsePost(data[0].data.children[0].data);

  // Cache for 5 minutes
  await cacheSet(cacheKey, post, 300);

  return post;
}

/**
 * Get new posts from subreddit
 */
export async function getSubredditNewPosts(
  subredditName: string,
  limit: number = 25
): Promise<RedditPost[]> {
  // Check rate limit
  const { success } = await checkRateLimit(`reddit:new:${subredditName}`, 10, 600);
  if (!success) {
    throw new Error('Rate limit exceeded');
  }

  // Try cache first
  const cacheKey = `reddit:new:${subredditName}`;
  const cached = await cacheGet<RedditPost[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from Reddit public API
  const url = `${REDDIT_API_BASE}/r/${subredditName}/new.json?limit=${limit}`;
  const data = await fetchReddit(url);

  const posts: RedditPost[] = data.data.children.map((child: any) => parsePost(child.data));

  // Cache for 5 minutes (new posts change frequently)
  await cacheSet(cacheKey, posts, 300);

  return posts;
}

/**
 * Parse Reddit API comment response into RedditComment
 */
function parseComment(comment: any, depth: number = 0): RedditComment | null {
  // Skip "more" comments placeholder
  if (comment.kind === 'more') {
    return null;
  }

  const data = comment.data;

  // Parse nested replies recursively
  const replies: RedditComment[] = [];
  if (data.replies && typeof data.replies === 'object' && data.replies.data?.children) {
    for (const reply of data.replies.data.children) {
      const parsed = parseComment(reply, depth + 1);
      if (parsed) {
        replies.push(parsed);
      }
    }
  }

  return {
    id: data.id,
    author: data.author || '[deleted]',
    body: data.body || '[deleted]',
    score: data.score || 0,
    created_utc: data.created_utc,
    depth,
    replies: replies.length > 0 ? replies : undefined,
  };
}

/**
 * Get comments for a specific post
 */
export async function getPostComments(
  postId: string,
  subreddit: string,
  limit: number = 50
): Promise<RedditComment[]> {
  // Check rate limit
  const { success } = await checkRateLimit(`reddit:comments:${postId}`, 10, 600);
  if (!success) {
    throw new Error('Rate limit exceeded');
  }

  // Try cache first
  const cacheKey = `reddit:comments:${postId}`;
  const cached = await cacheGet<RedditComment[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from Reddit public API
  const url = `${REDDIT_API_BASE}/r/${subreddit}/comments/${postId}.json?limit=${limit}&depth=3`;
  const data = await fetchReddit(url);

  // Comments are in the second element of the response array
  const commentsListing = data[1];
  const comments: RedditComment[] = [];

  if (commentsListing?.data?.children) {
    for (const child of commentsListing.data.children) {
      const parsed = parseComment(child);
      if (parsed) {
        comments.push(parsed);
      }
    }
  }

  // Cache for 10 minutes
  await cacheSet(cacheKey, comments, 600);

  return comments;
}
