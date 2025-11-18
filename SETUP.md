# Finance Scoop - Setup Guide

Complete setup instructions for getting your Finance Scoop application up and running.

## Prerequisites

Before starting, ensure you have:
- Node.js 20+ installed
- pnpm 10+ installed (`npm install -g pnpm`)
- Git installed
- Accounts ready for:
  - Clerk (authentication)
  - Supabase (database)
  - Upstash (Redis cache)
  - xAI (Grok AI)
  - LangSmith (AI monitoring)
  - Reddit (API access)
  - Resend (email)
  - Slack (optional, webhooks)

---

## 1. Clone and Install

```bash
git clone https://github.com/iamtxena/finance-scoop.git
cd finance-scoop
pnpm install
```

---

## 2. Clerk Setup (Authentication)

1. Go to [clerk.com](https://clerk.com) and create a new application
2. Name it "Finance Scoop"
3. Enable **Google** and **Email** authentication providers
4. Get your API keys from the dashboard
5. Update `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

---

## 3. Supabase Setup (Database)

### Create Project
1. Go to [supabase.com](https://supabase.com/dashboard)
2. Create new project: "finance-scoop"
3. Choose a strong password and region

### Run Migrations
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy content from `supabase/migrations/001_initial_schema.sql`
3. Paste and run the SQL

### Get API Keys
1. Go to **Settings** > **API**
2. Copy:
   - Project URL
   - anon/public key
   - service_role key (keep secret!)

3. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   SUPABASE_SERVICE_ROLE_KEY=xxx
   ```

---

## 4. Upstash Redis Setup (Caching & Rate Limiting)

1. Go to [upstash.com](https://upstash.com)
2. Create new Redis database: "finance-scoop"
3. Choose **Global** or your preferred region
4. Get **REST URL** and **REST Token**
5. Update `.env.local`:
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx
   ```

---

## 5. xAI Setup (Grok AI)

1. Go to [console.x.ai](https://console.x.ai)
2. Create an API key
3. Update `.env.local`:
   ```
   XAI_API_KEY=xai-xxx
   ```

---

## 6. LangSmith Setup (AI Monitoring)

1. Go to [langsmith.com](https://www.langchain.com/langsmith)
2. Create account and get API key
3. Create a new project named "finance-scoop"
4. Update `.env.local`:
   ```
   LANGCHAIN_TRACING_V2=true
   LANGCHAIN_API_KEY=ls__xxx
   LANGCHAIN_PROJECT=finance-scoop
   ```

---

## 7. Reddit API Setup

### Create Reddit App
1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Click **"create another app..."**
3. Fill in:
   - **name**: finance-scoop
   - **type**: web app
   - **description**: AI-powered finance monitoring
   - **redirect uri**: http://localhost:3000 (for development)
4. Click **Create app**

### Get Credentials
- **Client ID**: Under the app name (short string)
- **Client Secret**: Next to "secret"

### Update Environment
```
REDDIT_APP_ID=xxx
REDDIT_APP_SECRET=xxx
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

**Note**: Consider upgrading to Reddit API Pro tier ($0.24/1K calls) if you need higher rate limits.

---

## 8. Resend Setup (Email Notifications)

1. Go to [resend.com](https://resend.com)
2. Create account and verify your email domain (or use their test domain)
3. Get API key from dashboard
4. Update `.env.local`:
   ```
   RESEND_API_KEY=re_xxx
   RESEND_FROM_EMAIL=notifications@yourdomain.com
   ```

---

## 9. Slack Setup (Optional)

1. Go to your Slack workspace
2. Create a new Slack app at [api.slack.com/apps](https://api.slack.com/apps)
3. Enable **Incoming Webhooks**
4. Create webhook for your channel
5. Update `.env.local`:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
   ```

---

## 10. Generate Cron Secret

Generate a random secret for securing the cron endpoint:

```bash
openssl rand -base64 32
```

Update `.env.local`:
```
CRON_SECRET=your_generated_secret_here
```

---

## 11. Final Environment Setup

Copy the example file and fill in all values:

```bash
cp .env.example .env.local
```

Your `.env.local` should now have all these variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# xAI
XAI_API_KEY=xai-xxx

# LangSmith
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__xxx
LANGCHAIN_PROJECT=finance-scoop

# Reddit
REDDIT_APP_ID=xxx
REDDIT_APP_SECRET=xxx
REDDIT_USERNAME=xxx
REDDIT_PASSWORD=xxx

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=notifications@yourdomain.com

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx

# Cron Secret
CRON_SECRET=your_generated_secret_here
```

---

## 12. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 13. Deploy to Vercel

### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** > **Project**
3. Import your GitHub repository
4. Framework Preset: **Next.js**
5. Root Directory: `./`

### Add Environment Variables
1. In Vercel project settings, go to **Environment Variables**
2. Add all variables from your `.env.local`
3. Make sure to add them for **Production**, **Preview**, and **Development**

### Deploy
1. Click **Deploy**
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

### Configure Cron Job
The cron job is automatically configured via `vercel.json`:
- Runs every 15 minutes
- Path: `/api/cron/check-reddit`
- Secured with `CRON_SECRET`

To test manually:
```bash
curl -X GET https://your-project.vercel.app/api/cron/check-reddit \
  -H "Authorization: Bearer your_cron_secret"
```

---

## 14. Verify Setup

### Test Authentication
1. Go to `/sign-up` and create an account
2. Verify you're redirected to `/dashboard`

### Test Alerts
1. Go to `/alerts`
2. Create a test alert with keywords and subreddits
3. Check Supabase to verify data is saved

### Test Reddit Integration
1. Go to `/subreddits`
2. Browse hot posts from a subreddit
3. Try searching for keywords

### Test AI Features
1. On a Reddit post, click **Analyze**
2. Verify sentiment is returned
3. Click **Draft Reply**
4. Verify AI-generated reply appears

### Test Notifications
1. Wait for cron job to run (15 min intervals)
2. Check your email/Slack for notifications
3. Or manually trigger:
   ```bash
   curl -X GET http://localhost:3000/api/cron/check-reddit \
     -H "Authorization: Bearer your_cron_secret"
   ```

---

## 15. Monitoring & Debugging

### LangSmith Dashboard
1. Go to [langsmith.com](https://www.langchain.com/langsmith)
2. View traces for all AI operations
3. Monitor performance and costs

### Vercel Logs
1. Go to Vercel dashboard > your project
2. Click **Logs** tab
3. Filter by cron jobs to see monitoring activity

### Supabase Database
1. Go to Supabase dashboard
2. **Table Editor** to view data
3. **Logs** to see queries

---

## Troubleshooting

### Reddit API Rate Limits
- Free tier: 100 requests per 10 minutes
- Cached responses last 5-15 minutes
- Consider upgrading to Pro tier for production

### Cron Job Not Running
- Verify `CRON_SECRET` is set in Vercel
- Check Vercel logs for errors
- Ensure `vercel.json` is in root directory

### AI Responses Slow
- Grok models can take 3-5 seconds per request
- Using `grok-4-fast-reasoning` for optimal performance and reasoning (configured in `src/lib/ai/agents.ts`)
- Check LangSmith for latency insights

### Database Connection Issues
- Verify RLS policies are enabled
- Check user_id matches Clerk userId
- Review Supabase logs for auth errors

---

## Next Steps

1. **Customize Lona Context**: Edit `src/lib/ai/prompts.ts` to update Lona's description
2. **Add More Subreddits**: Update default list in `/subreddits` page
3. **Enhance UI**: Customize colors in `tailwind.config.ts`
4. **Add Analytics**: Integrate Vercel Analytics or PostHog
5. **Mobile App**: Consider React Native using the same API routes

---

## Support

- **Issues**: https://github.com/iamtxena/reddit-finance-monitor/issues
- **Discussions**: https://github.com/iamtxena/reddit-finance-monitor/discussions
- **Email**: hello@lona.agency

---

**Built with ♥ for the finance community**
