import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Finance Scoop</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-24">
        <div className="max-w-4xl text-center space-y-6">
          <h2 className="text-5xl font-bold tracking-tight">
            AI-Powered Reddit Monitoring for Finance
          </h2>
          <p className="text-xl text-muted-foreground">
            Track finance discussions, detect opportunities, and generate smart replies
            for promoting Lona with Grok AI
          </p>

          <div className="flex gap-4 justify-center pt-6">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start Monitoring</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12 text-left">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Smart Alerts</h3>
              <p className="text-sm text-muted-foreground">
                Monitor keywords in finance subreddits and get notified of opportunities
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Sentiment analysis with Grok to identify high-value posts
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Auto Drafts</h3>
              <p className="text-sm text-muted-foreground">
                Generate elegant replies for promoting Lona automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
