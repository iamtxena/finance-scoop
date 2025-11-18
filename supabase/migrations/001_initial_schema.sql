-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  reddit_username TEXT,
  notification_email BOOLEAN DEFAULT true,
  notification_slack BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monitored_subreddits table
CREATE TABLE IF NOT EXISTS monitored_subreddits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create reddit_posts table
CREATE TABLE IF NOT EXISTS reddit_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL UNIQUE,
  subreddit TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  author TEXT NOT NULL,
  url TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  num_comments INTEGER DEFAULT 0,
  sentiment TEXT CHECK (sentiment IN ('opportunity', 'neutral', 'irrelevant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create keyword_alerts table
CREATE TABLE IF NOT EXISTS keyword_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  subreddits TEXT[] NOT NULL,
  active BOOLEAN DEFAULT true,
  trigger_mode TEXT DEFAULT 'recurring' CHECK (trigger_mode IN ('single', 'recurring')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_drafts table
CREATE TABLE IF NOT EXISTS ai_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  draft_content TEXT NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'slack')),
  content TEXT NOT NULL,
  sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_monitored_subreddits_user_id ON monitored_subreddits(user_id);
CREATE INDEX idx_reddit_posts_user_id ON reddit_posts(user_id);
CREATE INDEX idx_reddit_posts_sentiment ON reddit_posts(sentiment);
CREATE INDEX idx_reddit_posts_fetched_at ON reddit_posts(fetched_at DESC);
CREATE INDEX idx_keyword_alerts_user_id ON keyword_alerts(user_id);
CREATE INDEX idx_keyword_alerts_active ON keyword_alerts(active);
CREATE INDEX idx_ai_drafts_user_id ON ai_drafts(user_id);
CREATE INDEX idx_ai_drafts_post_id ON ai_drafts(post_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_sent ON notifications(sent);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_subreddits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view their own monitored subreddits"
  ON monitored_subreddits FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can manage their own monitored subreddits"
  ON monitored_subreddits FOR ALL
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view their own reddit posts"
  ON reddit_posts FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can manage their own reddit posts"
  ON reddit_posts FOR ALL
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view their own keyword alerts"
  ON keyword_alerts FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can manage their own keyword alerts"
  ON keyword_alerts FOR ALL
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view their own ai drafts"
  ON ai_drafts FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can manage their own ai drafts"
  ON ai_drafts FOR ALL
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can manage their own notifications"
  ON notifications FOR ALL
  USING (auth.jwt() ->> 'sub' = user_id);
