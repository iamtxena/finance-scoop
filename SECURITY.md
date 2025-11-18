# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Finance Scoop team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:
- **Email**: hello@lona.agency
- **Subject**: [SECURITY] Brief description of the issue

### What to Include

To help us better understand and resolve the issue, please include:

1. **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
2. **Affected component(s)** (e.g., specific file, endpoint, feature)
3. **Steps to reproduce** the vulnerability
4. **Potential impact** of the vulnerability
5. **Proof of concept** (if applicable)
6. **Suggested fix** (if you have one)

### Example Report

```
Subject: [SECURITY] Authentication bypass in /api/alerts

Description:
The alerts API endpoint doesn't properly validate user sessions,
allowing unauthorized users to access other users' alerts.

Steps to Reproduce:
1. Sign out of the application
2. Send GET request to /api/alerts with modified headers
3. Observe unauthorized data access

Impact:
Medium - Allows reading other users' alert configurations

Affected Files:
- src/app/api/alerts/route.ts

Suggested Fix:
Add proper session validation before data access
```

## Response Timeline

- **Acknowledgment**: Within 48 hours of report
- **Initial Assessment**: Within 5 business days
- **Status Updates**: Every 7 days until resolved
- **Fix Timeline**: Varies by severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next scheduled release

## Disclosure Policy

- **Coordinated Disclosure**: We follow coordinated disclosure
- **Public Disclosure**: After a fix is released
- **Credit**: We'll credit you in release notes (unless you prefer to remain anonymous)

## Security Best Practices

When contributing to this project:

### Authentication & Authorization

- Always use Clerk's `auth()` in API routes
- Verify user owns resources before allowing access
- Never expose sensitive data in API responses
- Use Supabase RLS policies for database access

### Data Handling

- Sanitize user inputs
- Use parameterized queries (Supabase handles this)
- Never store sensitive data in localStorage
- Encrypt sensitive data at rest

### API Security

- Rate limit all API endpoints
- Validate all inputs
- Use HTTPS only (enforced by Vercel)
- Set appropriate CORS headers
- Secure cron endpoints with secrets

### Dependencies

- Keep dependencies up to date
- Review Dependabot alerts weekly
- Audit new dependencies before adding
- Use `npm audit` / `pnpm audit` regularly

### Environment Variables

- Never commit `.env` files
- Rotate secrets regularly
- Use different secrets for dev/staging/prod
- Limit access to production secrets

## Known Security Considerations

### Current Implementation

1. **API Keys in Environment**
   - All API keys stored in environment variables
   - Not accessible to client-side code
   - Properly scoped permissions

2. **Row-Level Security (RLS)**
   - Enabled on all Supabase tables
   - User isolation enforced at database level
   - Policies tested and verified

3. **Authentication**
   - Clerk handles auth securely
   - JWT tokens properly validated
   - Session management handled by Clerk

4. **Rate Limiting**
   - Implemented via Upstash Redis
   - 10 requests per 10 minutes per endpoint
   - Prevents abuse and API cost overruns

5. **Cron Job Security**
   - Secured with CRON_SECRET
   - Only accessible with valid bearer token
   - No sensitive data in response

### Potential Risks

1. **Third-Party APIs**
   - Reddit API rate limits
   - xAI API availability
   - LangSmith data retention

2. **Data Retention**
   - Reddit posts stored indefinitely
   - Consider implementing data cleanup policies

3. **AI-Generated Content**
   - Grok outputs should be reviewed before posting
   - No guarantee of accuracy or appropriateness

## Security Updates

We'll announce security updates via:
- GitHub Security Advisories
- Release notes
- Email to registered users (future)

## Compliance

This project aims to comply with:
- OWASP Top 10 guidelines
- API security best practices
- Data protection principles

## Contact

For non-security issues, please use GitHub Issues.

For security concerns: hello@lona.agency

---

**Thank you for helping keep Finance Scoop secure!** 🔒
