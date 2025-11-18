# Finance Scoop

> AI-powered social media monitoring for finance discussions and business opportunities

Monitor Reddit (with X/Twitter support coming soon) for finance-related discussions, analyze sentiment with AI, and generate smart reply drafts to promote your products naturally.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## 🎯 What It Does

Finance Scoop helps you:

- **Monitor** finance/trading discussions on Reddit in real-time
- **Detect** opportunities where your product (like Lona) would be valuable
- **Analyze** sentiment using AI (Grok) to identify high-value posts
- **Generate** intelligent reply drafts that you can copy and post
- **Get notified** via email or Slack when relevant discussions happen

---

## ✨ Key Features

### 📊 Reddit Monitoring

- Browse hot/new posts from finance subreddits
- Search for specific keywords across subreddits
- Real-time updates (15-minute cron job)
- **No Reddit API authentication required** - Uses public JSON endpoints

### 🤖 AI-Powered Analysis

- Sentiment analysis (opportunity/neutral/irrelevant)
- Smart reply generation using Grok-3
- Context-aware drafts that sound natural
- LangSmith monitoring for AI performance

### 🔔 Smart Alerts

- Keyword-based monitoring
- Multi-subreddit support
- Recurring or single-trigger alerts
- Email and Slack notifications

### ✍️ Reply Drafting

- AI generates elegant, helpful responses
- Promotes your product naturally
- Copy-to-clipboard workflow (manual posting)
- Saves drafts to database for tracking

### 🎨 Modern UI

- Built with shadcn/ui components
- Responsive design (mobile-friendly)
- Real-time data updates with React Query
- Dark mode ready

---

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **State**: TanStack React Query + Zustand
- **Auth**: Clerk

### Backend

- **Database**: Supabase (PostgreSQL + RLS)
- **Caching**: Upstash Redis
- **AI**: xAI Grok-3 via AI SDK v5
- **Monitoring**: LangSmith
- **Notifications**: Resend (email), Slack (webhooks)

### Infrastructure

- **Hosting**: Vercel
- **Scheduling**: Vercel Cron
- **Package Manager**: pnpm

---

## 📋 What's Implemented

### ✅ Working Features

- **Authentication**: Sign up/in with Clerk (Google OAuth + Email)
- **Dashboard**: Overview of alerts and monitoring status
- **Reddit Integration**:
  - Browse subreddits (wallstreetbets, stocks, investing, etc.)
  - Search posts by keywords
  - View post details
  - **Uses Reddit's public JSON API (no authentication)**
- **AI Features**:
  - Sentiment analysis on posts
  - Draft reply generation
  - All AI calls monitored via LangSmith
- **Alerts System**:
  - Create keyword-based alerts
  - Toggle alerts on/off
  - Recurring or single-trigger modes
- **Notifications**:
  - Email via Resend
  - Slack webhooks
- **Caching**: Redis-based caching for API calls
- **Database**: Full Supabase integration with RLS

### 🔮 Planned Features

- **X/Twitter Integration**: Monitor Twitter/X for finance discussions
- **Advanced Filters**: Sentiment scoring, engagement thresholds
- **Analytics Dashboard**: Track mention trends, engagement metrics
- **Browser Extension**: Quick reply drafting from any Reddit page
- **Mobile App**: React Native companion app

---

## 🔑 Reddit API Approach

### Important: Public API Implementation

Due to Reddit's 2023-2024 API restrictions, this project uses **Reddit's public JSON endpoints** instead of OAuth:

**Advantages:**

- ✅ No API key required
- ✅ No rate limits (reasonable usage)
- ✅ Access to all public subreddits
- ✅ Free forever
- ✅ Simple implementation

**Limitations:**

- ❌ Read-only (cannot post comments via API)
- ❌ No access to private subreddits
- ❌ Cannot act as a specific user

**Workflow:**

1. App monitors Reddit and detects opportunities
2. AI generates reply draft
3. **You manually copy and paste** the draft to Reddit
4. App tracks which drafts you've used

This approach sidesteps Reddit's strict API approval process while still providing full monitoring capabilities.

---

## 🛠️ Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+
- Accounts for:
  - [Clerk](https://clerk.com) (auth)
  - [Supabase](https://supabase.com) (database)
  - [Upstash](https://upstash.com) (Redis)
  - [xAI](https://console.x.ai) (Grok AI)
  - [LangSmith](https://smith.langchain.com) (optional, AI monitoring)
  - [Resend](https://resend.com) (optional, email)
  - [Slack](https://api.slack.com/apps) (optional, notifications)

### Installation

```bash
# Clone repository
git clone https://github.com/iamtxena/finance-scoop.git
cd finance-scoop

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see SETUP.md for details)

# Run database migrations
# 1. Go to Supabase dashboard
# 2. Open SQL Editor
# 3. Copy & run: supabase/migrations/001_initial_schema.sql

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Detailed Setup

See [SETUP.md](./SETUP.md) for comprehensive setup instructions including:

- Service-by-service configuration
- Environment variable details
- Database migration steps
- Troubleshooting guide

---

## 📁 Project Structure

```
finance-scoop/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── alerts/        # Alert management
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── drafts/        # AI-generated drafts
│   │   │   └── subreddits/    # Reddit browsing
│   │   └── api/               # API routes
│   │       ├── ai/            # AI operations
│   │       ├── alerts/        # Alert CRUD
│   │       ├── cron/          # Scheduled jobs
│   │       └── reddit/        # Reddit integration
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── features/          # Feature components
│   ├── hooks/                 # React Query hooks
│   ├── lib/
│   │   ├── ai/                # AI agents & prompts
│   │   ├── reddit/            # Reddit client
│   │   ├── supabase/          # Database client
│   │   └── redis/             # Cache client
│   └── stores/                # Zustand state
├── supabase/
│   └── migrations/            # SQL migrations
└── public/                    # Static assets
```

---

## 🔐 Environment Variables

Required for basic functionality:

```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
XAI_API_KEY=

# Caching
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional
LANGCHAIN_API_KEY=         # AI monitoring
RESEND_API_KEY=            # Email notifications
SLACK_WEBHOOK_URL=         # Slack notifications
CRON_SECRET=               # Secure cron endpoint
```

See `.env.example` for complete list with descriptions.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

Cron jobs are configured automatically via `vercel.json`.

### Other Platforms

Any platform supporting Next.js 16+ works:

- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

---

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Complete configuration walkthrough
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines
- **[Developer Guide](./CLAUDE.md)** - Code patterns and conventions
- **[Security Policy](./SECURITY.md)** - Security guidelines
- **[Code of Conduct](./CODE_OF_CONDUCT.md)** - Community standards

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm build` (ensure no errors)
5. Commit: `git commit -m "Add amazing feature"`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 🐛 Known Issues & Limitations

### Reddit API

- **Read-only access**: Cannot post comments programmatically
- **No authentication**: Uses public JSON endpoints only
- **Workaround**: Manual copy/paste of AI-generated drafts

### Rate Limiting

- Reddit: Self-imposed 10 requests/10 minutes (cached heavily)
- Supabase: Standard tier limits apply
- xAI: Depends on your plan

### Future Improvements

- X/Twitter integration pending API access
- Advanced analytics dashboard
- Mobile apps (iOS/Android)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

This means you can:

- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately

---

## 👤 Author

**iamtxena**

- GitHub: [@iamtxena](https://github.com/iamtxena)
- Website: [lona.agency](https://lona.agency)

---

## 🙏 Acknowledgments

- Built for the finance community
- Powered by [Grok AI](https://x.ai)
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Inspired by the need for better social monitoring tools

---

## 📊 Related Projects

- **[Lona](https://lona.agency)** - AI-powered trading alerts
- **[Weezer Stock Alerts](https://github.com/iamtxena/weezer-stock-alerts)** - Stock price monitoring

---

## ⭐ Support

If you find this project helpful:

- Star the repository
- Share with others
- [Report bugs](https://github.com/iamtxena/finance-scoop/issues)
- [Suggest features](https://github.com/iamtxena/finance-scoop/issues)

---

**Built with ♥ for smarter finance monitoring**
