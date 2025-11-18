import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              Finance Scoop
            </Link>
            <nav className="flex gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/alerts"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Alerts
              </Link>
              <Link
                href="/subreddits"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Subreddits
              </Link>
              <Link
                href="/drafts"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Drafts
              </Link>
            </nav>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
