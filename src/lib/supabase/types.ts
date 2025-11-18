export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          reddit_username: string | null
          notification_email: boolean
          notification_slack: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reddit_username?: string | null
          notification_email?: boolean
          notification_slack?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reddit_username?: string | null
          notification_email?: boolean
          notification_slack?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      monitored_subreddits: {
        Row: {
          id: string
          user_id: string
          name: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          active?: boolean
          created_at?: string
        }
      }
      reddit_posts: {
        Row: {
          id: string
          user_id: string
          post_id: string
          subreddit: string
          title: string
          content: string
          author: string
          url: string
          score: number
          num_comments: number
          sentiment: 'opportunity' | 'neutral' | 'irrelevant' | null
          created_at: string
          fetched_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          subreddit: string
          title: string
          content?: string
          author: string
          url: string
          score?: number
          num_comments?: number
          sentiment?: 'opportunity' | 'neutral' | 'irrelevant' | null
          created_at: string
          fetched_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          subreddit?: string
          title?: string
          content?: string
          author?: string
          url?: string
          score?: number
          num_comments?: number
          sentiment?: 'opportunity' | 'neutral' | 'irrelevant' | null
          created_at?: string
          fetched_at?: string
        }
      }
      keyword_alerts: {
        Row: {
          id: string
          user_id: string
          keywords: string[]
          subreddits: string[]
          active: boolean
          trigger_mode: 'single' | 'recurring'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          keywords: string[]
          subreddits: string[]
          active?: boolean
          trigger_mode?: 'single' | 'recurring'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          keywords?: string[]
          subreddits?: string[]
          active?: boolean
          trigger_mode?: 'single' | 'recurring'
          created_at?: string
          updated_at?: string
        }
      }
      ai_drafts: {
        Row: {
          id: string
          user_id: string
          post_id: string
          draft_content: string
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          draft_content: string
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          draft_content?: string
          used?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'email' | 'slack'
          content: string
          sent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'email' | 'slack'
          content: string
          sent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'email' | 'slack'
          content?: string
          sent?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
