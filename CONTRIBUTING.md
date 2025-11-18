# Contributing to Finance Scoop

First off, thank you for considering contributing to Finance Scoop! 🎉

This document provides guidelines for contributing to this project. Following these guidelines helps maintain code quality and makes the review process smoother for everyone.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please:

- Be respectful and constructive in discussions
- Accept feedback gracefully
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js 20+ installed
- pnpm 10+ installed
- Git installed
- A GitHub account

### Setup Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/finance-scoop.git
cd finance-scoop
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/iamtxena/finance-scoop.git
```

4. **Install dependencies**:
```bash
pnpm install
```

5. **Set up environment variables**:
```bash
cp .env.example .env.local
# Fill in the required values (see SETUP.md)
```

6. **Run the development server**:
```bash
pnpm dev
```

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, browser)

**Template**:
```markdown
## Bug Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., macOS 14.0]
- Node: [e.g., 20.10.0]
- Browser: [e.g., Chrome 120]

## Screenshots
If applicable, add screenshots.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** explaining why this would be useful
- **Proposed solution** or implementation details
- **Alternatives considered**

### Pull Requests

We actively welcome your pull requests! See [Pull Request Process](#pull-request-process) below.

---

## Development Workflow

### Branch Naming Convention

- `feature/short-description` - New features
- `fix/short-description` - Bug fixes
- `docs/short-description` - Documentation updates
- `refactor/short-description` - Code refactoring
- `test/short-description` - Test additions/updates

**Examples**:
- `feature/telegram-notifications`
- `fix/reddit-rate-limiting`
- `docs/api-endpoints`

### Working on an Issue

1. **Comment on the issue** to let others know you're working on it

2. **Create a branch**:
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes** following the [Coding Standards](#coding-standards)

4. **Test your changes** locally

5. **Commit your changes** following [Commit Guidelines](#commit-guidelines)

6. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

7. **Create a Pull Request** on GitHub

---

## Coding Standards

### TypeScript

- **Use explicit types** for function parameters and return values
- **Avoid `any`** - use `unknown` or proper types
- **Use interfaces** for object shapes
- **Use type aliases** for unions and primitives

```typescript
// ✅ Good
interface Alert {
  id: string;
  keywords: string[];
}

function createAlert(data: Alert): Promise<Alert> {
  // ...
}

// ❌ Bad
function createAlert(data: any): any {
  // ...
}
```

### React Components

- **Use functional components** with TypeScript
- **NO useEffect for data fetching** - use React Query
- **Use 'use client'** directive for client components
- **Prefer arrow functions** for component definitions

```typescript
// ✅ Good
'use client';

import { useAlerts } from '@/hooks/use-alerts';

export default function AlertsList() {
  const { data: alerts, isLoading } = useAlerts();
  // ...
}

// ❌ Bad
export default function AlertsList() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch('/api/alerts').then(res => setAlerts(res));
  }, []);
  // ...
}
```

### Import Order

**Critical**: All imports must be at the top of the file, organized in this order:

1. External packages
2. Internal components
3. Hooks
4. Lib/utils
5. Types

```typescript
// ✅ Correct
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useAlerts } from '@/hooks/use-alerts';

import { createClient } from '@/lib/supabase/client';

import type { Alert } from '@/types/alerts';
```

### File Naming

- **Components**: PascalCase (`AlertCard.tsx`)
- **Hooks**: kebab-case with prefix (`use-alerts.ts`)
- **Stores**: kebab-case with suffix (`alert-form-store.ts`)
- **Utils**: kebab-case (`format-date.ts`)
- **API routes**: kebab-case (`route.ts`)

### Code Formatting

- **Indentation**: 2 spaces
- **Line length**: 100 characters (soft limit)
- **Semicolons**: Required
- **Quotes**: Single quotes for strings
- **Trailing commas**: Yes

Run the linter before committing:
```bash
pnpm lint
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(alerts): add Telegram notification support

- Integrate Telegram Bot API
- Add Telegram channel configuration
- Update notification system to support Telegram

Closes #123
```

```bash
fix(reddit): handle rate limit errors gracefully

- Add exponential backoff for rate limited requests
- Display user-friendly error messages
- Cache responses longer to reduce API calls

Fixes #456
```

```bash
docs(setup): update environment variables guide

Added instructions for new Telegram integration
```

### Rules

- Use **present tense** ("add feature" not "added feature")
- Use **imperative mood** ("move cursor to..." not "moves cursor to...")
- Keep subject line **under 72 characters**
- Reference issues and PRs in the footer

---

## Pull Request Process

### Before Creating a PR

1. ✅ Update your branch with latest changes:
```bash
git fetch upstream
git rebase upstream/main
```

2. ✅ Ensure all tests pass locally (see [Testing](#testing))

3. ✅ Run the linter:
```bash
pnpm lint
```

4. ✅ Update documentation if needed

5. ✅ Add/update tests if applicable

### Creating the PR

1. **Fill in the PR template** completely

2. **Link related issues** using keywords:
   - `Closes #123`
   - `Fixes #456`
   - `Resolves #789`

3. **Provide context**:
   - What changes were made?
   - Why were these changes necessary?
   - How were they tested?

4. **Add screenshots/videos** for UI changes

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Closes #(issue)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] Added new tests
- [ ] All tests passing
- [ ] Linter passing

## Screenshots (if applicable)
Add screenshots here.

## Checklist
- [ ] My code follows the coding standards
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
```

### Review Process

- Maintainers will review your PR within 2-3 days
- Address any requested changes
- Once approved, a maintainer will merge your PR
- Your contribution will be included in the next release! 🎉

---

## Testing

### Manual Testing

Before submitting a PR, manually test:

1. **Authentication flows**:
   - Sign up
   - Sign in
   - Sign out

2. **Core features**:
   - Create/edit/delete alerts
   - Search Reddit posts
   - Generate AI drafts
   - Receive notifications

3. **Error states**:
   - Invalid inputs
   - Network errors
   - Rate limiting

4. **Responsive design**:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)

### API Testing

Test API routes with curl or Postman:

```bash
# Test alerts endpoint
curl http://localhost:3000/api/alerts \
  -H "Authorization: Bearer $(get-clerk-token)"

# Test Reddit search
curl -X POST http://localhost:3000/api/reddit/search \
  -H "Content-Type: application/json" \
  -d '{"subreddit": "algotrading", "query": "alerts"}'
```

### Automated Testing (Future)

We plan to add:
- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Playwright

---

## Documentation

### Updating Documentation

When making changes that affect users or developers, update:

1. **README.md** - For user-facing changes
2. **SETUP.md** - For setup/configuration changes
3. **CLAUDE.md** - For code patterns or architecture changes
4. **Code comments** - For complex logic

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Link to external resources when helpful

### JSDoc Comments

Add JSDoc comments for:
- Public functions
- Complex logic
- API endpoints

```typescript
/**
 * Searches a subreddit for posts matching keywords
 *
 * @param subreddit - The subreddit name (without r/)
 * @param query - Search query string
 * @param limit - Maximum number of results (default: 25)
 * @returns Array of Reddit posts
 * @throws Error if rate limit exceeded
 */
export async function searchSubreddit(
  subreddit: string,
  query: string,
  limit: number = 25
): Promise<RedditPost[]> {
  // ...
}
```

---

## Project Structure

Understanding the project structure helps you navigate the codebase:

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API route handlers
├── components/
│   ├── ui/                # shadcn/ui components (don't edit)
│   └── features/          # Feature-specific components
├── hooks/                 # React Query hooks (use-*.ts)
├── stores/                # Zustand stores (*-store.ts)
├── lib/                   # Utility libraries
│   ├── supabase/         # Database clients
│   ├── reddit/           # Reddit API wrapper
│   ├── ai/               # AI agents and prompts
│   ├── redis/            # Cache helpers
│   └── notifications/    # Email/Slack
└── types/                 # TypeScript definitions
```

See [CLAUDE.md](./CLAUDE.md) for detailed patterns and examples.

---

## Questions?

- **Check existing issues** on GitHub
- **Read the documentation**: README.md, SETUP.md, CLAUDE.md
- **Ask in discussions** for general questions
- **Open an issue** for bugs or feature requests

---

## Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Mentioned in our community channels

Thank you for contributing! 🙏

---

**Happy coding!** 🚀
